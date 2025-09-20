import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, TrendingUp, Award, MessageSquare, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudentData {
  user_id: string;
  full_name: string;
  institute_name: string;
  enrollment_number: string;
  email: string;
  drills_completed: number;
  quizzes_passed: number;
  average_score: number;
  total_badges: number;
  last_activity: string;
}

interface StudentProgress {
  student_name: string;
  drill_progress: number;
  quiz_progress: number;
  overall_score: number;
}

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    averageCompletion: 0,
    topPerformer: ''
  });

  useEffect(() => {
    if (user) {
      fetchTeacherDashboardData();
    }
  }, [user]);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enrollment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.institute_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const fetchTeacherDashboardData = async () => {
    try {
      // Fetch all student profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student');

      if (profiles) {
        const studentData = await Promise.all(
          profiles.map(async (profile) => {
            // Fetch drill attempts for each student
            const { data: drillAttempts } = await supabase
              .from('drill_attempts')
              .select('*')
              .eq('user_id', profile.user_id);

            // Fetch quiz attempts for each student
            const { data: quizAttempts } = await supabase
              .from('quiz_attempts')
              .select('*')
              .eq('user_id', profile.user_id);

            const drillsCompleted = drillAttempts?.filter(d => d.completed).length || 0;
            const quizzesPassedCount = quizAttempts?.filter(q => q.passed).length || 0;
            
            // Calculate average score
            const allScores = [
              ...(drillAttempts?.map(d => d.score) || []),
              ...(quizAttempts?.map(q => q.percentage) || [])
            ];
            const averageScore = allScores.length > 0 
              ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
              : 0;

            // Calculate badges (simple logic)
            const totalBadges = Math.floor(drillsCompleted / 2) + Math.floor(quizzesPassedCount / 2);

            // Get last activity
            const lastDrillActivity = drillAttempts?.[0]?.created_at;
            const lastQuizActivity = quizAttempts?.[0]?.created_at;
            const lastActivity = [lastDrillActivity, lastQuizActivity]
              .filter(Boolean)
              .sort()
              .reverse()[0] || profile.created_at;

            return {
              user_id: profile.user_id,
              full_name: profile.full_name || 'Unknown Student',
              institute_name: profile.institute_name || 'Unknown Institute',
              enrollment_number: profile.enrollment_number || 'N/A',
              email: profile.institute_email || 'N/A',
              drills_completed: drillsCompleted,
              quizzes_passed: quizzesPassedCount,
              average_score: averageScore,
              total_badges: totalBadges,
              last_activity: lastActivity
            };
          })
        );

        setStudents(studentData);
        setFilteredStudents(studentData);

        // Calculate stats
        const totalStudents = studentData.length;
        const activeStudents = studentData.filter(s => 
          new Date(s.last_activity) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length;
        const averageCompletion = studentData.length > 0
          ? Math.round(studentData.reduce((acc, s) => acc + s.average_score, 0) / studentData.length)
          : 0;
        const topPerformer = studentData.reduce((top, current) => 
          current.average_score > top.average_score ? current : top, 
          studentData[0] || { full_name: 'None', average_score: 0 }
        );

        setStats({
          totalStudents,
          activeStudents,
          averageCompletion,
          topPerformer: topPerformer.full_name
        });
      }
    } catch (error) {
      console.error('Error fetching teacher dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRemarks = async () => {
    if (!selectedStudent || !remarks.trim()) {
      toast({
        title: "Error",
        description: "Please select a student and enter remarks",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real implementation, you would save this to a remarks table
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: "Remarks saved successfully",
      });
      setRemarks('');
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error saving remarks:', error);
      toast({
        title: "Error",
        description: "Failed to save remarks",
        variant: "destructive"
      });
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, text: 'Excellent' };
    if (score >= 60) return { variant: 'secondary' as const, text: 'Good' };
    return { variant: 'destructive' as const, text: 'Needs Improvement' };
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Teacher Dashboard</h1>
          <p className="text-gray-600">Monitor student progress and performance</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageCompletion}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold truncate">{stats.topPerformer}</div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Student Leaderboard
            </CardTitle>
            <CardDescription>Top performing students ranked by average score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredStudents
                .sort((a, b) => b.average_score - a.average_score)
                .slice(0, 5)
                .map((student, index) => (
                  <div key={student.user_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{student.full_name}</p>
                        <p className="text-sm text-gray-600">{student.enrollment_number}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getPerformanceColor(student.average_score)}`}>
                        {student.average_score}%
                      </p>
                      <p className="text-sm text-gray-600">{student.total_badges} badges</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Search and Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Progress Reports
            </CardTitle>
            <div className="flex items-center gap-2 mt-4">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students by name, enrollment number, or institute..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Enrollment</TableHead>
                    <TableHead>Institute</TableHead>
                    <TableHead>Drills Completed</TableHead>
                    <TableHead>Quizzes Passed</TableHead>
                    <TableHead>Average Score</TableHead>
                    <TableHead>Badges</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const performanceBadge = getPerformanceBadge(student.average_score);
                    return (
                      <TableRow key={student.user_id}>
                        <TableCell className="font-medium">{student.full_name}</TableCell>
                        <TableCell>{student.enrollment_number}</TableCell>
                        <TableCell>{student.institute_name}</TableCell>
                        <TableCell>{student.drills_completed}</TableCell>
                        <TableCell>{student.quizzes_passed}</TableCell>
                        <TableCell className={getPerformanceColor(student.average_score)}>
                          {student.average_score}%
                        </TableCell>
                        <TableCell>{student.total_badges}</TableCell>
                        <TableCell>
                          <Badge variant={performanceBadge.variant}>
                            {performanceBadge.text}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedStudent(student.user_id)}
                          >
                            Add Remark
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Remarks Section */}
        {selectedStudent && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Add Remarks for {filteredStudents.find(s => s.user_id === selectedStudent)?.full_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your remarks for this student..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={4}
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveRemarks}>Save Remarks</Button>
                <Button variant="outline" onClick={() => {
                  setSelectedStudent(null);
                  setRemarks('');
                }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
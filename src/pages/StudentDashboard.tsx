import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Award, BookOpen, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  full_name: string;
  role: string;
  institute_name: string;
  enrollment_number: string;
  state: string;
  city: string;
}

interface DrillProgress {
  drill_id: string;
  title: string;
  completed: boolean;
  score: number;
  completed_at: string;
}

interface QuizProgress {
  quiz_id: string;
  title: string;
  score: number;
  max_score: number;
  percentage: number;
  passed: boolean;
  completed_at: string;
}

interface BadgeData {
  id: string;
  name: string;
  description: string;
  earned_at: string;
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [drillProgress, setDrillProgress] = useState<DrillProgress[]>([]);
  const [quizProgress, setQuizProgress] = useState<QuizProgress[]>([]);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch drill progress
      const { data: drillData } = await supabase
        .from('drill_attempts')
        .select(`
          drill_id,
          score,
          completed,
          completed_at,
          mock_drills(title)
        `)
        .eq('user_id', user?.id);

      if (drillData) {
        const formattedDrillData = drillData.map(item => ({
          drill_id: item.drill_id,
          title: (item as any).mock_drills?.title || 'Unknown Drill',
          completed: item.completed,
          score: item.score,
          completed_at: item.completed_at
        }));
        setDrillProgress(formattedDrillData);
      }

      // Fetch quiz progress
      const { data: quizData } = await supabase
        .from('quiz_attempts')
        .select(`
          quiz_id,
          score,
          max_score,
          percentage,
          passed,
          completed_at,
          quizzes(title)
        `)
        .eq('user_id', user?.id);

      if (quizData) {
        const formattedQuizData = quizData.map(item => ({
          quiz_id: item.quiz_id,
          title: (item as any).quizzes?.title || 'Disaster Management Quiz',
          score: item.score,
          max_score: item.max_score,
          percentage: item.percentage,
          passed: item.passed,
          completed_at: item.completed_at
        }));
        setQuizProgress(formattedQuizData);
      }

      // Generate badges based on achievements
      const earnedBadges = [];
      const completedDrills = drillData?.filter(d => d.completed).length || 0;
      const passedQuizzes = quizData?.filter(q => q.passed).length || 0;

      if (completedDrills >= 1) {
        earnedBadges.push({
          id: 'first-drill',
          name: 'First Steps',
          description: 'Completed your first drill',
          earned_at: new Date().toISOString()
        });
      }
      if (completedDrills >= 5) {
        earnedBadges.push({
          id: 'drill-expert',
          name: 'Drill Expert',
          description: 'Completed 5 drills',
          earned_at: new Date().toISOString()
        });
      }
      if (passedQuizzes >= 1) {
        earnedBadges.push({
          id: 'quiz-master',
          name: 'Quiz Master',
          description: 'Passed your first quiz',
          earned_at: new Date().toISOString()
        });
      }
      if (passedQuizzes >= 3) {
        earnedBadges.push({
          id: 'knowledge-seeker',
          name: 'Knowledge Seeker',
          description: 'Passed 3 quizzes',
          earned_at: new Date().toISOString()
        });
      }

      setBadges(earnedBadges);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallProgress = () => {
    const totalDrills = drillProgress.length;
    const completedDrills = drillProgress.filter(d => d.completed).length;
    const totalQuizzes = quizProgress.length;
    const passedQuizzes = quizProgress.filter(q => q.passed).length;
    
    const drillProgressPercent = totalDrills > 0 ? (completedDrills / totalDrills) * 50 : 0;
    const quizProgressPercent = totalQuizzes > 0 ? (passedQuizzes / totalQuizzes) * 50 : 0;
    
    return Math.round(drillProgressPercent + quizProgressPercent);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {profile?.full_name || 'Student'}!
          </h1>
          <p className="text-gray-600">Track your disaster preparedness progress</p>
        </div>

        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Student Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Institute</p>
                <p className="font-semibold">{profile?.institute_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Enrollment Number</p>
                <p className="font-semibold">{profile?.enrollment_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">{profile?.city}, {profile?.state}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Completion Rate</span>
                <span>{calculateOverallProgress()}%</span>
              </div>
              <Progress value={calculateOverallProgress()} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Your Badges
            </CardTitle>
            <CardDescription>Achievements earned through your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            {badges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <div key={badge.id} className="text-center p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50">
                    <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-800">{badge.name}</h3>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">Complete drills and quizzes to earn badges!</p>
            )}
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Drill Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Virtual Drill Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {drillProgress.length > 0 ? drillProgress.map((drill, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">{drill.title}</p>
                      <p className="text-sm text-gray-600">Score: {drill.score}%</p>
                    </div>
                    <Badge variant={drill.completed ? "default" : "secondary"}>
                      {drill.completed ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                )) : (
                  <p className="text-gray-600 text-center py-4">No drills attempted yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quiz Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quizProgress.length > 0 ? quizProgress.map((quiz, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">{quiz.title}</p>
                      <p className="text-sm text-gray-600">
                        {quiz.score}/{quiz.max_score} ({quiz.percentage}%)
                      </p>
                    </div>
                    <Badge variant={quiz.passed ? "default" : "destructive"}>
                      {quiz.passed ? "Passed" : "Failed"}
                    </Badge>
                  </div>
                )) : (
                  <p className="text-gray-600 text-center py-4">No quizzes attempted yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
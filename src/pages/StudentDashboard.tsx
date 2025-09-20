import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Award, BookOpen, Target, Edit, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface UserProfile {
  full_name: string;
  role: string;
  institute_name: string;
  enrollment_number: string;
  state: string;
  city: string;
  institute_email: string;
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
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

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

  const handleEditProfile = () => {
    setEditedProfile(profile);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!editedProfile || !user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editedProfile.full_name,
          institute_name: editedProfile.institute_name,
          enrollment_number: editedProfile.enrollment_number,
          state: editedProfile.state,
          city: editedProfile.city,
          institute_email: editedProfile.institute_email
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(editedProfile);
      setIsEditingProfile(false);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(null);
    setIsEditingProfile(false);
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
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Student Profile
              </div>
              {!isEditingProfile ? (
                <Button variant="outline" size="sm" onClick={handleEditProfile}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleSaveProfile}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isEditingProfile ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-semibold">{profile?.full_name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Institute</p>
                  <p className="font-semibold">{profile?.institute_name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Enrollment Number</p>
                  <p className="font-semibold">{profile?.enrollment_number || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">State</p>
                  <p className="font-semibold">{profile?.state || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-semibold">{profile?.city || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Institute Email</p>
                  <p className="font-semibold">{profile?.institute_email || 'Not provided'}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={editedProfile?.full_name || ''}
                    onChange={(e) => setEditedProfile(prev => prev ? {...prev, full_name: e.target.value} : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="institute_name">Institute Name</Label>
                  <Input
                    id="institute_name"
                    value={editedProfile?.institute_name || ''}
                    onChange={(e) => setEditedProfile(prev => prev ? {...prev, institute_name: e.target.value} : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="enrollment_number">Enrollment Number</Label>
                  <Input
                    id="enrollment_number"
                    value={editedProfile?.enrollment_number || ''}
                    onChange={(e) => setEditedProfile(prev => prev ? {...prev, enrollment_number: e.target.value} : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={editedProfile?.state || ''}
                    onChange={(e) => setEditedProfile(prev => prev ? {...prev, state: e.target.value} : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={editedProfile?.city || ''}
                    onChange={(e) => setEditedProfile(prev => prev ? {...prev, city: e.target.value} : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="institute_email">Institute Email</Label>
                  <Input
                    id="institute_email"
                    type="email"
                    value={editedProfile?.institute_email || ''}
                    onChange={(e) => setEditedProfile(prev => prev ? {...prev, institute_email: e.target.value} : null)}
                  />
                </div>
              </div>
            )}
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
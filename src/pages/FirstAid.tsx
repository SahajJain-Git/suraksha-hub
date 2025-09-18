import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowLeft, Play, CheckCircle, Lock, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FirstAidModule {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
  lessons?: number;
}

const firstAidModules: FirstAidModule[] = [
  {
    id: 'basic-first-aid',
    title: 'Basic First Aid Training',
    description: 'Comprehensive first aid training covering essential life-saving techniques',
    videoUrl: 'https://www.youtube.com/embed/videoseries?list=PLvd0isBh6beSOLBYTc581vBXcO_qHeWR6',
    duration: '45 min',
    order: 1,
    lessons: 12
  },
  {
    id: 'emergency-response',
    title: 'Emergency Response Protocols',
    description: 'Advanced emergency response techniques and protocols for various situations',
    videoUrl: 'https://www.youtube.com/embed/videoseries?list=PLmPSel131uaq2IEKzPo4tczCMnYPv0kI6',
    duration: '30 min',
    order: 2,
    lessons: 8
  },
  {
    id: 'cpr-basics',
    title: 'CPR and AED Training',
    description: 'Learn cardiopulmonary resuscitation and automated external defibrillator usage',
    videoUrl: 'https://www.youtube.com/embed/Mlp5dRIJk4M',
    duration: '20 min',
    order: 3,
    lessons: 1
  }
];

const FirstAid = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [currentModule, setCurrentModule] = useState<FirstAidModule | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchUserProgress = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const completed = new Set(
        data?.filter(progress => progress.completion_percentage === 100)
                .map(progress => progress.module_id) || []
      );
      setCompletedModules(completed);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const markModuleCompleted = async (moduleId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          module_id: moduleId,
          completion_percentage: 100,
          completed_at: new Date().toISOString(),
          last_accessed: new Date().toISOString()
        });

      if (error) throw error;

      setCompletedModules(prev => new Set([...prev, moduleId]));
      toast({
        title: "Module Completed!",
        description: "Great job! You've completed this first aid module.",
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateOverallProgress = () => {
    return (completedModules.size / firstAidModules.length) * 100;
  };

  const isModuleUnlocked = (module: FirstAidModule) => {
    if (module.order === 1) return true;
    const previousModule = firstAidModules.find(m => m.order === module.order - 1);
    return previousModule ? completedModules.has(previousModule.id) : false;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access first aid courses
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/student-auth')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentModule) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentModule(null)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Modules
                </Button>
                <div className="flex items-center gap-2">
                  <Shield className="w-8 h-8 text-primary" />
                  <h1 className="text-2xl font-bold">Suraksha</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{currentModule.title}</h1>
              <p className="text-muted-foreground">{currentModule.description}</p>
            </div>

            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={currentModule.videoUrl}
                title={currentModule.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Badge variant="outline">Duration: {currentModule.duration}</Badge>
                {currentModule.lessons && (
                  <Badge variant="outline">{currentModule.lessons} Lessons</Badge>
                )}
              </div>
              {!completedModules.has(currentModule.id) && (
                <Button onClick={() => markModuleCompleted(currentModule.id)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </Button>
              )}
              {completedModules.has(currentModule.id) && (
                <Badge className="bg-success">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
              <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold">Suraksha</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-5xl font-bold mb-6">
            First Aid <span className="text-primary">Training</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Learn life-saving medical response techniques through structured video lessons. 
            Master essential first aid skills with progress tracking and checkpoint-based learning.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(calculateOverallProgress())}%</span>
            </div>
            <Progress value={calculateOverallProgress()} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {completedModules.size} of {firstAidModules.length} modules completed
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center mb-8">Learning Pathway</h2>
          
          {firstAidModules.map((module, index) => {
            const isCompleted = completedModules.has(module.id);
            const isUnlocked = isModuleUnlocked(module);
            
            return (
              <Card key={module.id} className={`transition-all duration-200 ${isCompleted ? 'border-success' : ''}`}>
                <CardContent className="p-8">
                  <div className="flex items-center gap-8">
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                        isCompleted ? 'bg-success' : isUnlocked ? 'bg-primary' : 'bg-muted'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-8 h-8" />
                        ) : isUnlocked ? (
                          module.order
                        ) : (
                          <Lock className="w-8 h-8" />
                        )}
                      </div>
                      {index < firstAidModules.length - 1 && (
                        <div className={`w-1 h-16 mt-4 ${
                          isCompleted ? 'bg-success' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-3">{module.title}</h3>
                      <p className="text-muted-foreground mb-4 text-lg">{module.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                          <Badge variant="outline" className="text-sm">
                            Duration: {module.duration}
                          </Badge>
                          {module.lessons && (
                            <Badge variant="outline" className="text-sm">
                              {module.lessons} Lessons
                            </Badge>
                          )}
                        </div>
                        <Button
                          onClick={() => setCurrentModule(module)}
                          disabled={!isUnlocked}
                          variant={isCompleted ? "outline" : "default"}
                          size="lg"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {isCompleted ? "Review" : isUnlocked ? "Start Learning" : "Locked"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default FirstAid;
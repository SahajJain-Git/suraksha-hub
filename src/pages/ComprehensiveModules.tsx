import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowLeft, Play, CheckCircle, Lock, ExternalLink, BookOpen, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Module {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'pdf';
  duration: string;
  order: number;
}

const modulesSections = {
  'class6-above': {
    title: 'Class 6 and Above',
    description: 'Advanced disaster preparedness modules for older students',
    icon: '🎓',
    color: 'bg-blue-500',
    modules: [
      {
        id: 'advanced1',
        title: 'Advanced Emergency Planning',
        description: 'Comprehensive emergency planning strategies for schools and communities',
        url: 'https://www.ready.gov/schools',
        type: 'article' as const,
        duration: '15 min read',
        order: 1
      },
      {
        id: 'advanced2',
        title: 'Climate Change and Disasters',
        description: 'Understanding the relationship between climate change and natural disasters',
        url: 'https://www.noaa.gov/education/resource-collections/climate/climate-change-impacts',
        type: 'article' as const,
        duration: '20 min read',
        order: 2
      },
      {
        id: 'advanced3',
        title: 'Community Resilience Building',
        description: 'Learn how communities can build resilience against disasters',
        url: 'https://www.fema.gov/emergency-managers/risk-management/resilience',
        type: 'article' as const,
        duration: '25 min read',
        order: 3
      },
      {
        id: 'advanced4',
        title: 'Technology in Disaster Management',
        description: 'How technology helps in disaster preparedness and response',
        url: 'https://www.undrr.org/publication/words-action-guidelines-national-disaster-risk-reduction-strategies',
        type: 'article' as const,
        duration: '18 min read',
        order: 4
      },
      {
        id: 'advanced5',
        title: 'Leadership During Emergencies',
        description: 'Developing leadership skills for emergency situations',
        url: 'https://training.fema.gov/is/courseoverview.aspx?code=IS-230.d',
        type: 'article' as const,
        duration: '30 min read',
        order: 5
      }
    ]
  },
  'class6-below': {
    title: 'Class 6 and Below',
    description: 'Fun and engaging disaster preparedness content for younger students',
    icon: '🧸',
    color: 'bg-green-500',
    modules: [
      {
        id: 'kids1',
        title: 'Sesame Street Emergency Preparedness',
        description: 'Learn emergency safety with your favorite Sesame Street friends',
        url: 'https://sesameworkshop.org/topics/emergencies/',
        type: 'article' as const,
        duration: '10 min activity',
        order: 1
      },
      {
        id: 'kids2',
        title: 'School Emergency Preparedness Guide',
        description: 'A comprehensive guide for emergency preparedness in schools',
        url: 'https://inee.org/sites/default/files/resources/IFC_Disaster_Emergency_Prep_Schools_Guide_ENG.pdf',
        type: 'pdf' as const,
        duration: '15 min read',
        order: 2
      },
      {
        id: 'kids3',
        title: 'Kids Preparedness Activity Guide',
        description: 'Fun activities and games to learn about emergency preparedness',
        url: 'https://www.mcminnvilleoregon.gov/sites/default/files/fileattachments/fire/page/3321/kids_preparedness_guide.pdf',
        type: 'pdf' as const,
        duration: '12 min activity',
        order: 3
      },
      {
        id: 'kids4',
        title: 'Ready Kids - Be Prepared',
        description: 'Interactive games and activities for kids to learn about disasters',
        url: 'https://www.ready.gov/kids',
        type: 'article' as const,
        duration: '8 min activity',
        order: 4
      }
    ]
  }
};

const ComprehensiveModules = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [currentModule, setCurrentModule] = useState<Module | null>(null);

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
      
      const completed = new Set(data?.map(progress => progress.module_id) || []);
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
        title: "Progress Saved",
        description: "Module marked as completed!",
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

  const calculateSectionProgress = (modules: Module[]) => {
    const completedCount = modules.filter(module => completedModules.has(module.id)).length;
    return (completedCount / modules.length) * 100;
  };

  const isModuleUnlocked = (module: Module, modules: Module[]) => {
    if (module.order === 1) return true;
    const previousModule = modules.find(m => m.order === module.order - 1);
    return previousModule ? completedModules.has(previousModule.id) : false;
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'pdf': return '📄';
      case 'article': return '📝';
      default: return '📚';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access comprehensive modules
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedSection) {
    const section = modulesSections[selectedSection as keyof typeof modulesSections];
    const progress = calculateSectionProgress(section.modules);

    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSection(null)}
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
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-4">{section.icon}</div>
              <h1 className="text-4xl font-bold mb-4">{section.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{section.description}</p>
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </div>

            <div className="space-y-6">
              {section.modules.map((module, index) => {
                const isCompleted = completedModules.has(module.id);
                const isUnlocked = isModuleUnlocked(module, section.modules);
                
                return (
                  <Card key={module.id} className={`transition-all duration-200 ${isCompleted ? 'border-success' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                            isCompleted ? 'bg-success' : isUnlocked ? 'bg-primary' : 'bg-muted'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : isUnlocked ? (
                              module.order
                            ) : (
                              <Lock className="w-6 h-6" />
                            )}
                          </div>
                          {index < section.modules.length - 1 && (
                            <div className={`w-0.5 h-12 mx-auto mt-2 ${
                              isCompleted ? 'bg-success' : 'bg-muted'
                            }`} />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{module.title}</h3>
                            <span className="text-2xl">{getModuleIcon(module.type)}</span>
                          </div>
                          <p className="text-muted-foreground mb-3">{module.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">Duration: {module.duration}</Badge>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => window.open(module.url, '_blank')}
                                disabled={!isUnlocked}
                                variant="outline"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open
                              </Button>
                              {isUnlocked && !isCompleted && (
                                <Button onClick={() => markModuleCompleted(module.id)}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark Complete
                                </Button>
                              )}
                              {isCompleted && (
                                <Badge className="bg-success">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Completed
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
          <h1 className="text-5xl font-bold mb-6">
            Comprehensive <span className="text-primary">Modules</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Age-appropriate disaster preparedness education designed specifically for different learning levels. 
            Interactive content with progress tracking and checkpoint-based advancement.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(modulesSections).map(([key, section]) => {
            const progress = calculateSectionProgress(section.modules);
            const completedCount = section.modules.filter(module => completedModules.has(module.id)).length;

            return (
              <Card key={key} className="group cursor-pointer hover:shadow-lg transition-all duration-200" 
                    onClick={() => setSelectedSection(key)}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-lg ${section.color} flex items-center justify-center text-3xl`}>
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{section.title}</CardTitle>
                      <CardDescription className="text-base">{section.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress: {completedCount}/{section.modules.length} completed</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <Button className="w-full group-hover:bg-primary/90">
                      Start Learning
                      <BookOpen className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Users className="w-6 h-6" />
                Age-Appropriate Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our comprehensive modules are carefully designed to match the cognitive abilities and learning 
                preferences of different age groups. Younger students enjoy interactive activities and games, 
                while older students engage with more detailed analysis and community-level thinking.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ComprehensiveModules;
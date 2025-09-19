import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowLeft, Play, CheckCircle, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DrillVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
}

const drillSections = {
  earthquake: {
    title: 'Earthquake Safety',
    description: 'Learn essential earthquake preparedness and response techniques',
    icon: '🏠',
    color: 'bg-orange-500',
    videos: [
      {
        id: 'eq1',
        title: 'Earthquake Safety Basics',
        description: 'Fundamental knowledge about earthquake safety and preparedness',
        videoUrl: 'https://www.youtube.com/embed/MKILThtPxQs',
        duration: '5:32',
        order: 1
      },
      {
        id: 'eq2',
        title: 'Drop, Cover, and Hold On',
        description: 'Master the essential earthquake response technique',
        videoUrl: 'https://www.youtube.com/embed/d08QUmxzdKU',
        duration: '3:45',
        order: 2
      },
      {
        id: 'eq3',
        title: 'Earthquake Preparedness Kit',
        description: 'Essential items for your earthquake emergency kit',
        videoUrl: 'https://www.youtube.com/embed/ChUng2QrqvU',
        duration: '4:20',
        order: 3
      },
      {
        id: 'eq4',
        title: 'After the Earthquake',
        description: 'What to do immediately after an earthquake strikes',
        videoUrl: 'https://www.youtube.com/embed/ay5lTN81u1Q',
        duration: '6:15',
        order: 4
      }
    ]
  },
  fire: {
    title: 'Residential Fire Safety',
    description: 'Critical fire safety and evacuation procedures for homes',
    icon: '🔥',
    color: 'bg-red-500',
    videos: [
      {
        id: 'fire1',
        title: 'Home Fire Safety Basics',
        description: 'Essential fire prevention and safety measures for homes',
        videoUrl: 'https://www.youtube.com/embed/kJq-UurV5BA',
        duration: '7:30',
        order: 1
      },
      {
        id: 'fire2',
        title: 'Fire Evacuation Procedures',
        description: 'Step-by-step guide to safely evacuating during a fire',
        videoUrl: 'https://www.youtube.com/embed/T0-V6B2R0mY',
        duration: '5:45',
        order: 2
      }
    ]
  },
  flood: {
    title: 'Flood Safety',
    description: 'Essential flood preparedness and water safety techniques',
    icon: '🌊',
    color: 'bg-blue-500',
    videos: [
      {
        id: 'flood1',
        title: 'Understanding Flood Risks',
        description: 'Learn about different types of floods and their dangers',
        videoUrl: 'https://www.youtube.com/embed/pi_nUPcQz_A',
        duration: '8:20',
        order: 1
      },
      {
        id: 'flood2',
        title: 'Flood Safety Measures',
        description: 'Essential safety measures during flooding events',
        videoUrl: 'https://www.youtube.com/embed/UpHtw4LsusA',
        duration: '6:45',
        order: 2
      },
      {
        id: 'flood3',
        title: 'Flash Flood Response',
        description: 'Quick response techniques for sudden flash floods',
        videoUrl: 'https://www.youtube.com/embed/7dIE29lWJSE',
        duration: '5:30',
        order: 3
      },
      {
        id: 'flood4',
        title: 'Water Rescue Basics',
        description: 'Basic water rescue techniques and safety',
        videoUrl: 'https://www.youtube.com/embed/wqEKBkxS7QY',
        duration: '7:15',
        order: 4
      }
    ]
  },
  storm: {
    title: 'Storm & Hurricane Safety',
    description: 'Comprehensive storm preparedness and safety protocols',
    icon: '🌪️',
    color: 'bg-purple-500',
    videos: [
      {
        id: 'storm1',
        title: 'Storm Safety Guidelines',
        description: 'Essential safety measures during severe storms',
        videoUrl: 'https://www.youtube.com/embed/aCdLPJqAoUw',
        duration: '9:30',
        order: 1
      },
      {
        id: 'storm2',
        title: 'Hurricane Preparedness',
        description: 'Complete guide to hurricane preparation and response',
        videoUrl: 'https://www.youtube.com/embed/yOP0g_flrlU',
        duration: '12:15',
        order: 2
      },
      {
        id: 'storm3',
        title: 'Tornado Safety',
        description: 'Tornado safety procedures and shelter techniques',
        videoUrl: 'https://www.youtube.com/embed/PMrwxtOBHb0',
        duration: '6:50',
        order: 3
      },
      {
        id: 'storm4',
        title: 'Severe Weather Alerts',
        description: 'Understanding weather warnings and alert systems',
        videoUrl: 'https://www.youtube.com/embed/tai7mDa-7bo',
        duration: '5:25',
        order: 4
      },
      {
        id: 'storm5',
        title: 'Storm Aftermath Safety',
        description: 'Post-storm safety and recovery procedures',
        videoUrl: 'https://www.youtube.com/embed/K9r0Y3UZoU4',
        duration: '8:40',
        order: 5
      }
    ]
  },
  thunder: {
    title: 'Lightning & Thunder Safety',
    description: 'Lightning safety and thunderstorm protection measures',
    icon: '⚡',
    color: 'bg-yellow-500',
    videos: [
      {
        id: 'thunder1',
        title: 'Lightning Safety Basics',
        description: 'Understanding lightning risks and basic safety measures',
        videoUrl: 'https://www.youtube.com/embed/hgJzCUEXOuc',
        duration: '7:10',
        order: 1
      },
      {
        id: 'thunder2',
        title: 'When Thunder Roars, Go Indoors',
        description: 'The 30-30 rule and indoor safety during thunderstorms',
        videoUrl: 'https://www.youtube.com/embed/tai7mDa-7bo',
        duration: '5:40',
        order: 2
      },
      {
        id: 'thunder3',
        title: 'Lightning Strike Response',
        description: 'What to do if someone is struck by lightning',
        videoUrl: 'https://www.youtube.com/embed/aCdLPJqAoUw',
        duration: '6:20',
        order: 3
      }
    ]
  }
};

const VirtualDrills = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [currentVideo, setCurrentVideo] = useState<DrillVideo | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchUserProgress = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('drill_attempts')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const completed = new Set(data?.map(attempt => attempt.drill_id) || []);
      setCompletedVideos(completed);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const markVideoCompleted = async (videoId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('drill_attempts')
        .upsert({
          user_id: user.id,
          drill_id: videoId,
          completed: true,
          completed_at: new Date().toISOString(),
          score: 100
        });

      if (error) throw error;

      setCompletedVideos(prev => new Set([...prev, videoId]));
      toast({
        title: "Progress Saved",
        description: "Video marked as completed!",
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

  const calculateSectionProgress = (videos: DrillVideo[]) => {
    const completedCount = videos.filter(video => completedVideos.has(video.id)).length;
    return (completedCount / videos.length) * 100;
  };

  const isVideoUnlocked = (video: DrillVideo, videos: DrillVideo[]) => {
    if (video.order === 1) return true;
    const previousVideo = videos.find(v => v.order === video.order - 1);
    return previousVideo ? completedVideos.has(previousVideo.id) : false;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access virtual drills
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

  if (currentVideo) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentVideo(null)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Drills
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
              <h1 className="text-3xl font-bold mb-2">{currentVideo.title}</h1>
              <p className="text-muted-foreground">{currentVideo.description}</p>
            </div>

            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={currentVideo.videoUrl}
                title={currentVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex justify-between items-center">
              <Badge variant="outline">Duration: {currentVideo.duration}</Badge>
              {!completedVideos.has(currentVideo.id) && (
                <Button onClick={() => markVideoCompleted(currentVideo.id)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </Button>
              )}
              {completedVideos.has(currentVideo.id) && (
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

  if (selectedSection) {
    const section = drillSections[selectedSection as keyof typeof drillSections];
    const progress = calculateSectionProgress(section.videos);

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
                  Back to Sections
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
              {section.videos.map((video, index) => {
                const isCompleted = completedVideos.has(video.id);
                const isUnlocked = isVideoUnlocked(video, section.videos);
                
                return (
                  <Card key={video.id} className={`transition-all duration-200 ${isCompleted ? 'border-success' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                            isCompleted ? 'bg-success' : isUnlocked ? 'bg-primary' : 'bg-muted'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : isUnlocked ? (
                              video.order
                            ) : (
                              <Lock className="w-6 h-6" />
                            )}
                          </div>
                          {index < section.videos.length - 1 && (
                            <div className={`w-0.5 h-12 mx-auto mt-2 ${
                              isCompleted ? 'bg-success' : 'bg-muted'
                            }`} />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                          <p className="text-muted-foreground mb-3">{video.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">Duration: {video.duration}</Badge>
                            <Button
                              onClick={() => setCurrentVideo(video)}
                              disabled={!isUnlocked}
                              variant={isCompleted ? "outline" : "default"}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              {isCompleted ? "Review" : "Watch"}
                            </Button>
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
            Virtual <span className="text-primary">Mock Drills</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Practice emergency response through interactive video simulations. 
            Master essential skills through step-by-step guidance and checkpoint-based learning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(drillSections).map(([key, section]) => {
            const progress = calculateSectionProgress(section.videos);
            const completedCount = section.videos.filter(video => completedVideos.has(video.id)).length;

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
                      <span>Progress: {completedCount}/{section.videos.length} completed</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <Button className="w-full group-hover:bg-primary/90">
                      Start Training
                      <Play className="w-4 h-4 ml-2" />
                    </Button>
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

export default VirtualDrills;
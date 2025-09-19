import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowLeft, Trophy, Star, Brain, Award, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  badge: string;
  answers: { questionId: number; selectedAnswer: number; isCorrect: boolean }[];
}

const generateRandomQuestions = (): Question[] => {
  const allQuestions: Question[] = [
    {
      id: 1,
      question: "What is the first thing you should do during an earthquake?",
      options: ["Run outside immediately", "Drop, Cover, and Hold On", "Stand in a doorway", "Call emergency services"],
      correctAnswer: 1,
      explanation: "Drop, Cover, and Hold On is the recommended safety action during an earthquake. Drop to your hands and knees, take cover under a sturdy table, and hold on until shaking stops."
    },
    {
      id: 2,
      question: "How long can a person survive without water in emergency situations?",
      options: ["1 day", "3 days", "7 days", "14 days"],
      correctAnswer: 1,
      explanation: "The rule of threes states that a person can survive approximately 3 days without water, making water the highest priority in emergency preparedness."
    },
    {
      id: 3,
      question: "What should you do if your clothes catch fire?",
      options: ["Run to find water", "Stop, Drop, and Roll", "Try to remove clothes", "Wave your arms"],
      correctAnswer: 1,
      explanation: "Stop, Drop, and Roll is the correct technique. Stop moving, drop to the ground, cover your face, and roll back and forth to smother the flames."
    },
    {
      id: 4,
      question: "Which item is most important in a basic emergency kit?",
      options: ["Radio", "Flashlight", "Water", "First aid supplies"],
      correctAnswer: 2,
      explanation: "Water is the most critical item in an emergency kit. You should store at least one gallon per person per day for drinking and sanitation."
    },
    {
      id: 5,
      question: "What is the universal sign for choking?",
      options: ["Pointing to throat", "Hands on both sides of throat", "Waving hands frantically", "Clutching chest"],
      correctAnswer: 1,
      explanation: "The universal choking sign is placing both hands on the throat/neck area. This helps others quickly identify that someone needs immediate help."
    },
    {
      id: 6,
      question: "How often should smoke detector batteries be replaced?",
      options: ["Monthly", "Every 6 months", "Annually", "Every 2 years"],
      correctAnswer: 2,
      explanation: "Smoke detector batteries should be replaced at least once a year. A good reminder is to change them when daylight saving time begins or ends."
    },
    {
      id: 7,
      question: "What is the correct ratio for chest compressions in CPR?",
      options: ["15:2", "30:2", "20:1", "10:1"],
      correctAnswer: 1,
      explanation: "The correct ratio for CPR is 30 chest compressions followed by 2 rescue breaths. This cycle should be repeated continuously."
    },
    {
      id: 8,
      question: "Which natural disaster kills the most people annually?",
      options: ["Earthquakes", "Hurricanes", "Floods", "Tornadoes"],
      correctAnswer: 2,
      explanation: "Floods are responsible for more deaths annually than any other natural disaster, often due to people driving through flooded roads."
    },
    {
      id: 9,
      question: "What should you do if caught in a rip current?",
      options: ["Swim directly back to shore", "Swim parallel to the shore", "Dive underwater", "Float on your back"],
      correctAnswer: 1,
      explanation: "If caught in a rip current, swim parallel to the shore until you escape the current, then swim at an angle back to shore."
    },
    {
      id: 10,
      question: "How long should you wash your hands to remove germs effectively?",
      options: ["10 seconds", "20 seconds", "30 seconds", "1 minute"],
      correctAnswer: 1,
      explanation: "You should wash your hands for at least 20 seconds with soap and water. This is about the time it takes to sing 'Happy Birthday' twice."
    },
    {
      id: 11,
      question: "What is the safest place to be during a tornado?",
      options: ["Near windows to watch", "In a basement or interior room", "In a car", "Outside in an open field"],
      correctAnswer: 1,
      explanation: "The safest place during a tornado is in a basement or an interior room on the lowest floor, away from windows."
    },
    {
      id: 12,
      question: "Which hurricane category has winds of 157 mph or higher?",
      options: ["Category 3", "Category 4", "Category 5", "Category 6"],
      correctAnswer: 2,
      explanation: "Category 5 hurricanes have sustained winds of 157 mph or higher and can cause catastrophic damage."
    },
    {
      id: 13,
      question: "What should you do if you smell gas in your home?",
      options: ["Turn on lights to see better", "Use a phone inside", "Leave immediately and call from outside", "Open all windows"],
      correctAnswer: 2,
      explanation: "If you smell gas, leave immediately without turning on lights or using electrical devices, then call the gas company from outside."
    },
    {
      id: 14,
      question: "How much water should you store per person per day for emergencies?",
      options: ["1/2 gallon", "1 gallon", "2 gallons", "3 gallons"],
      correctAnswer: 1,
      explanation: "Store at least 1 gallon of water per person per day for drinking and sanitation, with a minimum 3-day supply."
    },
    {
      id: 15,
      question: "What does the acronym PASS stand for in fire extinguisher use?",
      options: ["Pull, Aim, Squeeze, Sweep", "Push, Apply, Stop, Start", "Point, Activate, Spray, Stop", "Pressure, Angle, Spray, Safety"],
      correctAnswer: 0,
      explanation: "PASS stands for Pull the pin, Aim at the base of the fire, Squeeze the handle, and Sweep side to side."
    },
    {
      id: 16,
      question: "During a lightning storm, how far should you stay from tall objects?",
      options: ["10 feet", "25 feet", "50 feet", "100 feet"],
      correctAnswer: 2,
      explanation: "Stay at least 50 feet away from tall objects like trees, poles, and towers during lightning storms to avoid ground current."
    },
    {
      id: 17,
      question: "What is the primary cause of death in house fires?",
      options: ["Burns", "Smoke inhalation", "Falling debris", "Panic"],
      correctAnswer: 1,
      explanation: "Smoke inhalation is the primary cause of death in house fires, not burns. This is why staying low and getting out quickly is crucial."
    },
    {
      id: 18,
      question: "How often should you test your smoke detectors?",
      options: ["Weekly", "Monthly", "Every 6 months", "Annually"],
      correctAnswer: 1,
      explanation: "Test smoke detectors monthly to ensure they're working properly and can provide early warning in case of fire."
    },
    {
      id: 19,
      question: "What should you do if you're driving and encounter flood water?",
      options: ["Drive slowly through it", "Turn around, don't drown", "Use high beams", "Open windows"],
      correctAnswer: 1,
      explanation: "Turn around, don't drown! Just 6 inches of moving water can knock you down, and 12 inches can carry away a vehicle."
    },
    {
      id: 20,
      question: "Which direction do most tornadoes rotate in the Northern Hemisphere?",
      options: ["Clockwise", "Counter-clockwise", "They don't rotate", "Both directions equally"],
      correctAnswer: 1,
      explanation: "Most tornadoes in the Northern Hemisphere rotate counter-clockwise due to the Coriolis effect."
    },
    {
      id: 21,
      question: "What is the recommended depth for chest compressions during CPR?",
      options: ["1 inch", "2 inches", "3 inches", "4 inches"],
      correctAnswer: 1,
      explanation: "Chest compressions should be at least 2 inches deep for adults to be effective in circulating blood."
    },
    {
      id: 22,
      question: "How many days of supplies should you have in your emergency kit?",
      options: ["1 day", "3 days", "7 days", "14 days"],
      correctAnswer: 1,
      explanation: "You should have at least 3 days of supplies in your emergency kit, though 7 days is even better for extended emergencies."
    },
    {
      id: 23,
      question: "What is the safest room in your house during an earthquake?",
      options: ["Kitchen", "Bathroom", "Under a sturdy table anywhere", "Garage"],
      correctAnswer: 2,
      explanation: "The safest place is under a sturdy table or desk in any room, away from windows and heavy objects that could fall."
    },
    {
      id: 24,
      question: "At what temperature does hypothermia begin to set in?",
      options: ["Below 32°F (0°C)", "Below 95°F (35°C)", "Below 85°F (29°C)", "Below 75°F (24°C)"],
      correctAnswer: 1,
      explanation: "Hypothermia begins when body temperature drops below 95°F (35°C), which can happen in surprisingly mild conditions."
    },
    {
      id: 25,
      question: "What should you include in a family emergency communication plan?",
      options: ["Only local contacts", "Only out-of-state contacts", "Both local and out-of-state contacts", "No contacts needed"],
      correctAnswer: 2,
      explanation: "Include both local and out-of-state contacts in your plan, as local phone lines may be jammed but long-distance lines often work."
    },
    {
      id: 26,
      question: "How should you exit a building during a fire?",
      options: ["Use the elevator", "Take the stairs", "Jump from windows", "Wait for rescue"],
      correctAnswer: 1,
      explanation: "Always use stairs during a fire. Elevators can malfunction, trap you, or take you to the fire floor."
    },
    {
      id: 27,
      question: "What is the 30-30 rule for lightning safety?",
      options: ["Stay inside for 30 minutes after thunder", "If thunder follows lightning by 30 seconds, seek shelter", "Both A and B", "Neither A nor B"],
      correctAnswer: 2,
      explanation: "The 30-30 rule: If thunder follows lightning by 30 seconds or less, seek shelter immediately, and stay inside for 30 minutes after the last thunder."
    },
    {
      id: 28,
      question: "What should you do if you cannot evacuate during a wildfire?",
      options: ["Hide in a basement", "Go to the highest floor", "Stay in a large, open room away from windows", "Go outside"],
      correctAnswer: 2,
      explanation: "If you can't evacuate during a wildfire, stay in a large room away from windows, fill bathtubs with water, and call 911 to report your location."
    },
    {
      id: 29,
      question: "Which type of fire extinguisher should you use on electrical fires?",
      options: ["Water", "Class A", "Class C", "Class K"],
      correctAnswer: 2,
      explanation: "Use a Class C fire extinguisher on electrical fires. Never use water on electrical fires as it conducts electricity."
    },
    {
      id: 30,
      question: "What is the first step in creating a family emergency plan?",
      options: ["Buy supplies", "Choose meeting places", "Learn first aid", "Install smoke detectors"],
      correctAnswer: 1,
      explanation: "The first step is choosing meeting places - one near your home and one outside your neighborhood - where family members can gather."
    }
  ];

  // Shuffle the array and return 25 random questions
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 25).map((q, index) => ({ ...q, id: index + 1 }));
};

const getBadge = (percentage: number): string => {
  if (percentage >= 90) return "🏆 Disaster Response Expert";
  if (percentage >= 80) return "🥇 Safety Champion";
  if (percentage >= 70) return "🥈 Emergency Prepared";
  if (percentage >= 60) return "🥉 Safety Conscious";
  return "📚 Keep Learning";
};

const getBadgeColor = (percentage: number): string => {
  if (percentage >= 90) return "bg-yellow-500";
  if (percentage >= 80) return "bg-blue-500";
  if (percentage >= 70) return "bg-green-500";
  if (percentage >= 60) return "bg-orange-500";
  return "bg-gray-500";
};

const Quiz = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (user) {
      fetchQuizHistory();
    }
  }, [user]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isQuizStarted && timeLeft > 0 && !showResult) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showResult) {
      handleSubmitQuiz();
    }
    return () => clearTimeout(timer);
  }, [isQuizStarted, timeLeft, showResult]);

  const fetchQuizHistory = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      setQuizHistory(data || []);
    } catch (error) {
      console.error('Error fetching quiz history:', error);
    }
  };

  const startQuiz = () => {
    const newQuestions = generateRandomQuestions();
    setQuizQuestions(newQuestions);
    setIsQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResult(false);
    setQuizResult(null);
    setTimeLeft(1500); // 25 minutes
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    const answers = quizQuestions.map((question, index) => ({
      questionId: question.id,
      selectedAnswer: selectedAnswers[index] ?? -1,
      isCorrect: selectedAnswers[index] === question.correctAnswer
    }));

    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    const percentage = Math.round((correctAnswers / quizQuestions.length) * 100);
    const badge = getBadge(percentage);

    const result: QuizResult = {
      score: correctAnswers,
      totalQuestions: quizQuestions.length,
      percentage,
      badge,
      answers
    };

    setQuizResult(result);
    setShowResult(true);

    if (user) {
      try {
        const { error } = await supabase
          .from('quiz_attempts')
          .insert({
            user_id: user.id,
            quiz_id: 'disaster-management-quiz',
            score: correctAnswers,
            max_score: quizQuestions.length,
            percentage,
            passed: percentage >= 70,
            answers: answers,
            time_taken: 1500 - timeLeft,
            completed_at: new Date().toISOString()
          });

        if (error) throw error;
        
        fetchQuizHistory();
        toast({
          title: "Quiz Completed!",
          description: `You scored ${percentage}% and earned: ${badge}`,
        });
      } catch (error) {
        console.error('Error saving quiz result:', error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to take quizzes
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

  if (showResult && quizResult) {
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

        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card className="text-center">
            <CardHeader>
              <div className={`w-20 h-20 rounded-full ${getBadgeColor(quizResult.percentage)} flex items-center justify-center mx-auto mb-4`}>
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl mb-2">Quiz Completed!</CardTitle>
              <CardDescription className="text-xl">
                Your disaster preparedness knowledge has been assessed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {quizResult.percentage}%
                </div>
                <p className="text-xl text-muted-foreground">
                  {quizResult.score} out of {quizResult.totalQuestions} correct
                </p>
              </div>

              <Badge className={`${getBadgeColor(quizResult.percentage)} text-white text-lg px-4 py-2`}>
                {quizResult.badge}
              </Badge>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Question Review</h3>
                <div className="grid gap-4 text-left">
                  {quizQuestions.map((question, index) => {
                    const userAnswer = quizResult.answers[index];
                    return (
                      <Card key={question.id} className={`${userAnswer.isCorrect ? 'border-success' : 'border-destructive'}`}>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">{question.question}</h4>
                          <div className="space-y-1 text-sm">
                            <p className={`${userAnswer.isCorrect ? 'text-success' : 'text-destructive'}`}>
                              Your answer: {question.options[userAnswer.selectedAnswer] || 'Not answered'}
                            </p>
                            {!userAnswer.isCorrect && (
                              <p className="text-success">
                                Correct answer: {question.options[question.correctAnswer]}
                              </p>
                            )}
                            <p className="text-muted-foreground italic">{question.explanation}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={startQuiz} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
                <Button onClick={() => navigate('/')}>
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (isQuizStarted) {
    const question = quizQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-8 h-8 text-primary" />
                  <h1 className="text-2xl font-bold">Suraksha Quiz</h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  ⏱️ {formatTime(timeLeft)}
                </Badge>
                <Badge variant="outline">
                  {currentQuestion + 1}/{quizQuestions.length}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div>
              <Progress value={progress} className="h-2 mb-4" />
              <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
            </div>

            <div className="grid gap-4">
              {question.options.map((option, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedAnswers[currentQuestion] === index 
                      ? 'border-primary bg-primary/10' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-primary bg-primary text-white'
                          : 'border-muted-foreground'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-lg">{option}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button 
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestion] === undefined}
              >
                {currentQuestion === quizQuestions.length - 1 ? 'Submit Quiz' : 'Next'}
              </Button>
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
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-yellow-600" />
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Gamified <span className="text-primary">Quiz</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Test your disaster preparedness knowledge with our AI-powered quiz system. 
            Get real-time evaluation, detailed results, and earn badges based on your performance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl mb-4">Take New Quiz</CardTitle>
              <CardDescription className="text-lg">
                Challenge yourself with 25 questions about disaster management and emergency response
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="font-semibold">Questions</div>
                  <div className="text-2xl font-bold text-primary">25</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="font-semibold">Time Limit</div>
                  <div className="text-2xl font-bold text-primary">25 min</div>
                </div>
              </div>
              <Button size="lg" onClick={startQuiz} className="w-full">
                <Star className="w-5 h-5 mr-2" />
                Start Quiz
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl mb-4">Recent Results</CardTitle>
              <CardDescription>
                Your quiz performance history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quizHistory.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No quiz attempts yet. Take your first quiz to see results here!
                </p>
              ) : (
                <div className="space-y-4">
                  {quizHistory.map((attempt, index) => (
                    <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {Math.round(attempt.percentage)}% - {attempt.score}/{attempt.max_score}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(attempt.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge className={getBadgeColor(attempt.percentage)}>
                        {attempt.passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">Achievement Badges</CardTitle>
            <CardDescription>
              Earn badges based on your quiz performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { name: "🏆 Disaster Response Expert", requirement: "90%+ Score", color: "bg-yellow-500" },
                { name: "🥇 Safety Champion", requirement: "80%+ Score", color: "bg-blue-500" },
                { name: "🥈 Emergency Prepared", requirement: "70%+ Score", color: "bg-green-500" },
                { name: "🥉 Safety Conscious", requirement: "60%+ Score", color: "bg-orange-500" },
                { name: "📚 Keep Learning", requirement: "Below 60%", color: "bg-gray-500" }
              ].map((badge, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-4">
                    <div className={`w-16 h-16 rounded-full ${badge.color} flex items-center justify-center mx-auto mb-3`}>
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground">{badge.requirement}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Quiz;
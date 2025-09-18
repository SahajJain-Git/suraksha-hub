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

const disasterQuestions: Question[] = [
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
  }
];

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
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [quizHistory, setQuizHistory] = useState<any[]>([]);

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
    setIsQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResult(false);
    setQuizResult(null);
    setTimeLeft(600);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < disasterQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    const answers = disasterQuestions.map((question, index) => ({
      questionId: question.id,
      selectedAnswer: selectedAnswers[index] ?? -1,
      isCorrect: selectedAnswers[index] === question.correctAnswer
    }));

    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    const percentage = Math.round((correctAnswers / disasterQuestions.length) * 100);
    const badge = getBadge(percentage);

    const result: QuizResult = {
      score: correctAnswers,
      totalQuestions: disasterQuestions.length,
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
            max_score: disasterQuestions.length,
            percentage,
            passed: percentage >= 70,
            answers: answers,
            time_taken: 600 - timeLeft,
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
                  {disasterQuestions.map((question, index) => {
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
    const question = disasterQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / disasterQuestions.length) * 100;

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
                  {currentQuestion + 1}/{disasterQuestions.length}
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
                {currentQuestion === disasterQuestions.length - 1 ? 'Submit Quiz' : 'Next'}
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
                Challenge yourself with 10 questions about disaster management and emergency response
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="font-semibold">Questions</div>
                  <div className="text-2xl font-bold text-primary">10</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="font-semibold">Time Limit</div>
                  <div className="text-2xl font-bold text-primary">10 min</div>
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
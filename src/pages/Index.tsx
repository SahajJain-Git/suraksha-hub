import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, GraduationCap, BookOpen } from 'lucide-react';

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Suraksha</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Welcome back!</span>
                  <Button variant="outline" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => navigate('/student-auth')}>
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Student Login
                  </Button>
                  <Button onClick={() => navigate('/teacher-auth')}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Teacher Login
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">Suraksha</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your comprehensive disaster preparedness training platform for educational institutions. 
            Learn, practice, and master emergency response skills through interactive modules and simulations.
          </p>
        </div>

        {user ? (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Virtual Mock Drills</h3>
              <p className="text-gray-600 mb-4">
                Practice emergency scenarios through interactive video simulations and step-by-step guidance.
              </p>
              <Button className="w-full">Start Drills</Button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">First Aid Course</h3>
              <p className="text-gray-600 mb-4">
                Learn essential first aid skills through structured video lessons and progress tracking.
              </p>
              <Button className="w-full">Start Learning</Button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gamified Quiz</h3>
              <p className="text-gray-600 mb-4">
                Test your knowledge with interactive quizzes and earn rewards for your achievements.
              </p>
              <Button className="w-full">Take Quiz</Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-8">
              Please sign in to access your personalized learning dashboard.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/student-auth')}>
                <GraduationCap className="w-5 h-5 mr-2" />
                Sign in as Student
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/teacher-auth')}>
                <BookOpen className="w-5 h-5 mr-2" />
                Sign in as Teacher
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

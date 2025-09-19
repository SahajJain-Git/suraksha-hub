import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, GraduationCap, BookOpen, Play, Heart, Brain, Users, TrendingUp, Award, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="bg-card shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold">Suraksha</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" onClick={() => navigate('/virtual-drills')}>Virtual Drills</Button>
              <Button variant="ghost" onClick={() => navigate('/quiz')}>Quizzes</Button>
              <Button variant="ghost" onClick={() => navigate('/first-aid')}>First Aid</Button>
              <Button variant="ghost">Articles</Button>
            </nav>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Welcome back!</span>
                  <Button variant="outline" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => navigate('/student-auth')}>
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/teacher-auth')}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-hero-gradient text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-bold mb-6">
            Master Emergency <br />
            <span className="text-accent">Preparedness</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Comprehensive disaster education platform designed for schools and colleges.
            Learn, practice, and excel in emergency response through interactive training.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Learning Free
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary">
              View Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-lg text-muted-foreground">Students Trained</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">95%</div>
              <div className="text-lg text-muted-foreground">Course Completion Rate</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-lg text-muted-foreground">Schools & Colleges</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Everything You Need to Learn Emergency Response
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform combines interactive learning, practical
              training, and assessment tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => navigate('/virtual-drills')}>
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Play className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Virtual Mock Drills</CardTitle>
                <CardDescription>
                  Practice emergency responses through immersive simulations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full group-hover:bg-primary/90" onClick={() => navigate('/virtual-drills')}>
                  Start Drills <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => navigate('/quiz')}>
              <CardHeader>
                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Gamified Quizzes</CardTitle>
                <CardDescription>
                  Test your knowledge with engaging, scored assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full group-hover:bg-primary/90" onClick={() => navigate('/quiz')}>
                  Take Quiz <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => navigate('/first-aid')}>
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">First Aid Training</CardTitle>
                <CardDescription>
                  Learn life-saving medical response techniques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full group-hover:bg-primary/90" onClick={() => navigate('/first-aid')}>
                  Start Learning <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Comprehensive Modules</CardTitle>
                <CardDescription>
                  Age-appropriate learning resources for different educational levels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h4 className="font-semibold text-blue-800 mb-2">Class 6 & Above</h4>
                  <p className="text-sm text-blue-600">Advanced disaster management concepts and detailed emergency protocols</p>
                  <Button variant="outline" size="sm" className="mt-2 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white">
                    Explore Advanced Modules
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-yellow-50">
                  <h4 className="font-semibold text-yellow-800 mb-2">Class 6 & Below</h4>
                  <p className="text-sm text-yellow-600 mb-3">Fun and interactive safety resources for younger students</p>
                  <div className="space-y-2">
                    <a href="https://sesameworkshop.org/topics/emergencies/" target="_blank" rel="noopener noreferrer" className="block text-sm text-yellow-700 hover:text-yellow-900 underline">
                      📚 Sesame Street Emergency Resources
                    </a>
                    <a href="https://inee.org/sites/default/files/resources/IFC_Disaster_Emergency_Prep_Schools_Guide_ENG.pdf" target="_blank" rel="noopener noreferrer" className="block text-sm text-yellow-700 hover:text-yellow-900 underline">
                      📖 School Emergency Preparedness Guide
                    </a>
                    <a href="https://www.mcminnvilleoregon.gov/sites/default/files/fileattachments/fire/page/3321/kids_preparedness_guide.pdf" target="_blank" rel="noopener noreferrer" className="block text-sm text-yellow-700 hover:text-yellow-900 underline">
                      🎒 Kids Preparedness Activity Guide
                    </a>
                    <a href="https://www.ready.gov/kids" target="_blank" rel="noopener noreferrer" className="block text-sm text-yellow-700 hover:text-yellow-900 underline">
                      🏠 Ready.gov Kids Corner
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Community Learning</CardTitle>
                <CardDescription>
                  Connect with peers and share experiences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Progress Tracking</CardTitle>
                <CardDescription>
                  Monitor your learning journey and achievements
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Process Section */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">How Suraksha Works</h2>
            <p className="text-xl text-muted-foreground">
              Simple, effective, and engaging learning process designed for educational institutions.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, icon: Users, title: "Register & Choose Role", desc: "Sign up as a student, teacher, or administrator" },
              { step: 2, icon: Brain, title: "Take Assessment", desc: "Start with a knowledge assessment to personalize your learning" },
              { step: 3, icon: BookOpen, title: "Learn & Practice", desc: "Complete modules, participate in drills, and take quizzes" },
              { step: 4, icon: Award, title: "Earn Certification", desc: "Demonstrate your emergency preparedness skills" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-hero-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Build Emergency Preparedness Skills?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students and educators already learning life-saving skills
            through our platform.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-8 h-8 text-primary" />
                <h3 className="text-xl font-bold">Suraksha</h3>
              </div>
              <p className="text-muted-foreground">
                Empowering schools and colleges with comprehensive disaster preparedness education and training.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Learning Modules</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Virtual Drills</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Practice Quizzes</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">First Aid Training</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Articles & Resources</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Disaster Types</h4>
              <div className="space-y-2">
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Earthquake Safety</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Fire Emergency</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Flood Response</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Cyclone Preparedness</div>
                <div className="text-muted-foreground hover:text-primary cursor-pointer">Medical Emergency</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-muted-foreground">
                <div>📧 support@suraksha.edu</div>
                <div>📞 +1 (555) 123-4567</div>
                <div>📍 Emergency Education Center</div>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            © 2024 Suraksha. All rights reserved. Built for emergency preparedness education.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

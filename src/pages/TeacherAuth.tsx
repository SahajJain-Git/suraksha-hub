import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Shield } from 'lucide-react';

interface TeacherFormData {
  email: string;
  password: string;
  fullName?: string;
  designation?: string;
  phoneNumber?: string;
  institution?: string;
  department?: string;
  experience?: string;
  qualification?: string;
}

const TeacherAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<TeacherFormData>({
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      designation: '',
      phoneNumber: '',
      institution: '',
      department: '',
      experience: '',
      qualification: '',
    },
  });

  const onSubmit = async (data: TeacherFormData) => {
    try {
      let error;
      
      if (isLogin) {
        const result = await signIn(data.email, data.password);
        error = result.error;
      } else {
        const result = await signUp(data.email, data.password, 'teacher', data.fullName, {
          designation: data.designation,
          phoneNumber: data.phoneNumber,
          institution: data.institution,
          department: data.department,
          experience: data.experience,
          qualification: data.qualification,
        });
        error = result.error;
      }

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: isLogin ? "Welcome back!" : "Account created!",
          description: isLogin ? "You've successfully signed in." : "Please check your email to verify your account.",
        });
        if (isLogin) {
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Suraksha</h1>
          </div>
          <CardTitle className="text-xl font-semibold">
            Teacher {isLogin ? 'Sign In' : 'Sign Up'}
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Welcome back! Access your educator dashboard.' : 'Join Suraksha as an educator to guide student learning.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin && (
                <>
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Faculty Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="">Select your designation</option>
                            <option value="Professor">Professor</option>
                            <option value="Associate Professor">Associate Professor</option>
                            <option value="Assistant Professor">Assistant Professor</option>
                            <option value="Lecturer">Lecturer</option>
                            <option value="Principal">Principal</option>
                            <option value="Vice Principal">Vice Principal</option>
                            <option value="Head of Department">Head of Department</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Senior Teacher">Senior Teacher</option>
                            <option value="Primary Teacher">Primary Teacher</option>
                            <option value="Other">Other</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department/Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your department or subject" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="qualification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qualification</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="">Select your qualification</option>
                            <option value="PhD">PhD</option>
                            <option value="M.Tech">M.Tech</option>
                            <option value="M.Ed">M.Ed</option>
                            <option value="M.A">M.A</option>
                            <option value="M.Sc">M.Sc</option>
                            <option value="M.Com">M.Com</option>
                            <option value="MBA">MBA</option>
                            <option value="B.Tech">B.Tech</option>
                            <option value="B.Ed">B.Ed</option>
                            <option value="B.A">B.A</option>
                            <option value="B.Sc">B.Sc</option>
                            <option value="B.Com">B.Com</option>
                            <option value="Other">Other</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="">Select your experience</option>
                            <option value="0-1 years">0-1 years</option>
                            <option value="1-3 years">1-3 years</option>
                            <option value="3-5 years">3-5 years</option>
                            <option value="5-10 years">5-10 years</option>
                            <option value="10-15 years">10-15 years</option>
                            <option value="15-20 years">15-20 years</option>
                            <option value="20+ years">20+ years</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your institution name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your phone number" type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
          </Form>
          
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-600 hover:underline font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
            
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/student-auth')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Are you a student? Sign in here
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherAuth;
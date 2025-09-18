import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Shield } from 'lucide-react';

interface StudentFormData {
  email: string;
  password: string;
  fullName?: string;
}

const StudentAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<StudentFormData>({
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
    },
  });

  const onSubmit = async (data: StudentFormData) => {
    try {
      let error;
      
      if (isLogin) {
        const result = await signIn(data.email, data.password);
        error = result.error;
      } else {
        const result = await signUp(data.email, data.password, 'student', data.fullName);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Suraksha</h1>
          </div>
          <CardTitle className="text-xl font-semibold">
            Student {isLogin ? 'Sign In' : 'Sign Up'}
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Welcome back! Sign in to continue your learning.' : 'Join Suraksha to start your disaster preparedness training.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin && (
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
          </Form>
          
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
            
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/teacher-auth')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Are you a teacher? Sign in here
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAuth;
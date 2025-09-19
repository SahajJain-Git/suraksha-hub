import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, BookOpen, Shield } from 'lucide-react';

interface StudentFormData {
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  instituteName?: string;
  instituteLocation?: string;
  enrollmentNumber?: string;
  state?: string;
  city?: string;
  instituteEmail?: string;
}

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
  subject?: string;
  gradeLevel?: string;
}

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('student');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const studentForm = useForm<StudentFormData>({
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      phoneNumber: '',
      instituteName: '',
      instituteLocation: '',
      enrollmentNumber: '',
      state: '',
      city: '',
      instituteEmail: '',
    },
  });

  const teacherForm = useForm<TeacherFormData>({
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
      subject: '',
      gradeLevel: '',
    },
  });

  // Indian states list
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
    'Dadra and Nagar Haveli', 'Daman and Diu', 'Lakshadweep'
  ];

  // Major cities list
  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai',
    'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
    'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri & Chinchwad',
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
    'Faridabad', 'Meerut', 'Rajkot', 'Kalyan & Dombivali', 'Vasai Virar',
    'Varanasi', 'Srinagar', 'Dhanbad', 'Jodhpur', 'Amritsar', 'Raipur',
    'Allahabad', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada'
  ];

  const onStudentSubmit = async (data: StudentFormData) => {
    try {
      let error;
      
      if (isLogin) {
        const result = await signIn(data.email, data.password);
        error = result.error;
      } else {
        const result = await signUp(data.email, data.password, 'student', data.fullName, {
          phoneNumber: data.phoneNumber,
          instituteName: data.instituteName,
          instituteLocation: data.instituteLocation,
          enrollmentNumber: data.enrollmentNumber,
          state: data.state,
          city: data.city,
          instituteEmail: data.instituteEmail,
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

  const onTeacherSubmit = async (data: TeacherFormData) => {
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
          subject: data.subject,
          gradeLevel: data.gradeLevel,
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
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Suraksha</h1>
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? 'Sign In to Your Account' : 'Create New Account'}
          </CardTitle>
          <CardDescription className="text-lg">
            {isLogin ? 'Welcome back! Choose your account type below.' : 'Join Suraksha to start your disaster preparedness journey.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs value={userType} onValueChange={setUserType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="teacher" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Teacher
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student" className="space-y-4">
              <Form {...studentForm}>
                <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-4">
                  {!isLogin && (
                    <>
                      <FormField
                        control={studentForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={studentForm.control}
                          name="instituteName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institute Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter institute name" {...field} required />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={studentForm.control}
                          name="instituteLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institute Location *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter location" {...field} required />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={studentForm.control}
                        name="enrollmentNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Enrollment Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter enrollment number" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={studentForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State *</FormLabel>
                              <FormControl>
                                <select 
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  {...field}
                                  required
                                >
                                  <option value="">Select state</option>
                                  {indianStates.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={studentForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City *</FormLabel>
                              <FormControl>
                                <select 
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  {...field}
                                  required
                                >
                                  <option value="">Select city</option>
                                  {indianCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={studentForm.control}
                          name="instituteEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institute Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Institute email" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={studentForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter phone number" type="tel" {...field} required />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}
                  
                  <FormField
                    control={studentForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personal Email *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" type="email" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={studentForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter password" type="password" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    {isLogin ? 'Sign In' : 'Create Student Account'}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="teacher" className="space-y-4">
              <Form {...teacherForm}>
                <form onSubmit={teacherForm.handleSubmit(onTeacherSubmit)} className="space-y-4">
                  {!isLogin && (
                    <>
                      <FormField
                        control={teacherForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Faculty Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={teacherForm.control}
                          name="designation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Designation *</FormLabel>
                              <FormControl>
                                <select 
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  {...field}
                                  required
                                >
                                  <option value="">Select designation</option>
                                  <option value="Professor">Professor</option>
                                  <option value="Associate Professor">Associate Professor</option>
                                  <option value="Assistant Professor">Assistant Professor</option>
                                  <option value="Lecturer">Lecturer</option>
                                  <option value="Principal">Principal</option>
                                  <option value="Vice Principal">Vice Principal</option>
                                  <option value="Head of Department">Head of Department</option>
                                  <option value="Senior Teacher">Senior Teacher</option>
                                  <option value="Primary Teacher">Primary Teacher</option>
                                  <option value="Subject Teacher">Subject Teacher</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={teacherForm.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Department/Subject *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Mathematics, Science" {...field} required />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={teacherForm.control}
                          name="qualification"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Highest Qualification *</FormLabel>
                              <FormControl>
                                <select 
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  {...field}
                                  required
                                >
                                  <option value="">Select qualification</option>
                                  <option value="PhD">PhD</option>
                                  <option value="M.Phil">M.Phil</option>
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
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={teacherForm.control}
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teaching Experience *</FormLabel>
                              <FormControl>
                                <select 
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  {...field}
                                  required
                                >
                                  <option value="">Select experience</option>
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
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={teacherForm.control}
                          name="institution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institution Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter institution name" {...field} required />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={teacherForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter phone number" type="tel" {...field} required />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}
                  
                  <FormField
                    control={teacherForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" type="email" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={teacherForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter password" type="password" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    {isLogin ? 'Sign In' : 'Create Teacher Account'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
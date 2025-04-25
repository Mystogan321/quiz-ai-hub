
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await login({ email, password });
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Book className="h-6 w-6 text-lms-blue" />
                <h2 className="text-2xl font-bold">Company LMS</h2>
              </div>
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button variant="link" className="p-0 h-auto text-xs">
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Log in"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Right side - Hero Image/Info */}
        <div className="hidden md:flex flex-1 bg-lms-blue items-center justify-center text-white p-8">
          <div className="max-w-md space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Employee Learning Management System
              </h1>
              <p className="text-white/80">
                Access your learning materials, courses, and assessments all in one place.
                Track your progress and improve your skills.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="flex gap-2 items-start">
                <div className="bg-white/20 p-2 rounded">
                  <Book className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Comprehensive Learning</h3>
                  <p className="text-sm text-white/70">
                    Access a wide range of courses tailored for professional development
                  </p>
                </div>
              </div>

              <div className="flex gap-2 items-start">
                <div className="bg-white/20 p-2 rounded">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Track Your Progress</h3>
                  <p className="text-sm text-white/70">
                    Monitor your learning journey and see your improvements over time
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-white/60">
              Please contact your administrator if you need access to the system.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

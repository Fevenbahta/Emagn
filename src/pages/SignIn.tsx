import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authApiService } from "@/services/authApi";
import { TokenService } from "@/services/tokenService";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Extract error message from various error formats
  const extractErrorMessage = (error: any): string => {
    console.log("Raw error:", error);
    
    // If it's already a string error message
    if (typeof error === 'string') {
      return error;
    }
    
    // If it's an Error object with message
    if (error?.message) {
      const message = error.message;
      
      // Try to parse JSON error from HTTP response
      if (message.includes('{') && message.includes('}')) {
        try {
          const jsonMatch = message.match(/\{.*\}/);
          if (jsonMatch) {
            const errorObj = JSON.parse(jsonMatch[0]);
            return errorObj.error || message;
          }
        } catch (e) {
          console.log("Could not parse JSON from error message");
        }
      }
      
      return message;
    }
    
    // If it's an object with error property
    if (error?.error) {
      return error.error;
    }
    
    return "An unexpected error occurred";
  };

  // User-friendly error messages
  const getErrorMessage = (error: any): string => {
    const errorMessage = extractErrorMessage(error).toLowerCase();
    console.log("Processed error message:", errorMessage);
    
    const errorMessages: { [key: string]: string } = {
      "invalid email or password": "The email or password you entered doesn't match our records. Please try again.",
      "user not found": "We couldn't find an account with this email address.",
      "account locked": "Your account has been temporarily locked due to too many failed attempts. Please try again in 15 minutes or reset your password.",
      "email not verified": "Please verify your email address before signing in. Check your inbox for the verification link.",
      "unauthorized": "The email or password you entered doesn't match our records. Please try again.",
    };
    
    // Check for partial matches
    for (const [key, value] of Object.entries(errorMessages)) {
      if (errorMessage.includes(key)) {
        return value;
      }
    }
    
    return "Something went wrong. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await authApiService.login({ email, password });
      console.log("Login result:", result);

      if (result.success && result.data) {
        TokenService.storeToken(result.data.token);
        
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        
        navigate("/transactions");
      } else {
        const friendlyMessage = getErrorMessage(result.error);
        console.log("Displaying error:", friendlyMessage);
        
        toast({
          title: "Couldn't sign you in",
          description: friendlyMessage,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.log("Caught error in handleSubmit:", error);
      const friendlyMessage = getErrorMessage(error);
      
      toast({
        title: "Couldn't sign you in",
        description: friendlyMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-accent flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="w-full max-w-md relative">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Shield className="h-10 w-10 text-primary" />
          <span className="text-3xl font-bold text-primary">Emagn</span>
        </Link>

        <Card className="border-2 shadow-strong animate-slide-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your Emagn account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="transition-all focus:shadow-soft"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="transition-all focus:shadow-soft"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-primary text-primary focus:ring-primary"
                    disabled={isLoading}
                  />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full group" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="grid gap-4 w-full">
              <Button variant="outline" type="button" disabled={isLoading}>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground w-full">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-semibold">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our{" "}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
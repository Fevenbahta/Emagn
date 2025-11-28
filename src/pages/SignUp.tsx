import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Mail, Lock, User, ArrowRight, Building, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authApiService } from "@/services/authApi";
import { TokenService } from "@/services/tokenService";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Extract error message from various error formats
  const extractErrorMessage = (error: any): string => {
    console.log("Raw error in SignUp:", error);
    
    // If it's already a string error message
    if (typeof error === 'string') {
      return error;
    }
    
    // If it's an Error object with message
    if (error?.message) {
      const message = error.message;
      
      // Try to parse JSON error from HTTP response (like "HTTP 409: {"error":"user with this email already exists"}")
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
    console.log("Processed error message in SignUp:", errorMessage);
    
    const errorMessages: { [key: string]: string } = {
      "user with this email already exists": "This email address is already registered.",
      "invalid email": "Please enter a valid email address.",
      "password too weak": "Please choose a stronger password with at least 8 characters including letters and numbers.",
      "phone number already exists": "This phone number is already associated with an account.",
      "invalid phone number": "Please enter a valid phone number.",
      "email already exists": "This email address is already registered.",
      "user already exists": "This email address is already registered.",
    };
    
    // Check for partial matches
    for (const [key, value] of Object.entries(errorMessages)) {
      if (errorMessage.includes(key)) {
        return value;
      }
    }
    
    return "We encountered an issue creating your account. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation with friendly messages
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are exactly the same.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "For your security, please choose a password with at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.userType) {
      toast({
        title: "Account type required",
        description: "Please select how you plan to use Emagn.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const registerData = {
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        user_type: formData.userType,
      };

      const result = await authApiService.register(registerData);
      console.log("Registration result:", result);

      if (result.success && result.data) {
        TokenService.storeToken(result.data.token);
        
        toast({
          title: "Welcome to Emagn!",
          description: "Your account has been created successfully.",
        });
        
        navigate("/transactions");
      } else {
        const friendlyMessage = getErrorMessage(result.error);
        console.log("Displaying registration error:", friendlyMessage);
        
        toast({
          title: "Couldn't create account",
          description: friendlyMessage,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.log("Caught error in SignUp handleSubmit:", error);
      const friendlyMessage = getErrorMessage(error);
      
      toast({
        title: "Couldn't create account",
        description: friendlyMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-accent flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="w-full max-w-2xl relative">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Shield className="h-10 w-10 text-primary" />
          <span className="text-3xl font-bold text-primary">Emagn</span>
        </Link>

        <Card className="border-2 shadow-strong animate-slide-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create Your Account</CardTitle>
            <CardDescription className="text-center">
              Join Emagn and start secure transactions today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    required
                    disabled={isLoading}
                    className="transition-all focus:shadow-soft"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    required
                    disabled={isLoading}
                    className="transition-all focus:shadow-soft"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    disabled={isLoading}
                    className="transition-all focus:shadow-soft"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                    disabled={isLoading}
                    className="transition-all focus:shadow-soft"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userType" className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary" />
                    Account Type
                  </Label>
                  <Select 
                    value={formData.userType} 
                    onValueChange={(value) => handleChange("userType", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="transition-all focus:shadow-soft">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Buyer</SelectItem>
                      <SelectItem value="seller">Seller</SelectItem>
                      <SelectItem value="broker">Broker</SelectItem>
                      <SelectItem value="partner">Partner/API Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={8}
                    className="transition-all focus:shadow-soft"
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters long
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    required
                    disabled={isLoading}
                    className="transition-all focus:shadow-soft"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  required
                  disabled={isLoading}
                  className="mt-1 rounded border-primary text-primary focus:ring-primary" 
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  I agree to Emagn's{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                  ,{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  , and{" "}
                  <Link to="/escrow-agreement" className="text-primary hover:underline">
                    Escrow Agreement
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full group" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
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
                <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full">
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
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-center text-xs text-muted-foreground">
            <Shield className="inline h-3 w-3 mr-1 text-primary" />
            Your data is encrypted and secure. We use industry-standard security protocols.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
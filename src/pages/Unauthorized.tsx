// pages/Unauthorized.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 shadow-strong">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold text-center text-destructive">
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-2">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-muted-foreground">
              This area is restricted to authorized personnel only.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-accent/50 rounded-lg border">
              <p className="text-sm font-medium mb-2">Required Role:</p>
              <p className="text-sm text-muted-foreground">Super Administrator</p>
            </div>
            
            <div className="p-4 bg-accent/50 rounded-lg border">
              <p className="text-sm font-medium mb-2">Contact Support:</p>
              <p className="text-sm text-muted-foreground">
                If you believe this is an error, please contact your system administrator.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
            </Button>
            <Button asChild className="flex-1">
              <Link to="/">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
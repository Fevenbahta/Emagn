import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Code, Key, Book, Copy, Check, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ApiIntegration = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const apiKey = "emgn_live_sk_1234567890abcdef";
  const sandboxKey = "emgn_test_sk_abcdef1234567890";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Emagn</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/transactions" className="text-foreground hover:text-primary transition">Transactions</Link>
            <Link to="/api" className="text-primary font-semibold">API Integration</Link>
            <Link to="/profile" className="text-foreground hover:text-primary transition">Profile</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">API Integration</h1>
          <p className="text-muted-foreground text-lg">
            Integrate Emagn escrow services into your platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 hover:border-primary transition">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-green-dark rounded-full flex items-center justify-center mx-auto">
                <Code className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold">RESTful API</h3>
              <p className="text-sm text-muted-foreground">Simple HTTP endpoints for all operations</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-green-dark rounded-full flex items-center justify-center mx-auto">
                <Terminal className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold">Sandbox Environment</h3>
              <p className="text-sm text-muted-foreground">Test safely before going live</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-green-dark rounded-full flex items-center justify-center mx-auto">
                <Book className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold">Full Documentation</h3>
              <p className="text-sm text-muted-foreground">Comprehensive guides and examples</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-xl border-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="keys" className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="keys">API Keys</TabsTrigger>
                <TabsTrigger value="docs">Documentation</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              </TabsList>

              {/* API Keys Tab */}
              <TabsContent value="keys" className="space-y-6">
                <Card className="bg-accent/50 border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-primary" />
                      Live API Key
                    </CardTitle>
                    <CardDescription>
                      Use this key for production transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input value={apiKey} readOnly className="font-mono text-sm" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(apiKey)}
                      >
                        {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-accent/50 border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-primary" />
                      Sandbox API Key
                    </CardTitle>
                    <CardDescription>
                      Use this key for testing and development
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input value={sandboxKey} readOnly className="font-mono text-sm" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(sandboxKey)}
                      >
                        {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg p-4">
                  <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-500">
                    ⚠️ Keep your API keys secure! Never share them publicly or commit them to version control.
                  </p>
                </div>
              </TabsContent>

              {/* Documentation Tab */}
              <TabsContent value="docs" className="space-y-6">
                <Card className="bg-accent/50 border-2">
                  <CardHeader>
                    <CardTitle>Quick Start</CardTitle>
                    <CardDescription>Create your first escrow transaction via API</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold">Base URL</Label>
                      <div className="bg-muted p-3 rounded-md font-mono text-sm mt-2">
                        https://api.emagn.com/v1
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold">Create Transaction</Label>
                      <div className="bg-muted p-3 rounded-md font-mono text-xs mt-2 overflow-x-auto">
                        <pre>{`POST /transactions

{
  "title": "MacBook Pro Sale",
  "amount": 2499.00,
  "currency": "USD",
  "buyer_email": "buyer@example.com",
  "seller_email": "seller@example.com",
  "inspection_days": 7
}`}</pre>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Book className="h-4 w-4 mr-2" />
                      View Full API Documentation
                    </Button>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Endpoints</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <code className="text-primary">POST /transactions</code>
                        <span className="text-muted-foreground">Create</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="text-primary">GET /transactions/:id</code>
                        <span className="text-muted-foreground">Retrieve</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="text-primary">PUT /transactions/:id</code>
                        <span className="text-muted-foreground">Update</span>
                      </div>
                      <div className="flex justify-between">
                        <code className="text-primary">POST /transactions/:id/release</code>
                        <span className="text-muted-foreground">Release</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Authentication</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <p>Include your API key in the request header:</p>
                      <div className="bg-muted p-3 rounded-md font-mono text-xs">
                        Authorization: Bearer YOUR_API_KEY
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Webhooks Tab */}
              <TabsContent value="webhooks" className="space-y-6">
                <Card className="bg-accent/50 border-2">
                  <CardHeader>
                    <CardTitle>Webhook Endpoints</CardTitle>
                    <CardDescription>
                      Receive real-time notifications for transaction events
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Webhook URL</Label>
                      <Input placeholder="https://yoursite.com/webhooks/emagn" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Available Events</Label>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <code className="text-primary">transaction.created</code>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <code className="text-primary">transaction.funded</code>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <code className="text-primary">transaction.released</code>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <code className="text-primary">dispute.opened</code>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-primary to-green-dark hover:opacity-90">
                      Save Webhook Configuration
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiIntegration;

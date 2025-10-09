import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const TransactionCreate = () => {
  const [items, setItems] = useState([{ id: 1, category: "", price: "", description: "" }]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const addItem = () => {
    setItems([...items, { id: items.length + 1, category: "", price: "", description: "" }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Transaction created!",
      description: "Your escrow transaction has been initialized.",
    });
    navigate("/profile");
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
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="shadow-xl border-2">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-green-dark/10 border-b">
            <CardTitle className="text-3xl font-bold text-center">
              Start A Transaction With Escrow
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Transaction Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg font-semibold">Transaction Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Sale of MacBook Pro 2024"
                  className="text-lg"
                  required
                />
              </div>

              {/* My Role */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-lg font-semibold">My Role</Label>
                <Select required>
                  <SelectTrigger className="text-lg">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="broker">Broker</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Transaction Items</h3>
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <Card key={item.id} className="bg-accent/50 border-2">
                      <CardContent className="pt-6 space-y-4">
                        <h4 className="font-semibold text-lg">Item #{index + 1}</h4>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Item Category</Label>
                            <Select required>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="electronics">Electronics</SelectItem>
                                <SelectItem value="vehicles">Vehicles</SelectItem>
                                <SelectItem value="real-estate">Real Estate</SelectItem>
                                <SelectItem value="services">Services</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Price</Label>
                            <Input
                              type="number"
                              placeholder="0.00"
                              step="0.01"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Item Description</Label>
                          <Textarea
                            placeholder="Describe the item in detail..."
                            rows={3}
                            required
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4 border-2 border-dashed border-primary hover:bg-accent"
                  onClick={addItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Item
                </Button>
              </div>

              {/* Transaction Details */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-xl font-semibold mb-4">Transaction Details</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD - US Dollar</SelectItem>
                        <SelectItem value="eur">EUR - Euro</SelectItem>
                        <SelectItem value="gbp">GBP - British Pound</SelectItem>
                        <SelectItem value="etb">ETB - Ethiopian Birr</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Inspection Time (Days)</Label>
                    <Input
                      type="number"
                      placeholder="7"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Shipping Fee Paid By</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Who pays shipping?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Buyer</SelectItem>
                      <SelectItem value="seller">Seller</SelectItem>
                      <SelectItem value="split">Split 50/50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-green-dark hover:opacity-90 text-lg"
                >
                  Continue to Profile Info
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionCreate;

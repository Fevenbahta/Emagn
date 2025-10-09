import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Search, Filter, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockTransactions = [
  {
    id: "TXN-001",
    title: "MacBook Pro 2024 Purchase",
    created: "2025-01-15",
    amount: "$2,499.00",
    role: "Buyer",
    status: "open",
  },
  {
    id: "TXN-002",
    title: "Web Development Services",
    created: "2025-01-12",
    amount: "$5,000.00",
    role: "Seller",
    status: "action-required",
  },
  {
    id: "TXN-003",
    title: "Real Estate Commission",
    created: "2025-01-10",
    amount: "$15,000.00",
    role: "Broker",
    status: "closed",
  },
];

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500";
      case "action-required":
        return "bg-yellow-500";
      case "closed":
        return "bg-green-600";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  const filteredTransactions = mockTransactions.filter(txn => {
    if (activeTab === "all") return true;
    if (activeTab === "action-required") return txn.status === "action-required";
    if (activeTab === "open") return txn.status === "open";
    if (activeTab === "closed") return txn.status === "closed";
    return true;
  }).filter(txn => 
    txn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Link to="/transactions" className="text-primary font-semibold">Transactions</Link>
            <Link to="/api" className="text-foreground hover:text-primary transition">API Integration</Link>
            <Link to="/profile" className="text-foreground hover:text-primary transition">Profile</Link>
          </nav>
          <Link to="/transaction/create">
            <Button className="bg-gradient-to-r from-primary to-green-dark hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Transactions</h1>
          <p className="text-muted-foreground">Manage and track all your escrow transactions</p>
        </div>

        <Card className="shadow-xl border-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="all" className="space-y-6" onValueChange={setActiveTab}>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <TabsList className="grid grid-cols-4 w-full md:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="action-required">Action Required</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="closed">Closed</TabsTrigger>
                </TabsList>

                <div className="flex gap-2">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                You are viewing <span className="font-semibold text-foreground">{filteredTransactions.length}</span> transaction{filteredTransactions.length !== 1 ? 's' : ''}
              </div>

              <TabsContent value={activeTab} className="mt-0">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Transaction Title</TableHead>
                        <TableHead className="font-semibold">Created</TableHead>
                        <TableHead className="font-semibold">Amount</TableHead>
                        <TableHead className="font-semibold">Role</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((txn) => (
                          <TableRow key={txn.id} className="hover:bg-muted/30 transition">
                            <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                            <TableCell className="font-medium">{txn.title}</TableCell>
                            <TableCell>{txn.created}</TableCell>
                            <TableCell className="font-semibold text-primary">{txn.amount}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{txn.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(txn.status)} text-white`}>
                                {getStatusLabel(txn.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                            No transactions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transactions;

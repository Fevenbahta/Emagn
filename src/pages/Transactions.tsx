import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Filter, Plus, RefreshCw, Search, Calendar, Download, ArrowLeft } from "lucide-react";
import { transactionApi } from "@/services/transactionApi";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ApiStringField {
  String: string;
  Valid: boolean;
}

interface ApiDateTime {
  Time: string;
  Valid: boolean;
}

interface Transaction {
  id: string;
  title: string | ApiStringField;
  role: string;
  currency: string;
  inspection_period: string | ApiStringField;
  item_category_id: string;
  item_name: string;
  item_description: string | ApiStringField;
  price: string;
  shipping_method: string | ApiStringField;
  seller_email: string;
  seller_phone: string | ApiStringField;
  buyer_email: string;
  buyer_phone: string | ApiStringField;
  status: string | ApiStringField;
  created_at: ApiDateTime;
  updated_at: ApiDateTime;
  item_category_name: string;
  item_category_description: string | ApiStringField;
  [key: string]: any;
}

// Your provided data
const mockTransactions: Transaction[] = [
  {
    "id": "a19f2cda-6596-4db9-b356-9d32b0373f92",
    "title": {
      "String": "Phone Escrow",
      "Valid": true
    },
    "role": "Buyer",
    "currency": "ETB",
    "inspection_period": {
      "String": "7 days",
      "Valid": true
    },
    "item_category_id": "fb0de8de-41fc-47e0-9684-2fad376e2c72",
    "item_name": "iPhone 13",
    "item_description": {
      "String": "Like new",
      "Valid": true
    },
    "price": "19999",
    "shipping_method": {
      "String": "Courier",
      "Valid": true
    },
    "seller_email": "seller@example.com",
    "seller_phone": {
      "String": "+251911111111",
      "Valid": true
    },
    "buyer_email": "buyer@example.com",
    "buyer_phone": {
      "String": "+251922222222",
      "Valid": true
    },
    "status": {
      "String": "PendingSellerConfirm",
      "Valid": true
    },
    "created_at": {
      "Time": "2026-01-15T12:38:00.454412Z",
      "Valid": true
    },
    "updated_at": {
      "Time": "2026-01-15T12:38:00.454412Z",
      "Valid": true
    },
    "item_category_name": "Electronics",
    "item_category_description": {
      "String": "Devices and gadgets",
      "Valid": true
    }
  },
  {
    "id": "9e243e8e-0936-454d-b868-e034c0623cd8",
    "title": {
      "String": "Phone Escrow",
      "Valid": true
    },
    "role": "Buyer",
    "currency": "ETB",
    "inspection_period": {
      "String": "7 days",
      "Valid": true
    },
    "item_category_id": "fb0de8de-41fc-47e0-9684-2fad376e2c72",
    "item_name": "iPhone 13",
    "item_description": {
      "String": "Like new",
      "Valid": true
    },
    "price": "19999",
    "shipping_method": {
      "String": "Courier",
      "Valid": true
    },
    "seller_email": "seller@example.com",
    "seller_phone": {
      "String": "+251911111111",
      "Valid": true
    },
    "buyer_email": "buyer@example.com",
    "buyer_phone": {
      "String": "+251922222222",
      "Valid": true
    },
    "status": {
      "String": "PendingSellerConfirm",
      "Valid": true
    },
    "created_at": {
      "Time": "2026-01-15T12:34:49.256259Z",
      "Valid": true
    },
    "updated_at": {
      "Time": "2026-01-15T12:34:49.256259Z",
      "Valid": true
    },
    "item_category_name": "Electronics",
    "item_category_description": {
      "String": "Devices and gadgets",
      "Valid": true
    }
  },
  {
    "id": "04bf597a-1137-41cf-8ff6-0a4f089bba1c",
    "title": {
      "String": "Phone Escrow",
      "Valid": true
    },
    "role": "Buyer",
    "currency": "ETB",
    "inspection_period": {
      "String": "7 days",
      "Valid": true
    },
    "item_category_id": "fb0de8de-41fc-47e0-9684-2fad376e2c72",
    "item_name": "iPhone 13",
    "item_description": {
      "String": "Like new",
      "Valid": true
    },
    "price": "19999",
    "shipping_method": {
      "String": "Courier",
      "Valid": true
    },
    "seller_email": "seller@example.com",
    "seller_phone": {
      "String": "+251911111111",
      "Valid": true
    },
    "buyer_email": "buyer@example.com",
    "buyer_phone": {
      "String": "+251922222222",
      "Valid": true
    },
    "status": {
      "String": "PendingSellerConfirm",
      "Valid": true
    },
    "created_at": {
      "Time": "2026-01-15T12:33:52.485635Z",
      "Valid": true
    },
    "updated_at": {
      "Time": "2026-01-15T12:33:52.485635Z",
      "Valid": true
    },
    "item_category_name": "Electronics",
    "item_category_description": {
      "String": "Devices and gadgets",
      "Valid": true
    }
  },
  {
    "id": "99fc9130-9e9c-47ea-9135-388adf38c530",
    "title": {
      "String": "Phone Escrow",
      "Valid": true
    },
    "role": "Buyer",
    "currency": "ETB",
    "inspection_period": {
      "String": "7 days",
      "Valid": true
    },
    "item_category_id": "fb0de8de-41fc-47e0-9684-2fad376e2c72",
    "item_name": "iPhone 13",
    "item_description": {
      "String": "Like new",
      "Valid": true
    },
    "price": "19999",
    "shipping_method": {
      "String": "Courier",
      "Valid": true
    },
    "seller_email": "seller@example.com",
    "seller_phone": {
      "String": "+251911111111",
      "Valid": true
    },
    "buyer_email": "buyer@example.com",
    "buyer_phone": {
      "String": "+251922222222",
      "Valid": true
    },
    "status": {
      "String": "Pending",
      "Valid": true
    },
    "created_at": {
      "Time": "2026-01-02T11:55:24.704987Z",
      "Valid": true
    },
    "updated_at": {
      "Time": "2026-01-02T11:55:24.704987Z",
      "Valid": true
    },
    "item_category_name": "Electronics",
    "item_category_description": {
      "String": "Devices and gadgets",
      "Valid": true
    }
  }
];

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper function to safely extract string from ApiStringField or string
  const extractString = (value: string | ApiStringField | any): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') {
      if (value.String !== undefined && value.Valid) return value.String || '';
      if (value.value !== undefined) return value.value || '';
      if (value.String !== undefined) return value.String || ''; // Even if Valid is false
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Helper to format date
  const formatDate = (dateField: ApiDateTime): string => {
    if (!dateField?.Valid) return 'Unknown date';
    try {
      const date = new Date(dateField.Time);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Fetch transactions from API
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let data;
      
      // Use mock data or API data
      const useMockData = true; // Set to false to use real API
      
      if (useMockData) {
        // Use provided mock data
        data = mockTransactions;
      } else {
        // Try to fetch from API
        try {
          data = await transactionApi.getAll({ limit: 50, offset: 0 });
          if (!Array.isArray(data)) {
            throw new Error("Invalid data format from API");
          }
        } catch (err) {
          console.log("Using mock data due to API error:", err);
          data = mockTransactions;
        }
      }
      
      // Extract unique categories from transactions
      const uniqueCategories = Array.from(
        new Map(
          data
            .filter(txn => txn.item_category_id)
            .map(txn => [
              txn.item_category_id,
              {
                id: txn.item_category_id || 'unknown',
                name: extractString(txn.item_category_name) || 'Unknown Category'
              }
            ])
        ).values()
      );
      
      setCategories(uniqueCategories);
      setTransactions(data);
      setFilteredTransactions(data);
      
      console.log(`Loaded ${data.length} transactions`);
      console.log(`Found ${uniqueCategories.length} unique categories`);
      
      toast({ 
        title: "Success", 
        description: `Loaded ${data.length} transactions`, 
      });
      
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      toast({ 
        title: "Error fetching transactions", 
        description: err.message || "Failed to load transactions", 
        variant: "destructive" 
      });
      // Fallback to mock data
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setCategories([{ id: "fb0de8de-41fc-47e0-9684-2fad376e2c72", name: "Electronics" }]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter transactions based on search term, filters, and active tab
  useEffect(() => {
    let filtered = transactions;
    
    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(txn => {
        const status = extractString(txn.status);
        return status.toLowerCase().includes(activeTab.toLowerCase());
      });
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(txn => {
        const title = extractString(txn.title).toLowerCase();
        const id = txn.id?.toLowerCase() || '';
        const itemName = extractString(txn.item_name).toLowerCase();
        const itemDesc = extractString(txn.item_description).toLowerCase();
        const categoryName = extractString(txn.item_category_name).toLowerCase();
        const sellerEmail = txn.seller_email?.toLowerCase() || '';
        const buyerEmail = txn.buyer_email?.toLowerCase() || '';
        const price = txn.price || '';
        
        return (
          title.includes(term) ||
          id.includes(term) ||
          itemName.includes(term) ||
          itemDesc.includes(term) ||
          categoryName.includes(term) ||
          sellerEmail.includes(term) ||
          buyerEmail.includes(term) ||
          price.includes(term)
        );
      });
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(txn => {
        const status = extractString(txn.status) || '';
        return status.toLowerCase() === statusFilter.toLowerCase();
      });
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(txn => {
        return txn.item_category_id === categoryFilter;
      });
    }
    
    setFilteredTransactions(filtered);
  }, [searchTerm, statusFilter, categoryFilter, activeTab, transactions]);

  // Get all unique statuses from transactions
  const getUniqueStatuses = () => {
    const statuses = new Set<string>();
    transactions.forEach(txn => {
      const status = extractString(txn.status);
      if (status) statuses.add(status);
    });
    return Array.from(statuses);
  };

  const getStatusColor = (status: string): string => {
    const statusStr = status.toLowerCase();
    
    if (statusStr.includes('pending') && statusStr.includes('seller')) return "bg-orange-500";
    if (statusStr.includes('pending')) return "bg-yellow-500";
    if (statusStr.includes('confirm')) return "bg-blue-500";
    if (statusStr.includes('open')) return "bg-green-500";
    if (statusStr.includes('closed')) return "bg-gray-600";
    if (statusStr.includes('shipped')) return "bg-purple-500";
    if (statusStr.includes('action') || statusStr.includes('required')) return "bg-red-500";
    
    return "bg-gray-500";
  };

  const getStatusDisplay = (status: string): string => {
    return status
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const getStatusBadge = (status: string) => {
    const statusDisplay = getStatusDisplay(status);
    const color = getStatusColor(status);
    
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    if (color.includes('red')) variant = "destructive";
    if (color.includes('orange')) variant = "outline";
    
    return (
      <Badge variant={variant} className={color === "bg-gray-500" ? "" : `text-white ${color}`}>
        {statusDisplay}
      </Badge>
    );
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      // In a real app, this would call the API
      await transactionApi.updateStatus(id, newStatus);
      
      // Update local state
      setTransactions(prev => prev.map(txn => 
        txn.id === id 
          ? { ...txn, status: { String: newStatus, Valid: true } }
          : txn
      ));
      
      toast({
        title: "Success",
        description: `Status updated to ${getStatusDisplay(newStatus)}`,
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/transactions/${id}`);
  };

  const handleExportData = () => {
    // Export filtered transactions as JSON
    const exportData = filteredTransactions.map(txn => ({
      id: txn.id,
      title: extractString(txn.title),
      status: extractString(txn.status),
      item: extractString(txn.item_name),
      category: extractString(txn.item_category_name),
      price: `${extractString(txn.currency)} ${txn.price}`,
      role: txn.role,
      seller: txn.seller_email,
      buyer: txn.buyer_email,
      created: formatDate(txn.created_at)
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: `Exported ${exportData.length} transactions`,
    });
  };

  const calculateStats = () => {
    const total = transactions.length;
    const pending = transactions.filter(t => {
      const status = extractString(t.status);
      return status.toLowerCase().includes('pending');
    }).length;
    const pendingSellerConfirm = transactions.filter(t => {
      const status = extractString(t.status);
      return status === 'PendingSellerConfirm';
    }).length;
    const totalValue = transactions.reduce((sum, t) => sum + parseFloat(t.price || '0'), 0);
    
    return { total, pending, pendingSellerConfirm, totalValue };
  };

  const uniqueStatuses = getUniqueStatuses();
  const stats = calculateStats();

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="flex justify-between items-center mb-6">
        <div>
         <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Manage and monitor all transaction activities</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={fetchTransactions} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate("/transaction/create")}>
            <Plus className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-gray-500">Total Transactions</div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-gray-500">Pending Transactions</div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.pendingSellerConfirm}</div>
            <div className="text-gray-500">Awaiting Seller</div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">ETB {stats.totalValue.toLocaleString()}</div>
            <div className="text-gray-500">Total Value</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for quick filtering */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="all">All ({transactions.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="pendingsellerconfirm">
            Awaiting Seller ({stats.pendingSellerConfirm})
          </TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <Card className="shadow-lg mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, item, email, ID, or price..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status.toLowerCase()}>
                      {getStatusDisplay(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setActiveTab("all");
              }}
              className="h-10"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="shadow-xl border-2">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-3">Loading transactions...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto opacity-50" />
                <h3 className="text-lg font-semibold mt-4">No Transactions Found</h3>
                <p className="mt-2">
                  No transactions found. Create your first transaction to get started.
                </p>
              </div>
              <Button onClick={() => navigate("/transaction/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Transaction
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="whitespace-nowrap">Transaction</TableHead>
                    <TableHead className="whitespace-nowrap">Item & Category</TableHead>
                    <TableHead className="whitespace-nowrap">Role & Price</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Created</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? filteredTransactions.map(txn => {
                    const status = extractString(txn.status);
                    const statusDisplay = getStatusDisplay(status);
                    const itemName = extractString(txn.item_name);
                    const itemDescription = extractString(txn.item_description);
                    const title = extractString(txn.title);
                    const role = extractString(txn.role);
                    const price = extractString(txn.price);
                    const currency = extractString(txn.currency);
                    const categoryName = extractString(txn.item_category_name);
                    const createdDate = formatDate(txn.created_at);
                    
                    return (
                      <TableRow key={txn.id} className="hover:bg-muted/30 transition">
                        <TableCell>
                          <div>
                            <p className="font-medium">{title || 'Untitled Transaction'}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              ID: {txn.id}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              Seller: {txn.seller_email}
                            </p>
                            <p className="text-xs text-green-600">
                              Buyer: {txn.buyer_email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{itemName || 'No item name'}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {itemDescription || 'No description'}
                            </p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {categoryName || 'Unknown Category'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Badge variant={role === 'Buyer' ? "default" : "secondary"} className="mb-1">
                              {role || 'Unknown Role'}
                            </Badge>
                            <p className="font-bold text-lg text-primary">
                              {currency || 'ETB'} {price ? parseFloat(price).toLocaleString() : '0.00'}
                            </p>
                            {txn.inspection_period && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Inspection: {extractString(txn.inspection_period)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            {getStatusBadge(status)}
                            <Select
                              value={status.toLowerCase()}
                              onValueChange={(value) => handleStatusUpdate(txn.id, value)}
                            >
                              <SelectTrigger className="h-7 w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="pendingsellerconfirm">Pending Seller Confirm</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4" />
                              <span>{createdDate}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Updated: {formatDate(txn.updated_at)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewDetails(txn.id)}
                              className="hover:bg-primary hover:text-primary-foreground"
                            >
                              <Eye className="h-4 w-4 mr-2" /> 
                              View Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        <Search className="h-12 w-12 mx-auto opacity-50 mb-4" />
                        <h3 className="text-lg font-semibold">No matching transactions</h3>
                        <p className="mt-2">Try adjusting your search or filters</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                            setCategoryFilter("all");
                            setActiveTab("all");
                          }}
                        >
                          Clear All Filters
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
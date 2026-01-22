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
import { categoryApi } from "@/services/categoryApi";
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

  // Format date for sorting/display
  const formatDateOnly = (dateField: ApiDateTime): string => {
    if (!dateField?.Valid) return 'Unknown date';
    try {
      const date = new Date(dateField.Time);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const categoriesData = await categoryApi.getAll();
      const formattedCategories = categoriesData.map(cat => ({
        id: cat.id,
        name: extractString(cat.name) || 'Unknown Category'
      }));
      setCategories(formattedCategories);
      console.log(`Loaded ${formattedCategories.length} categories from API`);
      return formattedCategories;
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      toast({ 
        title: "Error fetching categories", 
        description: err.message || "Failed to load categories", 
        variant: "destructive" 
      });
      return [];
    }
  };

  // Fetch transactions from API - Modified to handle category changes
  const fetchTransactions = async (categoryId?: string) => {
    setLoading(true);
    try {
      let data;
      
      // If a specific category is provided, fetch transactions for that category
      if (categoryId && categoryId !== "all") {
        data = await transactionApi.getByCategory(categoryId, { limit: 100, offset: 0 });
      } 
      // Otherwise, try to get all transactions, with fallback to first category
      else {
        try {
          data = await transactionApi.getAll({ limit: 100, offset: 0 });
        } catch (err) {
          console.log("Could not fetch all transactions, trying category-based...");
          // If that fails, try with a default category (first one)
          if (categories.length > 0) {
            data = await transactionApi.getByCategory(categories[0].id, { limit: 100, offset: 0 });
          } else {
            data = [];
          }
        }
      }
      
      // Handle different response formats
      let transactionsArray: Transaction[] = [];
      
      if (Array.isArray(data)) {
        transactionsArray = data;
      } else if (data && typeof data === 'object') {
        // If API returns an object with a data property
        if (Array.isArray(data.data)) {
          transactionsArray = data.data;
        } else if (Array.isArray(data.transactions)) {
          transactionsArray = data.transactions;
        } else if (Array.isArray(data.items)) {
          transactionsArray = data.items;
        }
      }
      
      // Sort by most recent first
      transactionsArray.sort((a, b) => {
        try {
          const dateA = a.created_at?.Valid ? new Date(a.created_at.Time).getTime() : 0;
          const dateB = b.created_at?.Valid ? new Date(b.created_at.Time).getTime() : 0;
          return dateB - dateA;
        } catch {
          return 0;
        }
      });
      
      setTransactions(transactionsArray);
      setFilteredTransactions(transactionsArray);
      
      console.log(`Loaded ${transactionsArray.length} transactions for ${categoryId === "all" ? "all categories" : `category ${categoryId}`}`);
      
      toast({ 
        title: "Success", 
        description: `Loaded ${transactionsArray.length} transactions`, 
        variant: "default"
      });
      
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      
      // Provide more specific error message
      let errorMessage = "Failed to load transactions";
      if (err.response) {
        errorMessage = `Server error: ${err.response.status}`;
        if (err.response.data?.message) {
          errorMessage += ` - ${err.response.data.message}`;
        }
      } else if (err.request) {
        errorMessage = "Network error: Could not reach server";
      } else {
        errorMessage = `Error: ${err.message}`;
      }
      
      toast({ 
        title: "Error fetching transactions", 
        description: errorMessage, 
        variant: "destructive" 
      });
      
      // Set empty arrays
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle category filter change - fetch new transactions for selected category
  const handleCategoryChange = async (value: string) => {
    setCategoryFilter(value);
    await fetchTransactions(value === "all" ? undefined : value);
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      // First fetch categories
      const fetchedCategories = await fetchCategories();
      
      // Then fetch transactions (initially for all or first category)
      // If we have categories, use the first one as initial
      if (fetchedCategories.length > 0) {
        // Option 1: Fetch for all categories initially
        // await fetchTransactions();
        
        // Option 2: Fetch for first category initially (your current approach)
        await fetchTransactions(fetchedCategories[0].id);
        setCategoryFilter(fetchedCategories[0].id);
      } else {
        // Try to fetch all if no categories
        await fetchTransactions();
      }
    };
    
    fetchAllData();
  }, []);

  // Refresh both categories and transactions
  const handleRefresh = async () => {
    await fetchCategories();
    await fetchTransactions(categoryFilter === "all" ? undefined : categoryFilter);
  };

  // Filter transactions based on search term, filters, and active tab
  useEffect(() => {
    let filtered = [...transactions];
    
    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(txn => {
        const status = extractString(txn.status).toLowerCase();
        return status.includes(activeTab.toLowerCase());
      });
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(txn => {
        const title = extractString(txn.title).toLowerCase();
        const id = txn.id?.toLowerCase() || '';
        const itemName = extractString(txn.item_name).toLowerCase();
        const itemDesc = extractString(txn.item_description).toLowerCase();
        const categoryName = extractString(txn.item_category_name).toLowerCase();
        const sellerEmail = txn.seller_email?.toLowerCase() || '';
        const buyerEmail = txn.buyer_email?.toLowerCase() || '';
        const price = txn.price || '';
        const currency = extractString(txn.currency).toLowerCase();
        
        return (
          title.includes(term) ||
          id.includes(term) ||
          itemName.includes(term) ||
          itemDesc.includes(term) ||
          categoryName.includes(term) ||
          sellerEmail.includes(term) ||
          buyerEmail.includes(term) ||
          price.includes(term) ||
          currency.includes(term)
        );
      });
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(txn => {
        const status = extractString(txn.status).toLowerCase();
        return status === statusFilter.toLowerCase();
      });
    }
    
    // Note: We no longer apply category filter here since we fetch by category
    
    setFilteredTransactions(filtered);
  }, [searchTerm, statusFilter, activeTab, transactions]);

  // Get all unique statuses from transactions
  const getUniqueStatuses = () => {
    const statuses = new Set<string>();
    transactions.forEach(txn => {
      const status = extractString(txn.status);
      if (status && status.trim()) {
        statuses.add(status);
      }
    });
    return Array.from(statuses).sort();
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
    if (statusStr.includes('completed')) return "bg-green-600";
    if (statusStr.includes('failed') || statusStr.includes('cancelled')) return "bg-red-600";
    
    return "bg-gray-500";
  };

  const getStatusDisplay = (status: string): string => {
    if (!status) return 'Unknown Status';
    
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
    if (color.includes('orange') || color.includes('yellow')) variant = "outline";
    
    return (
      <Badge variant={variant} className={color === "bg-gray-500" ? "" : `text-white ${color}`}>
        {statusDisplay}
      </Badge>
    );
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      // Call API to update status
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
      console.error("Error updating status:", err);
      
      let errorMessage = "Failed to update status";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/transactions/${id}`);
  };

  const handleExportData = () => {
    if (filteredTransactions.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no transactions to export",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Export filtered transactions as CSV
      const headers = [
        'ID',
        'Title',
        'Status',
        'Item Name',
        'Category',
        'Price',
        'Currency',
        'Role',
        'Seller Email',
        'Buyer Email',
        'Created Date',
        'Last Updated'
      ];
      
      const csvData = filteredTransactions.map(txn => [
        txn.id,
        extractString(txn.title),
        extractString(txn.status),
        extractString(txn.item_name),
        extractString(txn.item_category_name),
        txn.price,
        extractString(txn.currency),
        txn.role,
        txn.seller_email,
        txn.buyer_email,
        formatDateOnly(txn.created_at),
        formatDateOnly(txn.updated_at)
      ]);
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: `Exported ${filteredTransactions.length} transactions as CSV`,
      });
    } catch (err) {
      console.error("Error exporting data:", err);
      toast({
        title: "Export Failed",
        description: "Failed to export transactions",
        variant: "destructive"
      });
    }
  };

  const calculateStats = () => {
    const total = transactions.length;
    const pending = transactions.filter(t => {
      const status = extractString(t.status).toLowerCase();
      return status.includes('pending');
    }).length;
    const pendingSellerConfirm = transactions.filter(t => {
      const status = extractString(t.status).toLowerCase();
      return status.includes('pending') && status.includes('seller');
    }).length;
    const completed = transactions.filter(t => {
      const status = extractString(t.status).toLowerCase();
      return status.includes('completed') || status.includes('closed') || status.includes('delivered');
    }).length;
    const totalValue = transactions.reduce((sum, t) => {
      const price = parseFloat(t.price || '0');
      return isNaN(price) ? sum : sum + price;
    }, 0);
    
    return { total, pending, pendingSellerConfirm, completed, totalValue };
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
          <Button 
            onClick={handleRefresh} 
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            onClick={handleExportData} 
            variant="outline"
            disabled={filteredTransactions.length === 0}
          >
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
        <TabsList className="flex flex-wrap w-full max-w-3xl">
          <TabsTrigger value="all" className="flex-1 min-w-[120px]">All ({transactions.length})</TabsTrigger>
          <TabsTrigger value="pending" className="flex-1 min-w-[120px]">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="pendingsellerconfirm" className="flex-1 min-w-[150px]">
            Awaiting Seller ({stats.pendingSellerConfirm})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 min-w-[120px]">Completed ({stats.completed})</TabsTrigger>
          <TabsTrigger value="confirmed" className="flex-1 min-w-[120px]">Confirmed</TabsTrigger>
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
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Select 
                value={categoryFilter} 
                onValueChange={handleCategoryChange}
                disabled={loading || categories.length === 0}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={categories.length === 0 ? "No categories" : "Select Category"} />
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
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
                disabled={loading}
              >
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
                setActiveTab("all");
                // When clearing filters, we fetch for all categories
                handleCategoryChange("all");
              }}
              className="h-10"
              disabled={loading}
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
            <div className="flex flex-col justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-3 mt-2">Loading transactions...</span>
              <p className="text-sm text-muted-foreground mt-1">
                {categoryFilter === "all" 
                  ? "Fetching all transactions..." 
                  : `Fetching transactions for ${categories.find(c => c.id === categoryFilter)?.name || "selected category"}...`}
              </p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto opacity-50" />
                <h3 className="text-lg font-semibold mt-4">No Transactions Found</h3>
                <p className="mt-2">
                  {categoryFilter === "all" 
                    ? "No transactions found. Create your first transaction to get started."
                    : `No transactions found in this category. Try selecting a different category or create a new transaction.`}
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => handleCategoryChange("all")}
                >
                  View All Categories
                </Button>
                <Button onClick={() => navigate("/transactions/create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Transaction
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="p-4 bg-muted/30 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {categoryFilter === "all" 
                        ? "All Categories" 
                        : `Category: ${categories.find(c => c.id === categoryFilter)?.name || "Selected"}`}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({filteredTransactions.length} of {transactions.length} transactions)
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
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
                              ID: {txn.id.substring(0, 8)}...
                            </p>
                            <div className="mt-1 space-y-1">
                              <p className="text-xs text-blue-600 truncate max-w-[200px]">
                                Seller: {txn.seller_email}
                              </p>
                              <p className="text-xs text-green-600 truncate max-w-[200px]">
                                Buyer: {txn.buyer_email}
                              </p>
                            </div>
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
                            <p className="text-xs text-muted-foreground mt-1">
                              Ship: {extractString(txn.shipping_method) || 'Not specified'}
                            </p>
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
                              disabled={loading}
                            >
                              <SelectTrigger className="h-7 w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="pendingsellerconfirm">Pending Seller Confirm</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
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
                              Updated: {formatDateOnly(txn.updated_at)}
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
                              Details
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
                        <p className="mt-2">Try adjusting your search or status filter</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                            setActiveTab("all");
                          }}
                          disabled={loading}
                        >
                          Clear Search & Status Filters
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
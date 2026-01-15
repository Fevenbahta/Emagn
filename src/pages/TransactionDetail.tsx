import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Mail, 
  Phone, 
  Package, 
  Settings,
  Trash2,
  Plus,
  Loader2,
  Clock,
  User,
  Truck
} from "lucide-react";
import { transactionApi } from "@/services/transactionApi";
import { useToast } from "@/hooks/use-toast";

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
  title: ApiStringField;
  role: string;
  currency: string;
  inspection_period: ApiStringField;
  item_category_id: string;
  item_name: string;
  item_description: ApiStringField;
  price: string;
  shipping_method: ApiStringField;
  seller_email: string;
  seller_phone: ApiStringField;
  buyer_email: string;
  buyer_phone: ApiStringField;
  status: ApiStringField;
  created_at: ApiDateTime;
  updated_at: ApiDateTime;
  item_category_name: string;
  item_category_description: ApiStringField;
  attributes?: Array<{
    attribute_id: string;
    value: string;
  }>;
}

// Create a more flexible interface for API response
interface ApiTransaction {
  id: string;
  title: ApiStringField | string;
  role: string;
  currency: string;
  inspection_period: ApiStringField | string;
  item_category_id: string;
  item_name: string;
  item_description: ApiStringField | string;
  price: string;
  shipping_method: ApiStringField | string;
  seller_email: string;
  seller_phone: ApiStringField | string;
  buyer_email: string;
  buyer_phone: ApiStringField | string;
  status: ApiStringField | string;
  created_at: ApiDateTime | string | 0;
  updated_at: ApiDateTime | string | 0;
  item_category_name: string;
  item_category_description: ApiStringField | string;
  attributes?: Array<{
    attribute_id: string;
    value: string;
  }>;
}

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [newAttribute, setNewAttribute] = useState({ attribute_id: "", value: "" });
  const [addingAttribute, setAddingAttribute] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Helper function to extract string from ApiStringField or string
  const extractString = (field: ApiStringField | string | any): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (field && typeof field === 'object' && 'String' in field) return field.String || '';
    return String(field || '');
  };

  // Helper to normalize ApiDateTime or string or 0 to ApiDateTime
  const normalizeDate = (dateField: ApiDateTime | string | 0): ApiDateTime => {
    if (!dateField) {
      return { Time: '', Valid: false };
    }
    
    if (typeof dateField === 'object' && 'Time' in dateField && 'Valid' in dateField) {
      return dateField;
    }
    
    if (typeof dateField === 'string') {
      return { Time: dateField, Valid: !!dateField };
    }
    
    return { Time: '', Valid: false };
  };

  // Helper to format date
  const formatDate = (dateField: ApiDateTime | string | 0): string => {
    const normalizedDate = normalizeDate(dateField);
    
    if (!normalizedDate?.Valid) return 'Unknown date';
    try {
      const date = new Date(normalizedDate.Time);
      if (isNaN(date.getTime())) return 'Invalid date';
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

  // Helper to normalize API response to Transaction interface
  const normalizeTransaction = (apiData: ApiTransaction): Transaction => {
    return {
      ...apiData,
      title: typeof apiData.title === 'string' 
        ? { String: apiData.title, Valid: !!apiData.title } 
        : apiData.title,
      inspection_period: typeof apiData.inspection_period === 'string'
        ? { String: apiData.inspection_period, Valid: !!apiData.inspection_period }
        : apiData.inspection_period,
      item_description: typeof apiData.item_description === 'string'
        ? { String: apiData.item_description, Valid: !!apiData.item_description }
        : apiData.item_description,
      shipping_method: typeof apiData.shipping_method === 'string'
        ? { String: apiData.shipping_method, Valid: !!apiData.shipping_method }
        : apiData.shipping_method,
      seller_phone: typeof apiData.seller_phone === 'string'
        ? { String: apiData.seller_phone, Valid: !!apiData.seller_phone }
        : apiData.seller_phone,
      buyer_phone: typeof apiData.buyer_phone === 'string'
        ? { String: apiData.buyer_phone, Valid: !!apiData.buyer_phone }
        : apiData.buyer_phone,
      status: typeof apiData.status === 'string'
        ? { String: apiData.status, Valid: !!apiData.status }
        : apiData.status,
      created_at: normalizeDate(apiData.created_at),
      updated_at: normalizeDate(apiData.updated_at),
      item_category_description: typeof apiData.item_category_description === 'string'
        ? { String: apiData.item_category_description, Valid: !!apiData.item_category_description }
        : apiData.item_category_description,
    };
  };

  useEffect(() => {
    fetchTransaction();
    fetchAttributes();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      const data = await transactionApi.getById(id!);
      // Normalize the API response to match our Transaction interface
      const normalizedTransaction = normalizeTransaction(data) // data from API;
      setTransaction(data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to fetch transaction",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAttributes = async () => {
    try {
      const data = await transactionApi.getAttributes(id!);
      setAttributes(data || []);
    } catch (err: any) {
      console.error("Failed to fetch attributes:", err);
      setAttributes([]);
    }
  };

  const handleAddAttribute = async () => {
    if (!newAttribute.attribute_id.trim() || !newAttribute.value.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both fields",
        variant: "destructive"
      });
      return;
    }

    setAddingAttribute(true);
    try {
      await transactionApi.addAttribute(id!, newAttribute);
      toast({
        title: "Success",
        description: "Attribute added successfully"
      });
      setNewAttribute({ attribute_id: "", value: "" });
      fetchAttributes();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add attribute",
        variant: "destructive"
      });
    } finally {
      setAddingAttribute(false);
    }
  };

  const handleDeleteAllAttributes = async () => {
    try {
      await transactionApi.deleteAllAttributes(id!);
      toast({
        title: "Success",
        description: "All attributes deleted"
      });
      setAttributes([]);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete attributes",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatus = async (status: string) => {
    setUpdatingStatus(status);
    try {
      await transactionApi.updateStatus(id!, status);
      toast({
        title: "Success",
        description: `Status updated to ${status}`
      });
      fetchTransaction();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update status",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string): string => {
    const statusStr = status.toLowerCase();
    
    if (statusStr.includes('pending')) return "bg-yellow-500";
    if (statusStr.includes('confirm')) return "bg-blue-500";
    if (statusStr.includes('open')) return "bg-green-500";
    if (statusStr.includes('closed')) return "bg-gray-600";
    if (statusStr.includes('shipped')) return "bg-purple-500";
    if (statusStr.includes('action') || statusStr.includes('required')) return "bg-orange-500";
    
    return "bg-gray-500";
  };

  const getStatusDisplay = (status: string): string => {
    return status
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Transaction not found</h3>
            <Button onClick={() => navigate("/transactions")} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Transactions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = extractString(transaction.status);
  const statusColor = getStatusColor(status);
  const statusDisplay = getStatusDisplay(status);
  const title = extractString(transaction.title);
  const itemDescription = extractString(transaction.item_description);
  const inspectionPeriod = extractString(transaction.inspection_period);
  const shippingMethod = extractString(transaction.shipping_method);
  const sellerPhone = extractString(transaction.seller_phone);
  const buyerPhone = extractString(transaction.buyer_phone);
  const categoryDescription = extractString(transaction.item_category_description);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/transactions")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
              <p className="text-muted-foreground font-mono text-sm mt-1">
                ID: {transaction.id}
              </p>
            </div>
          </div>
          <Badge className={`text-white text-lg px-4 py-2 ${statusColor}`}>
            {statusDisplay}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Details Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price and Inspection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      Price
                    </Label>
                    <p className="text-2xl font-bold">
                      {transaction.currency} {parseFloat(transaction.price || '0').toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Inspection Period
                    </Label>
                    <p className="text-lg">{inspectionPeriod || "Not specified"}</p>
                  </div>
                </div>

                <Separator />

                {/* Item Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Item Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Item Name</Label>
                      <p className="font-medium">{transaction.item_name}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Shipping Method</Label>
                      <p className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        {shippingMethod}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Category</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{transaction.item_category_name}</Badge>
                      <span className="text-sm text-gray-600">{categoryDescription}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Description</Label>
                    <Textarea
                      value={itemDescription}
                      readOnly
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Seller
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{transaction.seller_email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{sellerPhone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Buyer
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{transaction.buyer_email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{buyerPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attributes Card */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Attributes
                  </CardTitle>
                  {attributes.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteAllAttributes}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {attributes.length > 0 ? (
                  <div className="space-y-3">
                    {attributes.map((attr, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition"
                      >
                        <div>
                          <p className="font-medium">{attr.attribute_id}</p>
                          <p className="text-sm text-muted-foreground">{attr.value}</p>
                        </div>
                        <Badge variant="outline">
                          Attribute
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No attributes added yet</p>
                  </div>
                )}

                {/* Add Attribute Form */}
                <div className="mt-6 p-4 border-2 border-dashed rounded-lg">
                  <h4 className="font-medium mb-4">Add New Attribute</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="attr-id">Attribute ID</Label>
                      <Input
                        id="attr-id"
                        placeholder="e.g., color, size, condition"
                        value={newAttribute.attribute_id}
                        onChange={(e) =>
                          setNewAttribute({ ...newAttribute, attribute_id: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="attr-value">Value</Label>
                      <Input
                        id="attr-value"
                        placeholder="e.g., Black, Large, New"
                        value={newAttribute.value}
                        onChange={(e) =>
                          setNewAttribute({ ...newAttribute, value: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddAttribute}
                    disabled={addingAttribute}
                    className="mt-4 w-full"
                  >
                    {addingAttribute ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Attribute
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Status Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['Pending', 'PendingSellerConfirm', 'Open', 'Shipped', 'Closed'].map((statusOption) => (
                  <Button
                    key={statusOption}
                    variant="outline"
                    className="w-full justify-start capitalize"
                    onClick={() => handleUpdateStatus(statusOption)}
                    disabled={updatingStatus === statusOption}
                  >
                    {updatingStatus === statusOption ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Mark as {statusOption.replace(/([A-Z])/g, ' $1').trim()}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Transaction Info */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Role</Label>
                  <Badge variant="secondary" className="mt-1">
                    {transaction.role}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Currency</Label>
                  <p className="font-medium">{transaction.currency}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Category ID</Label>
                  <p className="font-mono text-sm break-all">
                    {transaction.item_category_id || "Not specified"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created</Label>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(transaction.created_at)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(transaction.updated_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
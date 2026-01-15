import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Info, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { transactionApi } from "@/services/transactionApi";
import { categoryApi, type Category, type Attribute } from "@/services/categoryApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface TransactionItem {
  id: number;
  categoryId: string;
  price: string;
  name: string;
  description: string;
}

const TransactionCreate = () => {
  const [title, setTitle] = useState("");
  const [role, setRole] = useState<"Buyer" | "Seller" | "Broker">("Buyer");
  const [currency, setCurrency] = useState("ETB");
  const [inspection, setInspection] = useState("7");
  const [shippingMethod, setShippingMethod] = useState("Courier");
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [items, setItems] = useState<TransactionItem[]>([
    { 
      id: 1, 
      categoryId: "",
      price: "", 
      name: "", 
      description: "" 
    }
  ]);
  
  const [attributes, setAttributes] = useState<{attribute_id: string; value: string}[]>([
    { attribute_id: "", value: "" }
  ]);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryAttributes, setCategoryAttributes] = useState<Record<string, Attribute[]>>({});
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [fetchingAttributes, setFetchingAttributes] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch categories
  useEffect(() => { 
    const fetchCategories = async () => {
      setFetchingCategories(true);
      try {
        const data = await categoryApi.getAll();
        setCategories(data);
        
        // Set first category as default if available
        if (data.length > 0) {
          const newItems = [...items];
          newItems[0].categoryId = data[0].id;
          setItems(newItems);
          // Fetch attributes for the first category
          fetchCategoryAttributes(data[0].id);
        }
      } catch (err: any) {
        toast({ 
          title: "Error loading categories", 
          description: err.message || "Could not fetch categories", 
          variant: "destructive" 
        });
      } finally {
        setFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch attributes for a specific category
  const fetchCategoryAttributes = async (categoryId: string) => {
    setFetchingAttributes(prev => ({ ...prev, [categoryId]: true }));
    try {
      const attributes = await categoryApi.getAttributes(categoryId);
      setCategoryAttributes(prev => ({
        ...prev,
        [categoryId]: attributes
      }));
    } catch (error) {
      console.log(`No attributes found for category ${categoryId} or error:`, error);
      setCategoryAttributes(prev => ({
        ...prev,
        [categoryId]: []
      }));
    } finally {
      setFetchingAttributes(prev => ({ ...prev, [categoryId]: false }));
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string, itemIndex: number) => {
    const newItems = [...items];
    newItems[itemIndex].categoryId = categoryId;
    setItems(newItems);
    
    // Clear attributes when category changes
    setAttributes([{ attribute_id: "", value: "" }]);
    
    // Fetch attributes for the new category
    fetchCategoryAttributes(categoryId);
  };

  const addItem = () => {
    setItems([
      ...items, 
      { 
        id: items.length + 1, 
        categoryId: categories.length > 0 ? categories[0].id : "",
        price: "", 
        name: "", 
        description: "" 
      }
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const addAttribute = () => {
    setAttributes([...attributes, { attribute_id: "", value: "" }]);
  };

  const removeAttribute = (index: number) => {
    if (attributes.length > 1) {
      setAttributes(attributes.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const validations = [
      { condition: !title.trim(), message: "Transaction title is required" },
      { condition: !items[0].categoryId, message: "Please select a category for the item" },
      { condition: !items[0].name.trim(), message: "Item name is required" },
      { condition: !items[0].description.trim(), message: "Item description is required" },
      { condition: !items[0].price.trim() || isNaN(parseFloat(items[0].price)), message: "Please enter a valid price" },
      { condition: !sellerEmail.trim(), message: "Seller email is required" },
      { condition: !sellerPhone.trim(), message: "Seller phone is required" },
      { condition: !buyerEmail.trim(), message: "Buyer email is required" },
      { condition: !buyerPhone.trim(), message: "Buyer phone is required" },
    ];

    for (const validation of validations) {
      if (validation.condition) {
        toast({
          title: "Validation Error",
          description: validation.message,
          variant: "destructive"
        });
        return;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sellerEmail)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid seller email address",
        variant: "destructive"
      });
      return;
    }

    if (!emailRegex.test(buyerEmail)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid buyer email address",
        variant: "destructive"
      });
      return;
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)\.]{7,}$/;
    if (!phoneRegex.test(sellerPhone)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid seller phone number",
        variant: "destructive"
      });
      return;
    }

    if (!phoneRegex.test(buyerPhone)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid buyer phone number",
        variant: "destructive"
      });
      return;
    }

    // Validate attributes
    const invalidAttributes = attributes.filter(attr => 
      attr.attribute_id.trim() && !attr.value.trim()
    );
    if (invalidAttributes.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please provide values for all selected attributes",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const firstItem = items[0];
      const currentCategoryId = firstItem.categoryId;
      
      // Filter out empty attributes and ensure they have proper IDs
      const validAttributes = attributes
        .filter(attr => attr.attribute_id.trim() && attr.value.trim())
        .map(attr => ({
          attribute_id: attr.attribute_id.trim(),
          value: attr.value.trim()
        }));

      // Build the exact payload format as required by API
      const payload = {
        title: title.trim(),
        role,
        currency,
        inspection_period: `${inspection} days`,
        item_catagory_id: currentCategoryId,
        item_name: firstItem.name.trim(),
        item_description: firstItem.description.trim(),
        price: firstItem.price,
        shipping_method: shippingMethod,
        seller_email: sellerEmail.trim(),
        seller_phone: sellerPhone.trim(),
        buyer_email: buyerEmail.trim(),
        buyer_phone: buyerPhone.trim(),
        // Only include if we have valid attributes
        ...(validAttributes.length > 0 && { attributes: validAttributes })
      };

      console.log("Sending transaction payload:", JSON.stringify(payload, null, 2));

      const result = await transactionApi.createTransaction(payload);

      console.log("Transaction created successfully:", result);

      toast({ 
        title: "Success!", 
        description: "Transaction created successfully." 
      });
      navigate("/transactions");
    } catch (error: any) {
      console.error("Transaction creation error:", error);
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        
        let errorMessage = "Failed to create transaction";
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data) {
          errorMessage = JSON.stringify(error.response.data, null, 2);
        }
        
        toast({ 
          title: "API Error", 
          description: errorMessage, 
          variant: "destructive" 
        });
      } else if (error.request) {
        toast({ 
          title: "Network Error", 
          description: "No response received from server", 
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Error", 
          description: error.message || "Failed to create transaction", 
          variant: "destructive" 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getCurrentCategoryAttributes = () => {
    const currentCategoryId = items[0]?.categoryId;
    return categoryAttributes[currentCategoryId] || [];
  };

  const currentCategoryAttrs = getCurrentCategoryAttributes();
  const currentCategory = categories.find(cat => cat.id === items[0]?.categoryId);
  const isFetchingAttrs = fetchingAttributes[items[0]?.categoryId || ""];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <Card className="max-w-4xl mx-auto shadow-xl border-2">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Create New Transaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertTitle>Important Information</AlertTitle>
            <AlertDescription>
              Fill in all required fields (*) to create a new transaction. Make sure to provide accurate contact information.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Transaction Title *</Label>
                <Input 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Enter transaction title"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label>Your Role *</Label>
                <Select value={role} onValueChange={(value: "Buyer" | "Seller" | "Broker") => setRole(value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Buyer">Buyer</SelectItem>
                    <SelectItem value="Seller">Seller</SelectItem>
                    <SelectItem value="Broker">Broker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Currency and Inspection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Currency *</Label>
                <Select value={currency} onValueChange={setCurrency} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETB">ETB - Ethiopian Birr</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Inspection Period (days) *</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={inspection} 
                    onChange={e => setInspection(e.target.value)}
                    min="1"
                    max="30"
                    required
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">days</span>
                </div>
                <p className="text-xs text-gray-500">Will be sent as "{inspection} days" to API</p>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="space-y-2">
              <Label>Shipping Method *</Label>
              <Select value={shippingMethod} onValueChange={setShippingMethod} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Courier">Courier</SelectItem>
                  <SelectItem value="Pickup">Pickup</SelectItem>
                  <SelectItem value="Delivery">Delivery</SelectItem>
                  <SelectItem value="Freight">Freight</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Item Details *</h3>
              {items.map((item, idx) => (
                <Card key={item.id} className="bg-accent/50 border-2 p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Item #{idx + 1}</h4>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select 
                      value={item.categoryId} 
                      onValueChange={(value) => handleCategoryChange(value, idx)} 
                      required
                      disabled={fetchingCategories}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={fetchingCategories ? "Loading categories..." : "Select category"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{cat.name}</span>
                              {cat.description?.Valid && (
                                <span className="text-xs text-gray-500 truncate">
                                  {cat.description.String}
                                </span>
                              )}
                              <span className="text-xs font-mono text-gray-400 mt-1">
                                ID: {cat.id.substring(0, 8)}...
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {currentCategory && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Selected: <strong>{currentCategory.name}</strong></span>
                        <Badge variant="outline" className="text-xs">
                          ID: {currentCategory.id.substring(0, 8)}...
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Item Name *</Label>
                    <Input 
                      placeholder="Enter item name"
                      value={item.name} 
                      onChange={e => {
                        const newItems = [...items]; 
                        newItems[idx].name = e.target.value; 
                        setItems(newItems);
                      }} 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Price *</Label>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={item.price} 
                      onChange={e => {
                        const newItems = [...items]; 
                        newItems[idx].price = e.target.value; 
                        setItems(newItems);
                      }} 
                      required 
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea 
                      placeholder="Enter item description"
                      value={item.description} 
                      onChange={e => {
                        const newItems = [...items]; 
                        newItems[idx].description = e.target.value; 
                        setItems(newItems);
                      }} 
                      required 
                      rows={3}
                    />
                  </div>
                </Card>
              ))}

              <Button type="button" variant="outline" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" /> Add Another Item
              </Button>
            </div>

            {/* Attributes Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Attributes (Optional)</h3>
                {isFetchingAttrs ? (
                  <span className="text-sm text-gray-500 animate-pulse">Loading attributes...</span>
                ) : currentCategoryAttrs.length > 0 ? (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    {currentCategoryAttrs.length} attribute{currentCategoryAttrs.length !== 1 ? 's' : ''} available
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">No attributes defined for this category</span>
                )}
              </div>
              
              {/* Attributes Info */}
              {currentCategoryAttrs.length > 0 && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertTitle className="text-green-800 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Category Attributes Found
                  </AlertTitle>
                  <AlertDescription>
                    <div className="mt-2 space-y-2">
                      {currentCategoryAttrs.map(attr => (
                        <div key={attr.id} className="flex items-center justify-between p-2 bg-green-100 rounded">
                          <div>
                            <span className="font-medium">{attr.name}</span>
                            <span className="text-xs text-gray-600 ml-2">({attr.data_type})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {attr.is_required && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                            <code className="text-xs bg-green-200 px-2 py-1 rounded font-mono">
                              ID: {attr.id?.substring(0, 8)}...
                            </code>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Attribute Inputs */}
              <div className="space-y-4">
                {attributes.map((attr, idx) => (
                  <Card key={idx} className="border p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Attribute #{idx + 1}</h4>
                      {attributes.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeAttribute(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Attribute ID</Label>
                        <Select 
                          value={attr.attribute_id} 
                          onValueChange={(value) => {
                            const newAttrs = [...attributes];
                            newAttrs[idx].attribute_id = value;
                            setAttributes(newAttrs);
                          }}
                          disabled={isFetchingAttrs}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={
                              isFetchingAttrs ? "Loading..." : 
                              currentCategoryAttrs.length > 0 ? "Select attribute" : "Enter attribute ID"
                            } />
                          </SelectTrigger>
                          <SelectContent>
                            {currentCategoryAttrs.map(catAttr => (
                              <SelectItem key={catAttr.id} value={catAttr.id || ""}>
                                <div className="flex flex-col">
                                  <span>{catAttr.name}</span>
                                  <span className="text-xs text-gray-500">
                                    ID: {catAttr.id?.substring(0, 12)}...
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {attr.attribute_id && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-mono text-xs break-all">
                              Using: {attr.attribute_id}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Value</Label>
                        <Input 
                          placeholder="Enter attribute value"
                          value={attr.value} 
                          onChange={e => {
                            const newAttrs = [...attributes];
                            newAttrs[idx].value = e.target.value;
                            setAttributes(newAttrs);
                          }} 
                        />
                      </div>
                    </div>
                  </Card>
                ))}

                <Button type="button" variant="outline" onClick={addAttribute}>
                  <Plus className="h-4 w-4 mr-2" /> Add Attribute
                </Button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information *</h3>
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertDescription className="text-sm">
                  <strong>Note:</strong> Use real email addresses and phone numbers for transaction notifications.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Seller Email *</Label>
                  <Input 
                    type="email"
                    placeholder="seller@example.com"
                    value={sellerEmail} 
                    onChange={e => setSellerEmail(e.target.value)} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Seller Phone *</Label>
                  <Input 
                    placeholder="+251911111111"
                    value={sellerPhone} 
                    onChange={e => setSellerPhone(e.target.value)} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Buyer Email *</Label>
                  <Input 
                    type="email"
                    placeholder="buyer@example.com"
                    value={buyerEmail} 
                    onChange={e => setBuyerEmail(e.target.value)} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Buyer Phone *</Label>
                  <Input 
                    placeholder="+251922222222"
                    value={buyerPhone} 
                    onChange={e => setBuyerPhone(e.target.value)} 
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payload Preview */}
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">Payload Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-auto max-h-60 font-mono">
                  {JSON.stringify({
                    title: title.trim(),
                    role,
                    currency,
                    inspection_period: `${inspection} days`,
                    item_catagory_id: items[0]?.categoryId || "Not selected",
                    item_name: items[0]?.name?.trim() || "Not entered",
                    item_description: items[0]?.description?.trim() || "Not entered",
                    price: items[0]?.price || "0.00",
                    shipping_method: shippingMethod,
                    seller_email: sellerEmail.trim() || "Not entered",
                    seller_phone: sellerPhone.trim() || "Not entered",
                    buyer_email: buyerEmail.trim() || "Not entered",
                    buyer_phone: buyerPhone.trim() || "Not entered",
                    attributes: attributes
                      .filter(a => a.attribute_id && a.value)
                      .map(a => ({
                        attribute_id: a.attribute_id,
                        value: a.value
                      }))
                  }, null, 2)}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This is exactly what will be sent to the API
                </p>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || fetchingCategories}
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Transaction...
                </>
              ) : "Create Transaction"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionCreate;
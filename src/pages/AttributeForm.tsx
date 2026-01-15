import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { categoryApi } from "@/services/categoryApi";
import { ArrowLeft, Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const AttributeForm = () => {
  const { categoryId, attributeId } = useParams();
  const [name, setName] = useState("");
  const [dataType, setDataType] = useState("string");
  const [isRequired, setIsRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryId) {
        try {
          const category = await categoryApi.getOne(categoryId);
          setCategoryName(category.name);
        } catch (err: any) {
          toast({
            title: "Error fetching category",
            description: err.message,
            variant: "destructive"
          });
        }
      }
    };

    if (attributeId && categoryId) {
      const fetchAttribute = async () => {
        setLoading(true);
        try {
          const attribute = await categoryApi.getAttributeById(attributeId);
          setName(attribute.name);
          setDataType(attribute.data_type);
          setIsRequired(attribute.is_required);
        } catch (err: any) {
          toast({
            title: "Error fetching attribute",
            description: err.message,
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      };
      fetchAttribute();
    }

    fetchCategory();
  }, [categoryId, attributeId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Attribute name is required",
        variant: "destructive"
      });
      return;
    }

    if (!dataType) {
      toast({
        title: "Validation Error",
        description: "Please select a data type",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      if (attributeId) {
        await categoryApi.updateAttribute(attributeId, { 
          name, 
          data_type: dataType, 
          is_required: isRequired 
        });
        toast({ 
          title: "Success!", 
          description: "Attribute updated successfully" 
        });
      } else if (categoryId) {
        await categoryApi.createAttribute(categoryId, { 
          name, 
          data_type: dataType, 
          is_required: isRequired 
        });
        toast({ 
          title: "Success!", 
          description: "Attribute created successfully" 
        });
      }
      navigate(`/categories`);
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.message || "Something went wrong", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/categories");
  };

  if (loading && attributeId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attribute data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="mb-6 hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Categories
        </Button>

        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              {attributeId ? "Edit Attribute" : "Create New Attribute"}
            </CardTitle>
            <p className="text-center text-gray-500">
              {categoryName && `For category: ${categoryName}`}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Attribute Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg font-semibold">
                  Attribute Name *
                </Label>
                <Input 
                  id="name"
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g., Color, Size, Weight, Material"
                  required 
                  disabled={loading}
                  className="h-12 text-base"
                />
                <p className="text-sm text-gray-500">
                  Choose a clear name for this attribute (e.g., "Screen Size" for electronics)
                </p>
              </div>
              
              {/* Data Type */}
              <div className="space-y-2">
                <Label htmlFor="dataType" className="text-lg font-semibold">
                  Data Type *
                </Label>
                <Select value={dataType} onValueChange={setDataType} disabled={loading}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">Text (String)</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Yes/No (Boolean)</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="array">List of Values</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Select the type of data this attribute will store
                </p>
              </div>

              {/* Required Field */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="required" className="text-lg font-semibold">
                    Required Field
                  </Label>
                  <p className="text-sm text-gray-500">
                    Products must have this attribute specified
                  </p>
                </div>
                <Switch
                  id="required"
                  checked={isRequired}
                  onCheckedChange={setIsRequired}
                  disabled={loading}
                />
              </div>

              {/* Data Type Examples */}
              <Card className="bg-accent/50 border-2">
                <CardHeader>
                  <CardTitle className="text-lg">Data Type Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Text (String):</span>
                      </div>
                      <p className="text-gray-600 ml-6">Color names, material types, brand names</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Number:</span>
                      </div>
                      <p className="text-gray-600 ml-6">Weight in kg, screen size, battery capacity</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Yes/No (Boolean):</span>
                      </div>
                      <p className="text-gray-600 ml-6">Waterproof, wireless, rechargeable</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Date:</span>
                      </div>
                      <p className="text-gray-600 ml-6">Release date, warranty expiry</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 border-2"
                >
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || !name.trim() || !dataType}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {attributeId ? "Updating..." : "Creating..."}
                    </span>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {attributeId ? "Update Attribute" : "Create Attribute"}
                    </>
                  )}
                </Button>
              </div>

              {/* Form Note */}
              <div className="text-center text-sm text-gray-500 pt-4 border-t">
                <p>Fields marked with * are required</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttributeForm;
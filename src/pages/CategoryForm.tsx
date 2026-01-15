import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { categoryApi, type Category } from "@/services/categoryApi";
import { ArrowLeft } from "lucide-react";

const CategoryForm = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        setLoading(true);
        try {
          const category: Category = await categoryApi.getOne(id);
          setName(category.name);
          // Extract the string value from the description object
          setDescription(category.description?.Valid ? category.description.String : "");
        } catch (err: any) {
          toast({ 
            title: "Error fetching category", 
            description: err.message || "Failed to load category", 
            variant: "destructive" 
          });
        } finally {
          setLoading(false);
        }
      };
      fetchCategory();
    }
  }, [id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Validation Error",
        description: "Description is required",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (id) {
        await categoryApi.update(id, { name, description });
        toast({ 
          title: "Success!", 
          description: "Category updated successfully" 
        });
      } else {
        await categoryApi.create({ name, description });
        toast({ 
          title: "Success!", 
          description: "Category created successfully" 
        });
      }
      navigate("/categories");
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

  if (loading && id) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category data...</p>
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
              {id ? "Edit Category" : "Create New Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg font-semibold">
                  Category Name *
                </Label>
                <Input 
                  id="name"
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g., Electronics, Clothing, Books"
                  required 
                  disabled={loading}
                  className="h-12 text-base"
                />
                <p className="text-sm text-gray-500">
                  Choose a clear and descriptive name for your category
                </p>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-semibold">
                  Description *
                </Label>
                <Textarea 
                  id="description"
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Describe what this category includes, what products belong here, and any important details..."
                  required 
                  disabled={loading}
                  rows={6}
                  className="text-base resize-none"
                />
                <p className="text-sm text-gray-500">
                  Provide a detailed description to help users understand this category
                </p>
              </div>

              {/* Status/Info Section */}
              {id && (
                <Card className="bg-accent/50 border-2">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Category ID</p>
                        <p className="font-mono text-sm">{id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Warning for Existing Category */}
              {id && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <span className="font-bold">⚠️ Important:</span> Editing this category will affect all products associated with it. 
                    Make sure the changes are accurate.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 border-2"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || !name.trim() || !description.trim()}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {id ? "Updating..." : "Creating..."}
                    </span>
                  ) : id ? "Update Category" : "Create Category"}
                </Button>
              </div>

              {/* Form Note */}
              <div className="text-center text-sm text-gray-500 pt-4 border-t">
                <p>Fields marked with * are required</p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info for New Categories */}
        {!id && (
          <Card className="mt-6 border-2">
            <CardHeader>
              <CardTitle className="text-lg">Tips for Creating Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Use clear, descriptive names that users will understand
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Keep categories broad enough to include related products
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Add detailed descriptions to help with product categorization
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Consider future expansion when naming categories
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CategoryForm;
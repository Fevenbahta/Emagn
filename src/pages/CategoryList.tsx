import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  categoryApi, 
  type Category,
  type Attribute 
} from "@/services/categoryApi";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Filter, LayoutGrid, List, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [showAttributeDialog, setShowAttributeDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (err: any) {
      toast({ 
        title: "Error fetching categories", 
        description: err.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAttributes = async (categoryId: string) => {
    try {
      const data = await categoryApi.getAttributes(categoryId);
      setAttributes(data);
    } catch (err: any) {
      toast({ 
        title: "Error fetching attributes", 
        description: err.message, 
        variant: "destructive" 
      });
    }
  };

  const handleViewAttributes = async (category: Category) => {
    setSelectedCategory(category);
    await fetchAttributes(category.id);
    setShowAttributeDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await categoryApi.delete(id);
      toast({ 
        title: "Success!", 
        description: "Category deleted successfully" 
      });
      fetchCategories();
    } catch (err: any) {
      toast({ 
        title: "Delete failed", 
        description: err.message, 
        variant: "destructive" 
      });
    }
  };

  const handleDeleteAttribute = async (attributeId: string) => {
    if (!confirm("Are you sure you want to delete this attribute?")) return;
    try {
      await categoryApi.deleteAttribute(attributeId);
      toast({ 
        title: "Success!", 
        description: "Attribute deleted successfully" 
      });
      if (selectedCategory) {
        await fetchAttributes(selectedCategory.id);
      }
    } catch (err: any) {
      toast({ 
        title: "Delete failed", 
        description: err.message, 
        variant: "destructive" 
      });
    }
  };

  // Helper to safely get description string
  const getDescriptionText = (desc: any): string => {
    if (typeof desc === 'string') return desc;
    if (desc?.Valid) return desc.String || "No description";
    return desc?.String || "No description";
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getDescriptionText(cat.description).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count categories with attributes
  const categoriesWithAttributes = categories.reduce(async (countPromise, cat) => {
    const count = await countPromise;
    try {
      const attrs = await categoryApi.getAttributes(cat.id);
      return attrs.length > 0 ? count + 1 : count;
    } catch {
      return count;
    }
  }, Promise.resolve(0));

  const [withAttributesCount, setWithAttributesCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const count = await categoriesWithAttributes;
      setWithAttributesCount(count);
    };
    fetchCount();
  }, [categories]);

  useEffect(() => { 
    fetchCategories(); 
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Categories</h1>
            <p className="text-gray-500 mt-2">Manage your product categories</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate("/categories/attributes")}
              variant="outline"
              className="border-primary/20 hover:bg-primary/10"
            >
              <Tag className="h-4 w-4 mr-2" /> Manage Attributes
            </Button>
            <Button 
              onClick={() => navigate("/categories/create")}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" /> New Category
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-6 border-2">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{categories.length}</div>
              <div className="text-gray-500">Total Categories</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{filteredCategories.length}</div>
              <div className="text-gray-500">Filtered Results</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{withAttributesCount}</div>
              <div className="text-gray-500">With Attributes</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">0</div>
              <div className="text-gray-500">Active Products</div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid/List */}
        {filteredCategories.length === 0 ? (
          <Card className="border-2">
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg mb-4">No categories found</p>
              {searchQuery && (
                <p className="text-gray-400 mb-4">Try a different search term</p>
              )}
              <Button 
                onClick={() => navigate("/categories/create")}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" /> Create Your First Category
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map(cat => (
              <Card key={cat.id} className="border-2 hover:border-primary transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold">
                      {cat.name}
                    </CardTitle>
                    <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                      ID: {cat.id.substring(0, 8)}...
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Description</p>
                      <p className="text-gray-700 bg-accent/50 p-3 rounded-md min-h-[60px]">
                        {getDescriptionText(cat.description)}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
                      <div>
                        <span className="font-medium">Created:</span>{" "}
                        {cat.created_at?.Valid ? 
                          new Date(cat.created_at.Time).toLocaleDateString() : 
                          "Unknown date"}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewAttributes(cat)}
                        className="text-xs"
                      >
                        <Tag className="h-3 w-3 mr-1" /> View Attributes
                      </Button>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/categories/edit/${cat.id}`)}
                        className="flex-1 border-primary/20 hover:bg-primary/10 hover:text-primary"
                        size="sm"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleDelete(cat.id)}
                        className="flex-1"
                        size="sm"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-2">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Name</th>
                      <th className="text-left p-4 font-semibold">Description</th>
                      <th className="text-left p-4 font-semibold">Attributes</th>
                      <th className="text-left p-4 font-semibold">Created</th>
                      <th className="text-left p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map(cat => (
                      <tr key={cat.id} className="border-b hover:bg-accent/50">
                        <td className="p-4">
                          <div className="font-semibold">{cat.name}</div>
                          <div className="text-xs text-gray-500">ID: {cat.id.substring(0, 8)}...</div>
                        </td>
                        <td className="p-4">
                          <div className="line-clamp-2">{getDescriptionText(cat.description)}</div>
                        </td>
                        <td className="p-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewAttributes(cat)}
                          >
                            <Tag className="h-3.5 w-3.5 mr-1" /> View
                          </Button>
                        </td>
                        <td className="p-4">
                          {cat.created_at?.Valid ? 
                            new Date(cat.created_at.Time).toLocaleDateString() : 
                            "Unknown"}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/categories/edit/${cat.id}`)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDelete(cat.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attributes Dialog */}
        <Dialog open={showAttributeDialog} onOpenChange={setShowAttributeDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Attributes for {selectedCategory?.name}
              </DialogTitle>
              <DialogDescription>
                Manage attributes for this category. These will be used when adding products.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {attributes.length === 0 ? (
                <div className="text-center p-6 border-2 border-dashed rounded-lg">
                  <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No attributes defined for this category</p>
                  <p className="text-sm text-gray-400 mt-2">Add attributes to define product specifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {attributes.map(attr => (
                    <Card key={attr.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{attr.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {attr.data_type}
                              </Badge>
                              {attr.is_required && (
                                <Badge variant="destructive" className="text-xs">
                                  Required
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              <span className="font-medium">ID:</span> {attr.id?.substring(0, 8)}...
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAttribute(attr.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              <Button 
                onClick={() => {
                  setShowAttributeDialog(false);
                  navigate(`/categories/${selectedCategory?.id}/attributes/new`);
                }}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" /> Add New Attribute
              </Button>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowAttributeDialog(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CategoryList;
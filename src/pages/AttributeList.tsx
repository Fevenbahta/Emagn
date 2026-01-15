import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  categoryApi, 
  type AttributeWithCategory,
  type Category 
} from "@/services/categoryApi";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, ArrowLeft, Tag, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AttributeList = () => {
  const [allAttributes, setAllAttributes] = useState<AttributeWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataTypeFilter, setDataTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch categories and attributes in parallel
      const [cats, attrs] = await Promise.all([
        categoryApi.getAll(),
        categoryApi.getAllAttributes()
      ]);
      
      setCategories(cats);
      setAllAttributes(attrs);
    } catch (err: any) {
      toast({ 
        title: "Error fetching data", 
        description: err.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (attributeId: string) => {
    if (!confirm("Are you sure you want to delete this attribute?")) return;
    try {
      await categoryApi.deleteAttribute(attributeId);
      toast({ 
        title: "Success!", 
        description: "Attribute deleted successfully" 
      });
      fetchData(); // Refresh the list
    } catch (err: any) {
      toast({ 
        title: "Delete failed", 
        description: err.message, 
        variant: "destructive" 
      });
    }
  };

  // Filter attributes
  const filteredAttributes = allAttributes.filter(attr => {
    const matchesSearch = 
      attr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (attr.category_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
    const matchesDataType = 
      dataTypeFilter === "all" || attr.data_type === dataTypeFilter;
    
    const matchesCategory = 
      categoryFilter === "all" || attr.category_id === categoryFilter;
    
    return matchesSearch && matchesDataType && matchesCategory;
  });

  const uniqueDataTypes = Array.from(new Set(allAttributes.map(attr => attr.data_type)));

  useEffect(() => { 
    fetchData(); 
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attributes...</p>
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
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/categories")}
                className="hover:bg-accent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold">Attributes</h1>
            </div>
            <p className="text-gray-500 ml-12">Manage attributes across all categories</p>
          </div>
          
          <Button 
            onClick={() => navigate("/categories")}
            variant="outline"
            className="border-primary/20 hover:bg-primary/10"
          >
            <Tag className="h-4 w-4 mr-2" /> Back to Categories
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-6 border-2">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search attributes or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <Select value={dataTypeFilter} onValueChange={setDataTypeFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Data Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Data Types</SelectItem>
                    {uniqueDataTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
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
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{allAttributes.length}</div>
              <div className="text-gray-500">Total Attributes</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{filteredAttributes.length}</div>
              <div className="text-gray-500">Filtered Results</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {allAttributes.filter(a => a.is_required).length}
              </div>
              <div className="text-gray-500">Required Attributes</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {categories.length}
              </div>
              <div className="text-gray-500">Categories</div>
            </CardContent>
          </Card>
        </div>

        {/* Attributes Table */}
        {filteredAttributes.length === 0 ? (
          <Card className="border-2">
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Tag className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-gray-500 text-lg mb-4">No attributes found</p>
              {searchQuery && (
                <p className="text-gray-400 mb-4">Try a different search term</p>
              )}
              <Button 
                onClick={() => navigate("/categories")}
                className="bg-primary hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Categories
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Attribute Name</th>
                      <th className="text-left p-4 font-semibold">Category</th>
                      <th className="text-left p-4 font-semibold">Data Type</th>
                      <th className="text-left p-4 font-semibold">Required</th>
                      <th className="text-left p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttributes.map((attr) => (
                      <tr key={attr.id} className="border-b hover:bg-accent/50">
                        <td className="p-4">
                          <div className="font-semibold">{attr.name}</div>
                          <div className="text-xs text-gray-500">
                            ID: {attr.id.substring(0, 8)}...
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{attr.category_name}</div>
                          <div className="text-xs text-gray-500">
                            Category ID: {attr.category_id.substring(0, 8)}...
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="capitalize">
                            {attr.data_type}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {attr.is_required ? (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Optional
                            </Badge>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/categories/${attr.category_id}/attributes/edit/${attr.id}`)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDelete(attr.id)}
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
      </div>
    </div>
  );
};

export default AttributeList;
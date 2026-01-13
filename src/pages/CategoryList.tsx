import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryApi } from "@/services/categoryApi";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (err: any) {
      toast({ title: "Error fetching categories", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await categoryApi.delete(id);
      toast({ title: "Category deleted" });
      fetchCategories();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
         <button
    onClick={() => window.history.back()}
    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 transition"
  >
    <span className="text-base">←</span>
    Back
  </button>   <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => navigate("/categories/create")}>
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(cat => (
          <Card key={cat.id}>
            <CardHeader>
              <CardTitle>{cat.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p>{cat.description}</p>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" onClick={() => navigate(`/categories/edit/${cat.id}`)}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(cat.id)}>
                  <Trash className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;

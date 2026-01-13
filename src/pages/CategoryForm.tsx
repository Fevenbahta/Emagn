import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { categoryApi } from "@/services/categoryApi";
import { Category } from "@/types/category";

const CategoryForm = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      (async () => {
        const categories: Category[] = await categoryApi.getAll();
        const cat = categories.find(c => c.id === id);
        if (cat) {
          setName(cat.name);
          setDescription(cat.description);
        }
      })();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await categoryApi.update(id, { name, description });
        toast({ title: "Category updated!" });
      } else {
        await categoryApi.create({ name, description });
        toast({ title: "Category created!" });
      }
      navigate("/categories");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="p-6">
      <Card className="max-w-lg mx-auto shadow-xl">
        <CardHeader>
          <CardTitle>{id ? "Edit Category" : "Create Category"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">
              {id ? "Update Category" : "Create Category"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryForm;

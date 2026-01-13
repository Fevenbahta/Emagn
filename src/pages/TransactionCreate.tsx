import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { transactionApi } from "@/services/transactionApi";
import axios from "axios";
import { store } from "@/store";
import { Category } from "@/types/category";

interface TransactionItem {
  id: number;
  category: string;
  price: string;
  description: string;
}

const TransactionCreate = () => {
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  const [currency, setCurrency] = useState("ETB");
  const [inspection, setInspection] = useState(7);
  const [items, setItems] = useState<TransactionItem[]>([{ id: 1, category: "", price: "", description: "" }]);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const token = store.getState().auth.token;

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get<Category[]>("https://emagne.onrender.com/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch (err) {
      toast({ title: "Error", description: "Could not fetch categories", variant: "destructive" });
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const addItem = () => setItems([...items, { id: items.length + 1, category: "", price: "", description: "" }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const firstItemCategory = categories.find(c => c.name === items[0].category);

      const payload = {
        title,
        role,
        currency,
        inspection_period: `${inspection} days`,
        item_catagory_id: firstItemCategory?.id || "",
        item_name: items[0].description,
        item_description: items[0].description,
        price: items[0].price,
        shipping_method: "Courier",
        seller_email: "seller@example.com",
        seller_phone: "+251911111111",
        buyer_email: "buyer@example.com",
        buyer_phone: "+251922222222",
        attributes: items.map(item => ({ attribute_id: "", value: item.description }))
      };

      await transactionApi.createTransaction(payload);

      toast({ title: "Transaction created!", description: "Your escrow transaction has been initialized." });
      navigate("/transactions");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Could not create transaction", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <Card className="max-w-4xl mx-auto shadow-xl border-2">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Start a Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-2">
              <Label>Transaction Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label>My Role</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Buyer">Buyer</SelectItem>
                  <SelectItem value="Seller">Seller</SelectItem>
                  <SelectItem value="Broker">Broker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {items.map((item, idx) => (
              <Card key={item.id} className="bg-accent/50 border-2 p-4 space-y-2">
                <h4 className="font-semibold">Item #{idx + 1}</h4>

                <Label>Category</Label>
                <Select value={item.category} onValueChange={value => {
                  const newItems = [...items];
                  newItems[idx].category = value;
                  setItems(newItems);
                }} required>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Label>Price</Label>
                <Input type="number" placeholder="Price" value={item.price} onChange={e => {
                  const newItems = [...items]; newItems[idx].price = e.target.value; setItems(newItems);
                }} required />

                <Label>Description</Label>
                <Textarea placeholder="Description" value={item.description} onChange={e => {
                  const newItems = [...items]; newItems[idx].description = e.target.value; setItems(newItems);
                }} required />
              </Card>
            ))}

            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" /> Add Another Item
            </Button>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Transaction"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionCreate;

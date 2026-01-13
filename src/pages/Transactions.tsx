import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { transactionApi } from "@/services/transactionApi";
import { useToast } from "@/hooks/use-toast";

const Transactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await transactionApi.getAll({ limit: 50, offset: 0 });
      setTransactions(data);
    } catch (err: any) {
      toast({ title: "Error fetching transactions", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-500";
      case "action-required": return "bg-yellow-500";
      case "closed": return "bg-green-600";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-background to-secondary">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>
      <Card className="shadow-xl border-2">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? transactions.map(txn => (
                <TableRow key={txn.id} className="hover:bg-muted/30 transition">
                  <TableCell>{txn.id}</TableCell>
                  <TableCell>{txn.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{txn.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(txn.status)} text-white`}>{txn.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => alert(JSON.stringify(txn, null, 2))}>
                      <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;

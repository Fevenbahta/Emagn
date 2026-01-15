import axios from "axios";
import { store } from "@/store";
import { 
  Transaction, 
  TransactionAttribute, 
  CreateTransactionPayload,
  UpdateTransactionPayload 
} from "@/types/transaction";

const API_URL = "https://emagne.onrender.com/api/transactions";

export const transactionApi = {
  // Create transaction (POST /api/transactions)
 createTransaction: async (payload: any): Promise<Transaction> => {
    const token = store.getState().auth.token;
    console.log("Creating transaction with payload:", payload);
    console.log("Token:", token ? "Present" : "Missing");
    
    try {
      const res = await axios.post<Transaction>(API_URL, payload, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json" 
        },
      });
      console.log("Transaction created successfully:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("Transaction creation failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get single transaction (GET /api/transactions/:id)
  getById: async (id: string): Promise<Transaction> => {
    const token = store.getState().auth.token;
    const res = await axios.get<Transaction>(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // Get all transactions (GET /api/transactions)
  getAll: async (params?: { limit?: number; offset?: number }): Promise<Transaction[]> => {
    const token = store.getState().auth.token;
    const res = await axios.get<Transaction[]>(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return res.data;
  },

  // Get transactions by category (GET /api/transactions/categories/:categoryId)
  getByCategory: async (categoryId: string, params?: { limit?: number; offset?: number }): Promise<Transaction[]> => {
    const token = store.getState().auth.token;
    const res = await axios.get<Transaction[]>(`${API_URL}/categories/${categoryId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return res.data;
  },

  // Update transaction (PUT /api/transactions/:id)
  update: async (id: string, payload: UpdateTransactionPayload): Promise<Transaction> => {
    const token = store.getState().auth.token;
    const res = await axios.put<Transaction>(`${API_URL}/${id}`, payload, {
      headers: { 
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json" 
      },
    });
    return res.data;
  },

  // Update transaction status (PATCH /api/transactions/:id/status)
  updateStatus: async (id: string, status: string): Promise<Transaction> => {
    const token = store.getState().auth.token;
    const res = await axios.patch<Transaction>(
      `${API_URL}/${id}/status`, 
      { status }, 
      {
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json" 
        },
      }
    );
    return res.data;
  },

  // Delete transaction (DELETE /api/transactions/:id)
  delete: async (id: string): Promise<void> => {
    const token = store.getState().auth.token;
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Get all attributes for a transaction (GET /api/transactions/:id/attributes)
  getAttributes: async (id: string): Promise<TransactionAttribute[]> => {
    const token = store.getState().auth.token;
    const res = await axios.get<TransactionAttribute[]>(`${API_URL}/${id}/attributes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // Add attribute (POST /api/transactions/:id/attributes)
  addAttribute: async (id: string, attribute: TransactionAttribute): Promise<TransactionAttribute> => {
    const token = store.getState().auth.token;
    const res = await axios.post<TransactionAttribute>(
      `${API_URL}/${id}/attributes`, 
      attribute, 
      {
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json" 
        },
      }
    );
    return res.data;
  },

  // Get single attribute (GET /api/transactions/:id/attributes/:attributeId)
  getAttribute: async (id: string, attributeId: string): Promise<TransactionAttribute> => {
    const token = store.getState().auth.token;
    const res = await axios.get<TransactionAttribute>(`${API_URL}/${id}/attributes/${attributeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // Update attribute (PUT /api/transactions/:id/attributes/:attributeId)
  updateAttribute: async (id: string, attributeId: string, payload: Partial<TransactionAttribute>): Promise<TransactionAttribute> => {
    const token = store.getState().auth.token;
    const res = await axios.put<TransactionAttribute>(
      `${API_URL}/${id}/attributes/${attributeId}`, 
      payload, 
      {
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json" 
        },
      }
    );
    return res.data;
  },

  // Delete attribute (DELETE /api/transactions/:id/attributes/:attributeId)
  deleteAttribute: async (id: string, attributeId: string): Promise<void> => {
    const token = store.getState().auth.token;
    await axios.delete(`${API_URL}/${id}/attributes/${attributeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Delete all attributes (DELETE /api/transactions/:id/attributes)
  deleteAllAttributes: async (id: string): Promise<void> => {
    const token = store.getState().auth.token;
    await axios.delete(`${API_URL}/${id}/attributes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
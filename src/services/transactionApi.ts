import axios from "axios";
import { store } from "@/store";
import { Transaction } from "@/types/transaction";

const API_URL = "https://emagne.onrender.com/api/transactions";

export const transactionApi = {
  // Fetch all transactions
  getAll: async (params?: { limit?: number; offset?: number }): Promise<Transaction[]> => {
    const token = store.getState().auth.token;
    const res = await axios.get<Transaction[]>(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return res.data;
  },

  // Fetch a single transaction
  getById: async (id: string): Promise<Transaction> => {
    const token = store.getState().auth.token;
    const res = await axios.get<Transaction>(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // Create a transaction
  createTransaction: async (payload: any): Promise<Transaction> => {
    const token = store.getState().auth.token;
    const res = await axios.post<Transaction>(API_URL, payload, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return res.data;
  },

  // Update transaction status
  updateStatus: async (id: string, status: string): Promise<Transaction> => {
    const token = store.getState().auth.token;
    const res = await axios.patch<Transaction>(`${API_URL}/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return res.data;
  },

  // Manage attributes
  addAttribute: async (id: string, attribute: { attribute_id: string; value: string }): Promise<Transaction> => {
    const token = store.getState().auth.token;
    const res = await axios.post<Transaction>(`${API_URL}/${id}/attributes`, attribute, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return res.data;
  },

  deleteAttribute: async (id: string, attribute_id: string): Promise<Transaction> => {
    const token = store.getState().auth.token;
    const res = await axios.delete<Transaction>(`${API_URL}/${id}/attributes/${attribute_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
};

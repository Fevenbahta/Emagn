import axios from "axios";
import { store } from "../store";
import { Category } from "@/types/category";

const API_URL = "https://emagne.onrender.com/api/categories";

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const token = store.getState().auth.token;
    const res = await axios.get<Category[]>(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // now TS knows this is Category[]
  },

  create: async (payload: { name: string; description: string }): Promise<Category> => {
    const token = store.getState().auth.token;
    const res = await axios.post<Category>(API_URL, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  update: async (id: string, payload: { name: string; description: string }): Promise<Category> => {
    const token = store.getState().auth.token;
    const res = await axios.put<Category>(`${API_URL}/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    const token = store.getState().auth.token;
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

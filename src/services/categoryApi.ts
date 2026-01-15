import axios from "axios";
import { store } from "../store";

const API_URL = "https://emagne.onrender.com/api/categories";

// Define proper TypeScript interfaces based on your API response
export interface ApiDateTime {
  Time: string;
  Valid: boolean;
}

export interface ApiStringField {
  String: string;
  Valid: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: ApiStringField;
  created_at: ApiDateTime;
}

// Attribute types based on your curl examples
export interface Attribute {
  id: string;
  name: string;
  data_type: string;
  is_required: boolean;
  category_id: string;
  created_at: ApiDateTime;
  updated_at: ApiDateTime;
}

// Attribute with category name for UI purposes
export interface AttributeWithCategory extends Attribute {
  category_name?: string;
}

// Payload types for API calls
export interface CreateCategoryPayload {
  name: string;
  description: string;
}

export interface UpdateCategoryPayload {
  name: string;
  description: string;
}

export interface CreateAttributePayload {
  name: string;
  data_type: string;
  is_required: boolean;
}

export interface UpdateAttributePayload {
  name?: string;
  data_type?: string;
  is_required?: boolean;
}

export const categoryApi = {
  // Category CRUD operations
  getAll: async (): Promise<Category[]> => {
    const token = store.getState().auth.token;
    const res = await axios.get<Category[]>(API_URL, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return res.data;
  },

  getOne: async (id: string): Promise<Category> => {
    const token = store.getState().auth.token;
    const res = await axios.get<Category>(`${API_URL}/${id}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return res.data;
  },

  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const token = store.getState().auth.token;
    const res = await axios.post<Category>(API_URL, payload, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return res.data;
  },

  update: async (id: string, payload: UpdateCategoryPayload): Promise<Category> => {
    const token = store.getState().auth.token;
    const res = await axios.put<Category>(`${API_URL}/${id}`, payload, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    const token = store.getState().auth.token;
    await axios.delete(`${API_URL}/${id}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
  },

  // Attribute operations - Based on your curl examples
  getAttributes: async (categoryId: string): Promise<Attribute[]> => {
    const token = store.getState().auth.token;
    const res = await axios.get<Attribute[]>(`${API_URL}/${categoryId}/attributes`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return res.data;
  },

  getAttributeByName: async (categoryId: string, attributeName: string): Promise<Attribute> => {
    const token = store.getState().auth.token;
    const res = await axios.get<Attribute>(`${API_URL}/${categoryId}/attributes/${attributeName}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return res.data;
  },

  // Based on your curl example, it seems attributes are fetched by attribute name, not ID
  // But we'll keep both for flexibility
  getAttributeById: async (attributeId: string): Promise<Attribute> => {
    const token = store.getState().auth.token;
    const res = await axios.get<Attribute>(`${API_URL}/attributes/${attributeId}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return res.data;
  },

  createAttribute: async (categoryId: string, payload: CreateAttributePayload): Promise<Attribute> => {
    const token = store.getState().auth.token;
    const res = await axios.post<Attribute>(`${API_URL}/${categoryId}/attributes`, payload, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return res.data;
  },

  updateAttribute: async (attributeId: string, payload: UpdateAttributePayload): Promise<Attribute> => {
    const token = store.getState().auth.token;
    const res = await axios.put<Attribute>(`${API_URL}/attributes/${attributeId}`, payload, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    return res.data;
  },

  deleteAttribute: async (attributeId: string): Promise<void> => {
    const token = store.getState().auth.token;
    await axios.delete(`${API_URL}/attributes/${attributeId}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
  },

  // Get all attributes across all categories
  getAllAttributes: async (): Promise<AttributeWithCategory[]> => {
    const token = store.getState().auth.token;
    
    try {
      // First get all categories
      const categories = await categoryApi.getAll();
      const allAttributes: AttributeWithCategory[] = [];
      
      // Then get attributes for each category
      for (const category of categories) {
        try {
          const attributes = await categoryApi.getAttributes(category.id);
          // Add category name to each attribute
          const attributesWithCategory = attributes.map(attr => ({
            ...attr,
            category_name: category.name
          }));
          allAttributes.push(...attributesWithCategory);
        } catch (err) {
          console.error(`Failed to fetch attributes for category ${category.id}:`, err);
          // Continue with other categories
        }
      }
      
      return allAttributes;
    } catch (err: any) {
      throw new Error(`Failed to fetch all attributes: ${err.message}`);
    }
  },

  // Utility function to extract string from ApiStringField
  extractString: (field: ApiStringField): string => {
    return field.Valid ? field.String : '';
  },

  // Utility function to format date from ApiDateTime
  formatDate: (dateField: ApiDateTime): string => {
    if (!dateField.Valid) return '';
    try {
      const date = new Date(dateField.Time);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  },

  // Helper to check if description is empty
  isDescriptionEmpty: (field: ApiStringField): boolean => {
    return !field.Valid || field.String.trim() === '';
  }
};
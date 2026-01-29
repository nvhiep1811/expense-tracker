import api from "./client";
import type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
} from "@/types";

export const accountsAPI = {
  getAll: async (): Promise<Account[]> => {
    const response = await api.get("/accounts");
    return response.data;
  },

  getOne: async (id: string): Promise<Account> => {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  },

  create: async (data: CreateAccountRequest): Promise<Account> => {
    const response = await api.post("/accounts", data);
    return response.data;
  },

  update: async (id: string, data: UpdateAccountRequest): Promise<Account> => {
    const response = await api.put(`/accounts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<Account> => {
    const response = await api.delete(`/accounts/${id}`);
    return response.data;
  },
};

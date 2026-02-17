import api from "./client";
import type {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionFilters,
  PaginatedResponse,
} from "@/types";

export const transactionsAPI = {
  getAll: async (
    filters?: TransactionFilters,
  ): Promise<PaginatedResponse<Transaction>> => {
    const params = new URLSearchParams();
    if (filters?.type) params.append("type", filters.type);
    if (filters?.account_id) params.append("account_id", filters.account_id);
    if (filters?.category_id) params.append("category_id", filters.category_id);
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await api.get(
      `/transactions${params.toString() ? `?${params.toString()}` : ""}`,
    );
    return response.data;
  },

  getOne: async (id: string): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await api.post("/transactions", data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateTransactionRequest,
  ): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<Transaction> => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};

import api from "./client";
import type {
  Budget,
  BudgetStatus,
  CreateBudgetRequest,
  UpdateBudgetRequest,
} from "@/types";

export const budgetsAPI = {
  getAll: async (): Promise<Budget[]> => {
    const response = await api.get("/budgets");
    return response.data;
  },

  // Get budget status with spending from v_budget_status view
  getStatus: async (): Promise<BudgetStatus[]> => {
    const response = await api.get("/budgets/status");
    return response.data;
  },

  getOne: async (id: string): Promise<Budget> => {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
  },

  create: async (data: CreateBudgetRequest): Promise<Budget> => {
    const response = await api.post("/budgets", data);
    return response.data;
  },

  update: async (id: string, data: UpdateBudgetRequest): Promise<Budget> => {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<Budget> => {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  },
};

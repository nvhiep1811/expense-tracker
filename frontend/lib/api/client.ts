import axios, { type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = `${
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
}`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
  withCredentials: true, // Automatically send httpOnly cookies
});

// ─── Token refresh state ────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
}> = [];

function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      resolve(api.request(config)); // retry original request — cookie was updated server-side
    }
  });
  failedQueue = [];
}

function clearSession() {
  if (typeof document !== "undefined") {
    document.cookie =
      "auth_session=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax";
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_data");
    window.location.href = "/login";
  }
}
// ────────────────────────────────────────────────────────────────────────────

// Response interceptor: auto-refresh access token on 401, then retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const is401 = error.response?.status === 401;
    // Don't attempt refresh if this request IS the refresh call, or already retried
    const isRefreshCall = originalConfig.url?.includes("/auth/refresh");
    const isLoginCall = originalConfig.url?.includes("/auth/login");

    if (is401 && !originalConfig._retry && !isRefreshCall && !isLoginCall) {
      if (isRefreshing) {
        // Queue concurrent requests while a refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalConfig });
        });
      }

      originalConfig._retry = true;
      isRefreshing = true;

      try {
        // Attempt silent token refresh (uses httpOnly refresh_token cookie)
        await api.post("/auth/refresh");
        processQueue(null);
        return api.request(originalConfig); // retry original request
      } catch (refreshError) {
        processQueue(refreshError);
        clearSession();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Extract error message from response
    const errorMessage =
      error.response?.data?.message || error.message || "Đã xảy ra lỗi";

    const apiError = new Error(errorMessage) as Error & {
      response?: typeof error.response;
      status?: number;
    };
    apiError.response = error.response;
    apiError.status = error.response?.status;

    return Promise.reject(apiError);
  },
);

export default api;

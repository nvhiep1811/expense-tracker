import { QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data được coi là fresh trong 2 phút
        staleTime: 2 * 60 * 1000,
        // Cache được giữ trong 10 phút sau khi không còn observers
        gcTime: 10 * 60 * 1000,
        // Retry 2 lần khi fail
        retry: 2,
        // Refetch khi window focus lại
        refetchOnWindowFocus: true,
        // Refetch khi reconnect
        refetchOnReconnect: true,
      },
      mutations: {
        // Retry 1 lần cho mutations
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This prevents re-creating the client during React hydration
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

import { useQuery } from "@tanstack/react-query";
import { profilesAPI } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Hook để fetch profile của user hiện tại
 *
 * Note: Profile rất ít thay đổi nên:
 * - staleTime cao (10 phút)
 * - Không refetch khi window focus (tránh spam API)
 * - Chỉ refetch khi user chủ động update profile
 */
export function useProfileQuery() {
  return useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: profilesAPI.getMyProfile,
    staleTime: 10 * 60 * 1000, // 10 phút - profile rất ít thay đổi
    refetchOnWindowFocus: false, // ← Không refetch khi focus window
    refetchOnReconnect: false, // ← Không refetch khi reconnect
  });
}

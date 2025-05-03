import { create } from "zustand";
import { UserInfoCall, RefreshTokenCall } from "./ApiCalls";
// Define types for User and the store actions
interface User {
  user_id: string;
  username: string;
  email: string;
  role: string;
  stripe_account_id?: string;
  // Add other user properties here
}

interface AuthenticationStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  authenticateUser: (accessToken: string) => Promise<void>;
}

const useAuthenticationStore = create<AuthenticationStore>((set) => ({
  user: null, // Initial state for user is null
  setUser: (user: User) => set({ user }),
  logout: async () => {
    localStorage.removeItem("token");
    await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "skip-browser-warning", // Skip the ngrok browser warning
      },
      credentials: "include",
    });
    set({ user: null });
  },
  authenticateUser: async (accessToken: string) => {
    try {
      // First attempt to fetch user info
      const response = await UserInfoCall(accessToken);
      let data = await response.json();

      if (data.error) {
        console.error("Access token expired. Attempting refresh...");

        // Attempt to refresh the token
        const refreshResponse = await RefreshTokenCall();

        const refreshData = await refreshResponse.json();

        if (refreshResponse.ok && refreshData.Token) {
          // Save the new token
          const newAccessToken = refreshData.Token;
          localStorage.setItem("token", newAccessToken);

          // Retry the `/user/info` request with the new token
          const retryResponse = await UserInfoCall(newAccessToken);

          data = await retryResponse.json();

          if (retryResponse.ok) {
            set({ user: data });
          } else {
            console.error("Error during retrying user info:", data.error);
            set({ user: null });
          }
        } else {
          console.error(
            "Refresh token is expired.Please Logn In Again!.",
            refreshData.error
          );
          set({ user: null });
        }
      } else if (response.ok) {
        set({ user: data });
      }
    } catch (err) {
      console.error("Error during authentication:", err);
      set({ user: null });
    }
  },
}));

export { useAuthenticationStore };

"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  // 1. Lazy Initialization - Load user from localStorage on client only
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      return savedUser && token ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  // 2. Declare logout FIRST
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/login");
  }, [router]);

  // 3. Verify session on mount
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Optional: Verify token with backend
          // const { data } = await api.get("/auth/me");
          // setUser(data.user);
          setLoading(false);
        } catch (err) {
          logout();
        }
      } else {
        setLoading(false);
      }
    };
    verifySession();
  }, [logout]);

  const signup = async (fullName, email, password) => {
    try {
      await api.post("/auth/signup", { fullName, email, password });
      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Signup failed");
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.fullName}`);
      router.push("/");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
    }
  };

  const forgotPassword = async (email) => {
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      toast.success(data.message || "Reset link sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send reset link");
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const { data } = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      toast.success(data.message || "Password updated successfully!");
      router.push("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid or expired token");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

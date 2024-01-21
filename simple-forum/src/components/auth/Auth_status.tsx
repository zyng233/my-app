import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";

interface AuthContextProps {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (
    username: string,
    password: string,
    matricNo: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") !== null
  );
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post(
        "/login",
        { username, password },
        { withCredentials: true }
      );
      console.log("Server Response:", response.data);

      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      setIsAuthenticated(true);
      setUsername(username);
      console.log("User logged in. Username:", username);
      navigate("/discussion_threads");
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signup = async (
    username: string,
    password: string,
    matricNo: string
  ) => {
    try {
      const response = await axiosInstance.post(
        "/signup",
        {
          user: { username, password, matric_no: matricNo },
        },
        { withCredentials: true }
      );

      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      setIsAuthenticated(true);
      setUsername(username);
      console.log("User signed up. Username:", username);
      navigate("/discussion_threads");
    } catch (error: any) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

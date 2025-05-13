
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/use-toast";

// Define the user type
export interface User {
  id: string;
  username: string;
  email: string;
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("art_gallery_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("art_gallery_user");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Get users from local storage
      const users = JSON.parse(localStorage.getItem("art_gallery_users") || "[]");
      const foundUser = users.find((u: User & { password: string }) => 
        u.email === email && u.password === password
      );
      
      if (!foundUser) {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
      
      // Create user without password for storage in state
      const loggedInUser = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
      };
      
      // Save to state and localStorage
      setUser(loggedInUser);
      localStorage.setItem("art_gallery_user", JSON.stringify(loggedInUser));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.username}!`,
      });
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Get existing users
      const users = JSON.parse(localStorage.getItem("art_gallery_users") || "[]");
      
      // Check if user already exists
      if (users.some((u: User) => u.email === email)) {
        toast({
          title: "Registration failed",
          description: "Email already in use",
          variant: "destructive",
        });
        return false;
      }
      
      // Create new user
      const newUser = {
        id: crypto.randomUUID(),
        username,
        email,
        password, // In a real app, this would be hashed!
      };
      
      // Save to users array
      users.push(newUser);
      localStorage.setItem("art_gallery_users", JSON.stringify(users));
      
      // Create logged in user (without password)
      const loggedInUser = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      };
      
      // Save to state and localStorage
      setUser(loggedInUser);
      localStorage.setItem("art_gallery_user", JSON.stringify(loggedInUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${username}!`,
      });
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("art_gallery_user");
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Define a type for the user object
interface User {
  email: string;
  name: string;
  role: "TEACHER" | "STUDENT" | "ADMIN" | "PARENT" | "";
  loading?: boolean;
  id: number;
}

// Define a type for the context value
interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

// Create a context with the default type
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Define props type for the provider
interface UserProviderProps {
  children: ReactNode;
}

// UserProvider component with TypeScript types
export const UserProvider: React.FC<UserProviderProps> = ({
  children,
}: {
  children: any;
}) => {
  const [user, setUser] = useState<User>({
    email: "",
    name: "",
    role: "",
    loading: true,
    id: 0,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensures cookies are included in requests
        });

        const data = await response.json();
        console.log(data, "data in fetch user");

        setUser({
          email: data.user.email,
          name: data.user.name,
          role: data.role,
          loading: false,
          id: data.user.id,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [setUser]);

  console.log(user, "user in user provider");
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

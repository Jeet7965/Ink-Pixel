import { useState,createContext } from "react"

export const AuthContext = createContext();
import api from "../config/ApiUrl";


function safeJSONParse(str) {
    try {
        return JSON.parse(str);
    } catch {
        return null;
    }
}
const getInitialAuth = () => {
    const savedUser = safeJSONParse(sessionStorage.getItem("user"));
    const savedToken = sessionStorage.getItem("token");
    return savedUser && savedToken ? { token: savedToken, user: savedUser } : null;
};

export const AuthProvider =({children})=>{
    const [user,setUser] =useState(getInitialAuth)
    
    const login = (token,userId ) => {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("USER_ID", JSON.stringify(userId ));

        setUser({ token, userId  });
    };
    
  const logout = async() => {
      try {
        await api.post("/auth/logout")
      } catch (error) {
        console.error("Logout failed:", error);
      }
      finally {
      // clear sessionStorage
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("USER_ID");
      setUser(null);
      window.location.href = "/login";
    }
    };

   return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  ); 
}
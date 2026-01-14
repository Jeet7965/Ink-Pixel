import { useState,createContext } from "react"

export const AuthContext = createContext();



function safeJSONParse(str) {
    try {
        return JSON.parse(str);
    } catch {
        return null;
    }
}
const getInitialAuth = () => {
    const savedUser = safeJSONParse(localStorage.getItem("user"));
    const savedToken = localStorage.getItem("token");
    return savedUser && savedToken ? { token: savedToken, user: savedUser } : null;
};

export const AuthProvider =({children})=>{
    const [user,setUser] =useState(getInitialAuth)
    
    const login = (token,userId ) => {
        localStorage.setItem("token", token);
        localStorage.setItem("USER_ID", JSON.stringify(userId ));

        setUser({ token, userId  });
    };
    
  const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("USER_ID");

        setUser(null);
    };

   return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  ); 
}
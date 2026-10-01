"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthState>({ user: null, loading: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setState({ user: null, loading: false });
      return;
    }
    return onAuthStateChanged(auth, (user) => setState({ user, loading: false }));
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

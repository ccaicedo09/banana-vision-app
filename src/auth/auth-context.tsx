import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

type SignInResult = {
  error: string | null;
};

type SignUpResult = {
  error: string | null;
  needsEmailConfirmation: boolean;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signUp: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        console.log("[AUTH] getSession response:", { data, error });

        if (!isMounted) return;

        if (error) {
          setSession(null);
          setUser(null);
          setIsLoading(false);
          return;
        }

        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
        setIsLoading(false);
      } catch (err) {
        console.error("[AUTH] getSession exception:", err);
        if (!isMounted) return;
        setSession(null);
        setUser(null);
        setIsLoading(false);
      }
    };

    void loadInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      console.log("[AUTH] onAuthStateChange:", event, nextSession);

      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      session,
      user,
      isLoading,

      signIn: async (email: string, password: string) => {
        try {
          const normalizedEmail = email.trim().toLowerCase();

          console.log("[AUTH] signIn start:", { email: normalizedEmail });

          const { data, error } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });

          console.log("[AUTH] signIn response:", { data, error });

          return {
            error: error?.message ?? null,
          };
        } catch (err) {
          console.error("[AUTH] signIn exception:", err);

          return {
            error:
              err instanceof Error
                ? err.message
                : "Ocurrió un error inesperado al iniciar sesión.",
          };
        }
      },

      signUp: async (fullName: string, email: string, password: string) => {
        try {
          const normalizedEmail = email.trim().toLowerCase();
          const normalizedName = fullName.trim();

          console.log("[AUTH] signUp start:", {
            fullName: normalizedName,
            email: normalizedEmail,
          });

          const { data, error } = await supabase.auth.signUp({
            email: normalizedEmail,
            password,
            options: {
              data: {
                full_name: normalizedName,
              },
            },
          });

          console.log("[AUTH] signUp response:", { data, error });

          return {
            error: error?.message ?? null,
            needsEmailConfirmation: !data.session,
          };
        } catch (err) {
          console.error("[AUTH] signUp exception:", err);

          return {
            error:
              err instanceof Error
                ? err.message
                : "Ocurrió un error inesperado al registrar la cuenta.",
            needsEmailConfirmation: false,
          };
        }
      },

      signOut: async () => {
        try {
          console.log("[AUTH] signOut start");
          await supabase.auth.signOut();
          console.log("[AUTH] signOut done");
        } catch (err) {
          console.error("[AUTH] signOut exception:", err);
        }
      },
    }),
    [session, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return value;
}
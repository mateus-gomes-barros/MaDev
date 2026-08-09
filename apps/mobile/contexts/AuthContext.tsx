import type { Session } from "@supabase/supabase-js";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

type AuthResult = {
  error: string | null;
  needsEmailConfirmation?: boolean;
};

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
};

const AuthContext =
  createContext<AuthContextValue | null>(null);

function translateSignInError(message: string) {
  if (
    message.toLowerCase().includes(
      "email not confirmed",
    )
  ) {
    return "Confirme seu e-mail antes de entrar.";
  }

  if (
    message.toLowerCase().includes(
      "invalid login credentials",
    )
  ) {
    return "E-mail ou senha inválidos.";
  }

  return "Não foi possível entrar. Tente novamente.";
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session, setSession] =
    useState<Session | null>(null);
  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    let isMounted = true;

    void supabase.auth
      .getSession()
      .then(({ data }) => {
        if (isMounted) {
          setSession(data.session);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao recuperar sessão:",
          error,
        );

        if (isMounted) {
          setIsLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setIsLoading(false);
      },
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<AuthResult> => {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        return {
          error: translateSignInError(
            error.message,
          ),
        };
      }

      return {
        error: null,
      };
    },
    [],
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<AuthResult> => {
      const { data, error } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (error) {
        return {
          error:
            "Não foi possível criar a conta. Verifique os dados e tente novamente.",
        };
      }

      return {
        error: null,
        needsEmailConfirmation:
          !data.session,
      };
    },
    [],
  );

  const signOut =
    useCallback(async (): Promise<AuthResult> => {
      const { error } =
        await supabase.auth.signOut();

      if (error) {
        return {
          error:
            "Não foi possível sair da conta.",
        };
      }

      return {
        error: null,
      };
    }, []);

  const value = useMemo(
    () => ({
      session,
      isLoading,
      signIn,
      signUp,
      signOut,
    }),
    [
      isLoading,
      session,
      signIn,
      signOut,
      signUp,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser usado dentro de AuthProvider.",
    );
  }

  return context;
}

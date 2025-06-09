// lib/queries/useLogin.ts

import { useMutation } from "@tanstack/react-query";
import { supabase } from "./supabase";

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data?.user) {
    throw new Error("Invalid login credentials");
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    throw new Error("Failed to fetch user role");
  }

  if (profile?.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  return data.user;
}

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser(email, password),
  });
}

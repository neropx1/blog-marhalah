import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function signUpWithEmail(email: string, password: string, role: "admin" | "editor" = "editor") {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Store user role di metadata
  if (data.user) {
    await supabase.auth.updateUser({
      data: { role },
    });
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

export async function getUserRole(): Promise<"admin" | "editor" | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  return (user.user_metadata?.role as "admin" | "editor") || null;
}

// Invite code helpers
export async function generateInviteCode(role: "admin" | "editor" = "editor") {
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();

  const { error } = await supabase.from("invite_codes").insert({
    code,
    role,
    created_at: new Date(),
    used: false,
  });

  if (error) throw new Error(error.message);

  return code;
}

export async function getInviteCodes() {
  const { data, error } = await supabase.from("invite_codes").select("*").order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data || [];
}

export async function revokeInviteCode(id: string) {
  const { error } = await supabase.from("invite_codes").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

// Admin users helpers
export async function getAllUsers() {
  const { data, error } = await supabase.from("user_roles").select("*").order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data || [];
}

export async function deleteUser(userId: string) {
  // Delete dari user_roles
  const { error } = await supabase.from("user_roles").delete().eq("user_id", userId);

  if (error) throw new Error(error.message);
}

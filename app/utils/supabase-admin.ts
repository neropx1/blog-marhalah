import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    "Warning: Missing Supabase credentials for admin operations"
  );
}

// Admin client dengan service role key (server-only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export interface InviteCode {
  code: string;
  role: "admin" | "editor";
  createdAt: string;
  createdBy: string;
  usedBy?: string;
  usedAt?: string;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  role: "admin" | "editor";
  createdAt: string;
  lastLogin?: string;
}

/**
 * Get all users dari Supabase
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }

    // Map ke format kita
    return (data.users || []).map((user) => ({
      id: user.id,
      email: user.email || "",
      role: (user.user_metadata?.role as "admin" | "editor") || "editor",
      createdAt: user.created_at || "",
      lastLogin: user.last_sign_in_at || undefined,
    }));
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return [];
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error || !data.user) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email || "",
      role: (data.user.user_metadata?.role as "admin" | "editor") || "editor",
      createdAt: data.user.created_at || "",
      lastLogin: data.user.last_sign_in_at || undefined,
    };
  } catch (error) {
    console.error("Error in getUserById:", error);
    return null;
  }
}

/**
 * Delete user
 */
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Error deleting user:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return false;
  }
}

/**
 * Update user role
 */
export async function updateUserRole(
  userId: string,
  role: "admin" | "editor"
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { role },
    });

    if (error) {
      console.error("Error updating user role:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return false;
  }
}

/**
 * Generate invite code
 * Simpan di localStorage client-side untuk sekarang (bisa pindah ke DB nanti)
 */
export function generateInviteCode(role: "admin" | "editor"): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${role}-${random}-${timestamp}`;
}

/**
 * Validate invite code (hardcoded dari env untuk sekarang)
 */
export function validateInviteCode(code: string): "admin" | "editor" | null {
  const inviteCodes = process.env.VITE_INVITE_CODES?.split(",") || [];

  if (inviteCodes.length === 0) {
    console.warn("No invite codes configured");
    return null;
  }

  // First code = admin, rest = editor
  if (code === inviteCodes[0]) {
    return "admin";
  }

  if (inviteCodes.includes(code)) {
    return "editor";
  }

  return null;
}

/**
 * Get invite codes (read from env)
 * Nanti bisa dipindah ke database table
 */
export function getInviteCodes(): InviteCode[] {
  const inviteCodes = process.env.VITE_INVITE_CODES?.split(",") || [];
  const adminCodes = process.env.ADMIN_INVITE_CODES?.split(",") || [];

  return [
    ...adminCodes.map((code) => ({
      code: code.trim(),
      role: "admin" as const,
      createdAt: new Date().toISOString(),
      createdBy: "System",
      isActive: true,
    })),
    ...inviteCodes
      .slice(1)
      .map((code) => ({
        code: code.trim(),
        role: "editor" as const,
        createdAt: new Date().toISOString(),
        createdBy: "System",
        isActive: true,
      })),
  ];
}

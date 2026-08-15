import { json, type LoaderFunction, type ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData, useFetcher, Form } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getAllUsers, deleteUser, updateUserRole, generateInviteCode, getInviteCodes, type User } from "../utils/supabase-admin";

interface LoaderData {
  users: User[];
  inviteCodes: any[];
  adminEmail: string;
}

interface FetcherData {
  success?: boolean;
  message?: string;
  error?: string;
}

/**
 * Loader: Fetch semua users dan invite codes
 * TODO: Add auth check - verify user is admin
 */
export const loader: LoaderFunction = async ({ request }) => {
  // TODO: Verify user is authenticated + has admin role
  // For now, comment out auth check
  
  try {
    const users = await getAllUsers();
    const inviteCodes = getInviteCodes();
    
    return json<LoaderData>({
      users,
      inviteCodes,
      adminEmail: "admin@marhalah.local",
    });
  } catch (error) {
    console.error("Error loading admin panel:", error);
    return json<LoaderData>({
      users: [],
      inviteCodes: [],
      adminEmail: "admin@marhalah.local",
    });
  }
};

/**
 * Action: Handle user deletion & role updates
 */
export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST" && request.method !== "DELETE") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const formData = await request.formData();
  const action = formData.get("action") as string;
  const userId = formData.get("userId") as string;

  // TODO: Verify user is admin before allowing modifications

  if (action === "delete-user") {
    const success = await deleteUser(userId);
    if (!success) {
      return json({ error: "Failed to delete user" }, { status: 500 });
    }
    return json({ success: true, message: "User deleted successfully" });
  }

  if (action === "update-role") {
    const role = formData.get("role") as "admin" | "editor";
    const success = await updateUserRole(userId, role);
    if (!success) {
      return json({ error: "Failed to update role" }, { status: 500 });
    }
    return json({ success: true, message: "Role updated successfully" });
  }

  return json({ error: "Invalid action" }, { status: 400 });
};

export default function AdminPanel() {
  const { users, inviteCodes } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newInviteCode, setNewInviteCode] = useState<string>("");

  useEffect(() => {
    const data = fetcher.data as FetcherData | undefined;
    if (data?.message) {
      setNotification({
        type: data?.success ? "success" : "error",
        message: data.message || data.error || "Unknown error",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  }, [fetcher.data]);

  const handleGenerateCode = () => {
    const code = generateInviteCode("editor");
    setNewInviteCode(code);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setNotification({
      type: "success",
      message: "Kode invite disalin!",
    });
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <main className="min-h-screen gradient-wave">
      {/* Admin Panel Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="liquid-card p-8 mb-12">
          <h1 className="text-4xl font-bold text-amber-200 mb-2 font-[Bricolage_Grotesque]">
            Admin Panel
          </h1>
          <p className="text-amber-100/70 font-[Bricolage_Grotesque]">
            Kelola pengguna dan kode undangan
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg liquid-card ${
              notification.type === "success"
                ? "text-emerald-400 border-emerald-500/30"
                : "text-red-400 border-red-500/30"
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Quick Actions */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Generate Invite Code Card */}
              <div className="liquid-card p-6">
                <h3 className="text-lg font-bold text-amber-300 mb-4 font-[Bricolage_Grotesque]">
                  Buat Kode Undangan
                </h3>
                <p className="text-sm text-amber-100/70 mb-4 font-[Bricolage_Grotesque]">
                  Buat kode undangan baru untuk pengguna editor
                </p>
                <button
                  onClick={handleGenerateCode}
                  className="w-full liquid-btn"
                >
                  Generate Kode
                </button>

                {newInviteCode && (
                  <div className="mt-4 p-3 glass-input rounded border border-amber-400/30">
                    <p className="text-xs text-amber-200/50 mb-2">Kode Baru:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-amber-400 font-mono text-sm break-all">
                        {newInviteCode}
                      </code>
                      <button
                        onClick={() => handleCopyCode(newInviteCode)}
                        className="p-2 hover:bg-amber-900/30 rounded transition liquid-btn btn-sm"
                      >
                        <svg
                          className="w-4 h-4 text-amber-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="liquid-card p-6">
                <h3 className="text-lg font-bold text-amber-300 mb-4 font-[Bricolage_Grotesque]">
                  Statistik
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-100/70">Total Pengguna</span>
                    <span className="text-2xl font-bold text-amber-400">
                      {users.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-100/70">Admin</span>
                    <span className="text-lg font-semibold text-amber-400">
                      {users.filter((u) => u.role === "admin").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-100/70">Editor</span>
                    <span className="text-lg font-semibold text-amber-400">
                      {users.filter((u) => u.role === "editor").length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Users Table */}
            <div className="liquid-card overflow-hidden">
              <div className="p-6 border-b border-amber-500/20">
                <h2 className="text-2xl font-bold text-amber-300 font-[Bricolage_Grotesque]">
                  Daftar Pengguna
                </h2>
              </div>

              {users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-amber-900/20 border-b border-amber-500/20">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-amber-200">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-amber-200">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-amber-200">
                          Terdaftar
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-amber-200">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-500/15">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-amber-900/20 transition">
                          <td className="px-6 py-4 text-sm text-amber-100">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                user.role === "admin"
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              }`}
                            >
                              {user.role === "admin" ? "👑 Admin" : "✏️ Editor"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-amber-200/60">
                            {new Date(user.createdAt).toLocaleDateString("id-ID")}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <fetcher.Form method="post" className="inline">
                              <input type="hidden" name="userId" value={user.id} />
                              <div className="flex gap-2 justify-end">
                                {/* Role Change */}
                                <select
                                  name="role"
                                  defaultValue={user.role}
                                  onChange={(e) => {
                                    if (e.target.value !== user.role) {
                                      const form = e.currentTarget.form;
                                      if (form) {
                                        const roleInput = document.createElement("input");
                                        roleInput.type = "hidden";
                                        roleInput.name = "action";
                                        roleInput.value = "update-role";
                                        form.appendChild(roleInput);
                                        form.submit();
                                        form.removeChild(roleInput);
                                      }
                                    }
                                  }}
                                  className="px-2 py-1 rounded text-xs glass-input text-amber-100 border-amber-500/20"
                                >
                                  <option value="admin">Admin</option>
                                  <option value="editor">Editor</option>
                                </select>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (
                                      confirm(
                                        `Yakin hapus pengguna ${user.email}?`
                                      )
                                    ) {
                                      const form = document.createElement("form");
                                      form.method = "post";
                                      form.innerHTML = `
                                        <input type="hidden" name="action" value="delete-user">
                                        <input type="hidden" name="userId" value="${user.id}">
                                      `;
                                      document.body.appendChild(form);
                                      form.submit();
                                      document.body.removeChild(form);
                                    }
                                  }}
                                  className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition liquid-btn btn-sm"
                                >
                                  Hapus
                                </button>
                              </div>
                            </fetcher.Form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-amber-100/60">Belum ada pengguna terdaftar</p>
                </div>
              )}
            </div>

            {/* Invite Codes */}
            <div className="liquid-card overflow-hidden">
              <div className="p-6 border-b border-amber-500/20">
                <h2 className="text-2xl font-bold text-amber-300 font-[Bricolage_Grotesque]">
                  Kode Undangan
                </h2>
              </div>

              {inviteCodes.length > 0 ? (
                <div className="p-6 space-y-3">
                  {inviteCodes.map((code) => (
                    <div
                      key={code.code}
                      className="flex items-center justify-between p-4 glass-input rounded-lg border border-amber-500/20"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="font-mono text-amber-400 font-semibold">
                            {code.code}
                          </code>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              code.role === "admin"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {code.role === "admin" ? "👑 Admin" : "✏️ Editor"}
                          </span>
                          {code.usedBy && (
                            <span className="text-xs text-emerald-400">
                              ✓ Digunakan oleh {code.usedBy}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-amber-200/40">
                          Dibuat: {new Date(code.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopyCode(code.code)}
                        className="p-2 hover:bg-amber-900/30 rounded transition text-amber-200/60 hover:text-amber-400 liquid-btn btn-sm"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-amber-100/60">Belum ada kode undangan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

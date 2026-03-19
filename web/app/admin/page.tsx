"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  getPendingVendors,
  getApprovedVendors,
  getStores,
  getAdminStats,
  approveVendor,
  rejectVendor,
} from "./actions";

interface PendingVendor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  zip_code: string | null;
  created_at: string;
}

interface StoreInfo {
  id: string;
  name: string;
  address: string;
}

interface VendorAssignment {
  id: string;
  store_id: string;
  stores: StoreInfo;
}

interface ApprovedVendor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  zip_code: string | null;
  created_at: string;
  last_login_at: string | null;
  vendors: VendorAssignment[];
}

interface Stats {
  pendingCount: number;
  approvedCount: number;
  totalUsers: number;
}

const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const timeAgo = (iso: string | null): string => {
  if (!iso) return "Never";
  const d = new Date(iso);
  const now = new Date();
  const mins = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return fmtDate(iso);
};

const INITIALS_COLORS = [
  "linear-gradient(135deg,#D4700A,#F4A261)",
  "linear-gradient(135deg,#1565C0,#42A5F5)",
  "linear-gradient(135deg,#C1292E,#EF5350)",
  "linear-gradient(135deg,#6D4C41,#A1887F)",
  "linear-gradient(135deg,#7B1FA2,#BA68C8)",
];

const pickColor = (id: string) =>
  INITIALS_COLORS[
    id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % INITIALS_COLORS.length
  ];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"pending" | "vendors">("pending");
  const [pending, setPending] = useState<PendingVendor[]>([]);
  const [vendors, setVendors] = useState<ApprovedVendor[]>([]);
  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [stats, setStats] = useState<Stats>({
    pendingCount: 0,
    approvedCount: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [storeSelections, setStoreSelections] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    const [pendingRes, vendorsRes, storesRes, statsRes] = await Promise.all([
      getPendingVendors(),
      getApprovedVendors(),
      getStores(),
      getAdminStats(),
    ]);

    if (pendingRes.data) setPending(pendingRes.data as PendingVendor[]);
    if (vendorsRes.data) setVendors(vendorsRes.data as ApprovedVendor[]);
    if (storesRes.data) setStores(storesRes.data as StoreInfo[]);
    setStats(statsRes);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    const storeId = storeSelections[userId];
    const result = await approveVendor(userId, storeId || undefined);

    if (result.error) {
      showToast("error", result.error);
    } else {
      showToast("success", "Vendor approved successfully");
      setStoreSelections((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
      await loadData();
    }
    setActionLoading(null);
  };

  const handleReject = async (userId: string) => {
    setActionLoading(userId);
    const result = await rejectVendor(userId);

    if (result.error) {
      showToast("error", result.error);
    } else {
      showToast("success", "Vendor request rejected");
      await loadData();
    }
    setActionLoading(null);
  };

  return (
    <div
      className="min-h-screen text-stone-900"
      style={{ background: "#F7F5F0", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&display=swap');
        .fraunces { font-family: 'Fraunces', serif; }
        @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .toast-enter { animation: slideIn 0.25s ease-out; }
        @keyframes fadeCard { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .card-fade { animation: fadeCard 0.35s ease-out both; }
      `}</style>

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 toast-enter">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border text-sm font-medium ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <span className="text-base">{toast.type === "success" ? "✓" : "✕"}</span>
            {toast.message}
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="max-w-[1320px] mx-auto px-8 pt-6 pb-5 flex justify-between items-center">
        <div className="flex items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center text-white text-xl font-bold fraunces"
            style={{
              background: "linear-gradient(135deg,#2D6A4F,#52B788)",
              boxShadow: "0 4px 14px rgba(45,106,79,.25)",
            }}
          >
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="fraunces text-[22px] font-bold tracking-tight">Neighborly</span>
              <span className="text-[11px] font-semibold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full tracking-wider">
                ADMIN
              </span>
            </div>
            <div className="text-xs text-stone-400 -mt-0.5">Platform administration</div>
          </div>
        </div>

        <nav className="flex gap-1 bg-stone-200 rounded-full p-1">
          {(["pending", "vendors"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border-none cursor-pointer
                ${
                  activeTab === t
                    ? "bg-green-800 text-white shadow-sm"
                    : "bg-transparent text-stone-500 hover:bg-stone-300 hover:text-stone-800"
                }`}
            >
              {t === "pending" ? "Pending Approvals" : "Active Vendors"}
              {t === "pending" && stats.pendingCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-[10px] font-bold text-amber-900">
                  {stats.pendingCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="w-9 h-9 rounded-full bg-green-800 flex items-center justify-center text-white font-semibold text-sm cursor-pointer">
          A
        </div>
      </header>

      {/* ── Banner ── */}
      <div className="max-w-[1320px] mx-auto px-8 pb-6">
        <div
          className="rounded-3xl px-10 py-8 flex justify-between items-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,#1B4332 0%,#2D6A4F 50%,#40916C 100%)",
          }}
        >
          <div className="absolute -top-16 -right-10 w-60 h-60 rounded-full bg-white/[0.04] pointer-events-none" />
          <div className="absolute -bottom-20 right-32 w-44 h-44 rounded-full bg-white/[0.03] pointer-events-none" />
          <div className="relative z-10">
            <div className="fraunces text-[28px] font-semibold text-white tracking-tight mb-1.5">
              Admin Dashboard
            </div>
            <div className="text-white/70 text-[15px]">
              {stats.pendingCount > 0 ? (
                <>
                  <span className="text-amber-300 font-semibold">{stats.pendingCount} pending</span>{" "}
                  vendor {stats.pendingCount === 1 ? "request" : "requests"} awaiting review
                </>
              ) : (
                <>All vendor requests have been reviewed</>
              )}
              {" · "}
              <span className="text-green-300 font-semibold">{stats.approvedCount} active</span>{" "}
              vendors {" · "} {stats.totalUsers} total users
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="max-w-[1320px] mx-auto px-8 pb-6 grid grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-7 border border-black/[0.05] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Pending Approvals
          </div>
          <div
            className={`fraunces text-[42px] font-semibold leading-none ${
              stats.pendingCount > 0 ? "text-amber-600" : "text-green-800"
            }`}
          >
            {stats.pendingCount}
          </div>
          <div className="text-sm text-stone-400 mt-1">awaiting review</div>
        </div>

        <div className="bg-white rounded-2xl p-7 border border-black/[0.05] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Active Vendors
          </div>
          <div className="fraunces text-[42px] font-semibold leading-none text-green-800">
            {stats.approvedCount}
          </div>
          <div className="text-sm text-stone-400 mt-1">approved vendors</div>
        </div>

        <div className="bg-white rounded-2xl p-7 border border-black/[0.05] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Total Users
          </div>
          <div className="fraunces text-[42px] font-semibold leading-none">{stats.totalUsers}</div>
          <div className="text-sm text-stone-400 mt-1">registered users</div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-[1320px] mx-auto px-8 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-[3px] border-green-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeTab === "pending" ? (
          /* ── Pending Approvals ── */
          <div className="bg-white rounded-2xl p-7 border border-black/[0.05]">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Pending Vendor Requests
              </div>
              {pending.length > 0 && (
                <span className="text-xs text-stone-400">
                  {pending.length} request{pending.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {pending.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-50 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <div className="text-lg font-semibold text-stone-700 mb-1">All caught up</div>
                <div className="text-sm text-stone-400">
                  No pending vendor requests to review.
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {pending.map((v, i) => (
                  <div
                    key={v.id}
                    className="card-fade bg-stone-50 rounded-2xl p-5 border border-stone-100 flex items-center gap-5 hover:border-stone-200 transition-colors"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ background: pickColor(v.id) }}
                    >
                      {v.first_name?.charAt(0)}
                      {v.last_name?.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[15px]">
                        {v.first_name} {v.last_name}
                      </div>
                      <div className="text-sm text-stone-400 flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="truncate">{v.email}</span>
                        {v.zip_code && (
                          <>
                            <span className="text-stone-200">·</span>
                            <span>ZIP {v.zip_code}</span>
                          </>
                        )}
                        <span className="text-stone-200">·</span>
                        <span>Applied {fmtDate(v.created_at)}</span>
                      </div>
                    </div>

                    <select
                      value={storeSelections[v.id] || ""}
                      onChange={(e) =>
                        setStoreSelections((prev) => ({
                          ...prev,
                          [v.id]: e.target.value,
                        }))
                      }
                      className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm bg-white text-stone-700 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/10 cursor-pointer min-w-[180px]"
                    >
                      <option value="">No store assigned</option>
                      {stores.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(v.id)}
                        disabled={actionLoading === v.id}
                        className="bg-green-800 text-white border-none px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer hover:bg-green-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === v.id ? (
                          <span className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Approving
                          </span>
                        ) : (
                          "Approve"
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(v.id)}
                        disabled={actionLoading === v.id}
                        className="bg-transparent text-red-600 border border-red-200 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── Active Vendors ── */
          <div className="bg-white rounded-2xl p-7 border border-black/[0.05]">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Active Vendors
              </div>
              {vendors.length > 0 && (
                <span className="text-xs text-stone-400">
                  {vendors.length} vendor{vendors.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {vendors.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-stone-100 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8B8680" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="text-lg font-semibold text-stone-700 mb-1">No active vendors</div>
                <div className="text-sm text-stone-400">
                  Approved vendors will appear here.
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-[2fr_2fr_1.5fr_0.8fr_1fr_1fr] items-center py-3 border-b-2 border-stone-100 text-[11px] font-semibold text-stone-300 uppercase tracking-wider">
                  <span>Vendor</span>
                  <span>Email</span>
                  <span>Store Assignment</span>
                  <span>Zip Code</span>
                  <span>Last Login</span>
                  <span>Joined</span>
                </div>

                {vendors.map((v, i) => {
                  const storeAssignments = v.vendors || [];
                  return (
                    <div
                      key={v.id}
                      className="card-fade grid grid-cols-[2fr_2fr_1.5fr_0.8fr_1fr_1fr] items-center py-3.5 border-b border-stone-100 last:border-b-0 text-sm"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
                          style={{ background: pickColor(v.id) }}
                        >
                          {v.first_name?.charAt(0)}
                          {v.last_name?.charAt(0)}
                        </div>
                        <span className="font-medium">
                          {v.first_name} {v.last_name}
                        </span>
                      </div>

                      <span className="text-stone-500 truncate pr-2">{v.email}</span>

                      <div>
                        {storeAssignments.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {storeAssignments.map((va) => (
                              <span
                                key={va.id}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-100 text-green-800"
                              >
                                {va.stores?.name || "Unknown"}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-stone-300 text-xs">Unassigned</span>
                        )}
                      </div>

                      <span className="text-stone-500">{v.zip_code || "—"}</span>
                      <span className="text-xs text-stone-400">{timeAgo(v.last_login_at)}</span>
                      <span className="text-xs text-stone-400">{fmtDate(v.created_at)}</span>
                    </div>
                  );
                })}

                <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-stone-100">
                  <span className="text-sm text-stone-400">
                    {vendors.length} active vendor{vendors.length !== 1 ? "s" : ""}
                    {" · "}
                    {vendors.filter((v) => v.vendors?.length > 0).length} with store assignments
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

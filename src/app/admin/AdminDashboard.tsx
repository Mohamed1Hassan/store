"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarCheck, Crown, LogOut, Phone, RefreshCw, Search } from "lucide-react";
import type { LeadStatus, StoredLead } from "@/lib/leads-store";
import type { AppointmentStatus, StoredAppointment } from "@/lib/appointments-store";

const STATUSES: { id: LeadStatus | "ALL"; label: string }[] = [
  { id: "ALL", label: "الكل" },
  { id: "NEW", label: "جديد" },
  { id: "CONTACTED", label: "تم التواصل" },
  { id: "CONFIRMED", label: "مؤكد" },
  { id: "DELIVERED", label: "تم التسليم" },
  { id: "CANCELLED", label: "ملغي" },
];

const STATUS_STYLE: Record<LeadStatus, string> = {
  NEW: "bg-[#d4af37]/15 text-[#ffd700] border-[#d4af37]/40",
  CONTACTED: "bg-sky-500/15 text-sky-300 border-sky-500/40",
  CONFIRMED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  DELIVERED: "bg-zinc-500/15 text-zinc-300 border-zinc-500/40",
  CANCELLED: "bg-red-500/15 text-red-300 border-red-500/40",
};

const APPOINTMENT_STATUSES: { id: AppointmentStatus | "ALL"; label: string }[] = [
  { id: "ALL", label: "الكل" },
  { id: "NEW", label: "جديد" },
  { id: "CONTACTED", label: "تم التواصل" },
  { id: "SCHEDULED", label: "مجدول" },
  { id: "DONE", label: "تمت المعاينة" },
  { id: "CANCELLED", label: "ملغي" },
];

const APPOINTMENT_STYLE: Record<AppointmentStatus, string> = {
  NEW: "bg-[#d4af37]/15 text-[#ffd700] border-[#d4af37]/40",
  CONTACTED: "bg-sky-500/15 text-sky-300 border-sky-500/40",
  SCHEDULED: "bg-violet-500/15 text-violet-300 border-violet-500/40",
  DONE: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  CANCELLED: "bg-red-500/15 text-red-300 border-red-500/40",
};

type TabId = "leads" | "appointments";

interface LeadsResponse {
  items: StoredLead[];
  counts: { total: number; filtered: number };
}

interface AppointmentsResponse {
  items: StoredAppointment[];
  counts: { total: number; filtered: number };
}

export default function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const [tab, setTab] = useState<TabId>("leads");
  const [leads, setLeads] = useState<StoredLead[]>([]);
  const [appointments, setAppointments] = useState<StoredAppointment[]>([]);
  const [total, setTotal] = useState(0);
  const [appointmentsTotal, setAppointmentsTotal] = useState(0);
  const [status, setStatus] = useState<LeadStatus | "ALL">("ALL");
  const [appointmentStatus, setAppointmentStatus] = useState<AppointmentStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const isLeads = tab === "leads";
      const params = new URLSearchParams();
      const active = isLeads ? status : appointmentStatus;
      if (active !== "ALL") params.set("status", active);
      if (search.trim()) params.set("search", search.trim());
      params.set("pageSize", "50");
      const res = await fetch(`${isLeads ? "/api/leads" : "/api/appointments"}?${params.toString()}`);
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      if (!res.ok) throw new Error("load-failed");
      if (isLeads) {
        const data = (await res.json()) as LeadsResponse;
        setLeads(data.items);
        setTotal(data.counts.total);
      } else {
        const data = (await res.json()) as AppointmentsResponse;
        setAppointments(data.items);
        setAppointmentsTotal(data.counts.total);
      }
    } catch {
      setError("تعذر تحميل البيانات. تحقق من الاتصال وحاول مجدداً.");
    } finally {
      setLoading(false);
    }
  }, [tab, status, appointmentStatus, search]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const isLeads = tab === "leads";
        const params = new URLSearchParams();
        const active = isLeads ? status : appointmentStatus;
        if (active !== "ALL") params.set("status", active);
        if (search.trim()) params.set("search", search.trim());
        params.set("pageSize", "50");
        const res = await fetch(`${isLeads ? "/api/leads" : "/api/appointments"}?${params.toString()}`);
        if (res.status === 401) {
          window.location.reload();
          return;
        }
        if (!res.ok) throw new Error("load-failed");
        if (isLeads) {
          const data = (await res.json()) as LeadsResponse;
          if (!cancelled) {
            setLeads(data.items);
            setTotal(data.counts.total);
          }
        } else {
          const data = (await res.json()) as AppointmentsResponse;
          if (!cancelled) {
            setAppointments(data.items);
            setAppointmentsTotal(data.counts.total);
          }
        }
      } catch {
        if (!cancelled) setError("تعذر تحميل البيانات. تحقق من الاتصال وحاول مجدداً.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [fetchLeads, tab, status, appointmentStatus, search]);

  const handleStatusChange = async (id: string, next: LeadStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status: next } : lead)));
    } catch {
      setError("تعذر تحديث الحالة. حاول مجدداً.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAppointmentStatus = async (id: string, next: AppointmentStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      setAppointments((prev) => prev.map((item) => (item.id === id ? { ...item, status: next } : item)));
    } catch {
      setError("تعذر تحديث الحالة. حاول مجدداً.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-[#0b0e17] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d4af37]/40 bg-[#d4af37]/15 text-[#ffd700]">
            <Crown className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-black text-white">مرحباً أيها السلطان</p>
            <p dir="ltr" className="text-[11px] text-zinc-500">{adminEmail} · {tab === "leads" ? total : appointmentsTotal}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => void fetchLeads()} className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-zinc-200 hover:border-[#d4af37]/40 hover:text-[#ffd700]">
            <RefreshCw className="h-3.5 w-3.5" />تحديث
          </button>
          <button type="button" onClick={() => void handleLogout()} className="flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-300 hover:bg-red-500/20">
            <LogOut className="h-3.5 w-3.5" />خروج
          </button>
        </div>
      </div>

      <div role="tablist" aria-label="أقسام الإدارة" className="flex gap-2 rounded-3xl border border-white/10 bg-[#0b0e17] p-2">
        <button type="button" role="tab" aria-selected={tab === "leads"} onClick={() => setTab("leads")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${tab === "leads" ? "bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black" : "text-zinc-300 hover:text-[#ffd700]"}`}>
          <Phone className="h-4 w-4" />الطلبات ({total})
        </button>
        <button type="button" role="tab" aria-selected={tab === "appointments"} onClick={() => setTab("appointments")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${tab === "appointments" ? "bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black" : "text-zinc-300 hover:text-[#ffd700]"}`}>
          <CalendarCheck className="h-4 w-4" />حجوزات المعاينة ({appointmentsTotal})
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-[#0b0e17] p-5 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2">
          {tab === "leads"
            ? STATUSES.map((item) => (
              <button key={item.id} type="button"
                onClick={() => setStatus(item.id)}
                aria-pressed={status === item.id}
                className={`rounded-full px-4 py-1.5 text-xs font-bold ${status === item.id ? "bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black" : "border border-white/10 bg-white/5 text-zinc-300 hover:text-[#ffd700]"}`}>
                {item.label}
              </button>
            ))
            : APPOINTMENT_STATUSES.map((item) => (
              <button key={item.id} type="button"
                onClick={() => setAppointmentStatus(item.id)}
                aria-pressed={appointmentStatus === item.id}
                className={`rounded-full px-4 py-1.5 text-xs font-bold ${appointmentStatus === item.id ? "bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black" : "border border-white/10 bg-white/5 text-zinc-300 hover:text-[#ffd700]"}`}>
                {item.label}
              </button>
            ))}
        </div>
        <label className="relative block flex-1 lg:max-w-xs lg:ms-auto">
          <span className="sr-only">بحث بالاسم أو الهاتف</span>
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم أو الهاتف..."
            className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pe-4 ps-4 text-xs text-zinc-100 outline-none focus:border-[#d4af37]" />
        </label>
      </div>

      {error && <p role="alert" className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-xs font-bold text-red-300">{error}</p>}

      {loading ? (
        <p className="py-10 text-center text-sm text-zinc-400">{tab === "leads" ? "جاري تحميل الطلبات..." : "جاري تحميل الحجوزات..."}</p>
      ) : tab === "leads" ? (
        leads.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center">
            <p className="text-sm font-bold text-zinc-300">لا توجد طلبات مطابقة بعد</p>
            <p className="mt-1 text-xs text-zinc-500">اطلب من موقعك تجريبياً وستظهر هنا فوراً.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {leads.map((lead) => (
              <li key={lead.id} className="rounded-3xl border border-white/10 bg-[#0b0e17] p-5 hover:border-[#d4af37]/40">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-black text-white">{lead.name}</h2>
                    <a href={`tel:${lead.phone}`} dir="ltr" className="mt-1 flex items-center gap-1.5 text-xs font-bold text-[#ffd700] hover:underline">
                      <Phone className="h-3.5 w-3.5" />{lead.phone}
                    </a>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${STATUS_STYLE[lead.status]}`}>
                    {STATUSES.find((s) => s.id === lead.status)?.label ?? lead.status}
                  </span>
                </div>
                <p className="mb-1 text-xs text-zinc-300"><span className="font-bold text-zinc-500">المنتج: </span>{lead.product}</p>
                {lead.size && <p className="mb-1 text-xs text-zinc-400"><span className="font-bold text-zinc-500">المقاس: </span>{lead.size}</p>}
                {lead.notes && <p className="mb-1 text-xs leading-relaxed text-zinc-400">{lead.notes}</p>}
                <p className="mb-4 text-[10px] text-zinc-600">{new Date(lead.createdAt).toLocaleString("ar-EG")} · {lead.source}</p>
                <label className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-zinc-400">الحالة:</span>
                  <select value={lead.status} disabled={updatingId === lead.id} onChange={(e) => void handleStatusChange(lead.id, e.target.value as LeadStatus)}
                    className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-bold text-zinc-100 outline-none focus:border-[#d4af37]">
                    {STATUSES.filter((s) => s.id !== "ALL").map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        )
      ) : appointments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center">
          <p className="text-sm font-bold text-zinc-300">لا توجد حجوزات معاينة بعد</p>
          <p className="mt-1 text-xs text-zinc-500">احجز من قسم الستائر تجريبياً وسيظهر هنا فوراً.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {appointments.map((item) => (
            <li key={item.id} className="rounded-3xl border border-white/10 bg-[#0b0e17] p-5 hover:border-[#d4af37]/40">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-black text-white">{item.name}</h2>
                  <a href={`tel:${item.phone}`} dir="ltr" className="mt-1 flex items-center gap-1.5 text-xs font-bold text-[#ffd700] hover:underline">
                    <Phone className="h-3.5 w-3.5" />{item.phone}
                  </a>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${APPOINTMENT_STYLE[item.status]}`}>
                  {APPOINTMENT_STATUSES.find((s) => s.id === item.status)?.label ?? item.status}
                </span>
              </div>
              {item.city && <p className="mb-1 text-xs text-zinc-300"><span className="font-bold text-zinc-500">المدينة: </span>{item.city}</p>}
              {item.notes && <p className="mb-1 text-xs leading-relaxed text-zinc-400">{item.notes}</p>}
              <p className="mb-4 text-[10px] text-zinc-600">{new Date(item.createdAt).toLocaleString("ar-EG")} · {item.source}</p>
              <label className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-zinc-400">الحالة:</span>
                <select value={item.status} disabled={updatingId === item.id} onChange={(e) => void handleAppointmentStatus(item.id, e.target.value as AppointmentStatus)}
                  className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-bold text-zinc-100 outline-none focus:border-[#d4af37]">
                  {APPOINTMENT_STATUSES.filter((s) => s.id !== "ALL").map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

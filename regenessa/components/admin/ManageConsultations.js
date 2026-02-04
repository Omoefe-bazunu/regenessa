"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Calendar as CalendarIcon, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ManageConsultations() {
  const [activeTab, setActiveTab] = useState("requests");
  const [consultations, setConsultations] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  // Added time to the state
  const [newDate, setNewDate] = useState({ label: "", value: "", time: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const consults = await api.get("/consultations/admin/all");
      const dates = await api.get("/consultations/available-dates");
      setConsultations(consults.data);
      setAvailableDates(dates.data);
    } catch (err) {
      toast.error("Failed to sync clinical data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDate = async (e) => {
    e.preventDefault();
    try {
      // Formats the entry to include the time in the value for the select list
      const dateEntry = {
        label: `${newDate.label} (${newDate.time})`,
        value: `${newDate.value}T${newDate.time}`,
        time: newDate.time,
      };

      const updatedDates = [...availableDates, dateEntry];
      await api.post("/consultations/admin/set-dates", { dates: updatedDates });
      setAvailableDates(updatedDates);
      setNewDate({ label: "", value: "", time: "" });
      toast.success("Schedule Updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const removeDate = async (idx) => {
    const updated = availableDates.filter((_, i) => i !== idx);
    await api.post("/consultations/admin/set-dates", { dates: updated });
    setAvailableDates(updated);
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-8 border-b border-border mb-10">
        {["requests", "calendar"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all border-b-2 ${
              activeTab === tab
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-foreground/30"
            }`}
          >
            {tab === "requests" ? "Analysis Requests" : "Schedule Slots"}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader2
          className="animate-spin text-brand-primary mx-auto"
          size={32}
        />
      ) : activeTab === "requests" ? (
        <div className="space-y-4">
          {consultations.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-white/5 border border-border p-6 flex justify-between items-center group"
            >
              <div className="space-y-1">
                <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest">
                  {c.scheduledDate}
                </p>
                <h4 className="font-syne font-bold text-lg">{c.name}</h4>
                <p className="text-xs text-foreground/50 font-jakarta">
                  {c.concern}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-brand-dark dark:text-white">
                  {c.phone}
                </p>
                <p className="text-[10px] opacity-40 uppercase tracking-widest">
                  {c.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl bg-white dark:bg-white/5 p-8 border border-border">
          <form
            onSubmit={handleAddDate}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <input
              required
              type="text"
              placeholder="Label (e.g. Mon, Feb 5)"
              value={newDate.label}
              onChange={(e) =>
                setNewDate({ ...newDate, label: e.target.value })
              }
              className="bg-brand-warm/50 border border-border p-3 text-xs font-jakarta outline-none"
            />
            <input
              required
              type="date"
              value={newDate.value}
              onChange={(e) =>
                setNewDate({ ...newDate, value: e.target.value })
              }
              className="bg-brand-warm/50 border border-border p-3 text-xs font-jakarta outline-none"
            />
            {/* NEW TIME INPUT */}
            <input
              required
              type="time"
              value={newDate.time}
              onChange={(e) => setNewDate({ ...newDate, time: e.target.value })}
              className="bg-brand-warm/50 border border-border p-3 text-xs font-jakarta outline-none"
            />
            <button
              type="submit"
              className="md:col-span-3 bg-brand-primary text-white py-3 font-black text-[10px] uppercase tracking-[0.2em]"
            >
              Add Available Slot
            </button>
          </form>

          <div className="space-y-2">
            {availableDates.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-brand-warm/30 border border-border"
              >
                <span className="text-xs font-bold font-jakarta">
                  {d.label} — {d.time || "No time set"}
                </span>
                <button
                  onClick={() => removeDate(i)}
                  className="text-red-500 hover:scale-110 transition-transform"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

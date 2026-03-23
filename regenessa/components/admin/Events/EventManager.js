"use client";
import { useState, useEffect } from "react";
import {
  Calendar,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit3,
  LayoutDashboard,
  CheckCircle,
  Clock,
} from "lucide-react";
import EventForm from "./EventForm";
import GalleryUploader from "./GalleryUploader";
import api from "@/lib/api";

export default function EventsAdmin() {
  const [activeTab, setActiveTab] = useState("manage");
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/events");
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this event and its gallery permanently?")) {
      await api.delete(`/events/${id}`);
      fetchEvents();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 mt-10">
      <header className="mb-12">
        <h1 className="font-syne text-4xl font-bold text-brand-dark uppercase tracking-tighter">
          Event <span className="text-brand-accent italic">Registry.</span>
        </h1>
      </header>

      {/* ADMIN TABS */}
      <div className="flex gap-6 border-b border-brand-dark/5 mb-10">
        <button
          onClick={() => {
            setActiveTab("manage");
            setEditingEvent(null);
          }}
          className={`pb-4 px-2 text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === "manage"
              ? "text-brand-primary border-b-2 border-brand-primary"
              : "text-brand-dark/30"
          }`}
        >
          Manage Events
        </button>
        <button
          onClick={() => setActiveTab("gallery")}
          className={`pb-4 px-2 text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === "gallery"
              ? "text-brand-primary border-b-2 border-brand-primary"
              : "text-brand-dark/30"
          }`}
        >
          Gallery Archives
        </button>
      </div>

      {activeTab === "manage" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* FORM COLUMN */}
          <div className="lg:col-span-1">
            <EventForm
              editingEvent={editingEvent}
              onSuccess={() => {
                fetchEvents();
                setEditingEvent(null);
              }}
            />
          </div>

          {/* LIST COLUMN */}
          <div className="lg:col-span-2 space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white p-6 border border-brand-dark/5 flex items-center justify-between group hover:border-brand-primary transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-brand-warm relative overflow-hidden">
                    {event.image && (
                      <img
                        src={event.image}
                        className="object-cover h-full w-full"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-syne font-bold text-brand-dark">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                          event.status === "ongoing"
                            ? "bg-green-100 text-green-700"
                            : "bg-brand-dark/5 text-brand-dark/40"
                        }`}
                      >
                        {event.status}
                      </span>
                      <span className="text-[10px] text-brand-dark/40 font-jakarta italic">
                        {event.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingEvent(event)}
                    className="p-3 bg-brand-warm text-brand-dark hover:bg-brand-primary hover:text-white transition-all"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-3 bg-brand-warm text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <GalleryUploader events={events} onUpdate={fetchEvents} />
      )}
    </div>
  );
}

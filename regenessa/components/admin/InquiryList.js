"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Mail,
  Calendar,
  User,
  Building2,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function InquiryList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get("/contact");
      setMessages(data);
    } catch (err) {
      toast.error("Could not load messages");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-primary" />
      </div>
    );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-[3rem]">
            <p className="text-foreground/30 font-bold uppercase tracking-widest">
              No messages yet
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white dark:bg-brand-dark p-8 rounded-[2.5rem] border border-border shadow-sm hover:border-brand-primary/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
                  <Mail size={20} />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${msg.status === "unread" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"}`}
                >
                  {msg.status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-heading text-xl text-brand-dark dark:text-white line-clamp-1">
                    {msg.businessName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-foreground/40 mt-1">
                    <User size={12} />
                    <span>{msg.name}</span>
                  </div>
                </div>

                <p className="text-sm text-foreground/70 line-clamp-3 italic">
                  &quot;{msg.message}&quot;
                </p>

                <div className="pt-6 border-t border-border flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/30 uppercase">
                    <Calendar size={12} />
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

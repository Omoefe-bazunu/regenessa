"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Mail,
  Calendar,
  User,
  Loader2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Phone,
  Inbox,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function InquiryList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get("/contact");
      setMessages(data);
    } catch (err) {
      toast.error("Could not load clinical inquiries");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );

  return (
    <div className="animate-page-reveal">
      {messages.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-brand-dark/10 rounded-sm bg-brand-warm/30">
          <Inbox className="mx-auto text-brand-dark/10 mb-4" size={48} />
          <p className="text-brand-dark/30 font-jakarta font-black text-[10px] uppercase tracking-widest">
            No inquiries logged in the registry.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => {
            const isExpanded = expandedId === msg.id;

            return (
              <div
                key={msg.id}
                className={`bg-white dark:bg-brand-dark border border-brand-dark/5 transition-all duration-300 ${
                  isExpanded
                    ? "shadow-lg scale-[1.01]"
                    : "hover:bg-brand-warm/50"
                }`}
              >
                {/* COMPACT HEADER */}
                <button
                  onClick={() => toggleExpand(msg.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`p-2 rounded-full ${
                        isExpanded
                          ? "bg-brand-primary text-white"
                          : "bg-brand-primary/10 text-brand-primary"
                      }`}
                    >
                      <Mail size={16} />
                    </div>
                    <div>
                      <h4 className="font-syne font-bold text-sm text-brand-dark dark:text-white leading-none">
                        {msg.name}
                      </h4>
                      <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest mt-1">
                        Received: {new Date(msg.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="hidden md:block text-[10px] font-jakarta font-bold text-brand-dark/30 uppercase tracking-widest">
                      {msg.email}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-brand-dark/20" />
                    ) : (
                      <ChevronDown size={16} className="text-brand-dark/20" />
                    )}
                  </div>
                </button>

                {/* EXPANDABLE BODY */}
                {isExpanded && (
                  <div className="px-5 pb-8 pt-2 border-t border-brand-dark/5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-tighter text-brand-primary">
                          Email Access
                        </p>
                        <p className="text-xs font-bold text-brand-dark dark:text-white">
                          {msg.email}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-tighter text-brand-primary">
                          Direct Contact
                        </p>
                        <p className="text-xs font-bold text-brand-dark dark:text-white">
                          {msg.phone || "Not Provided"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-brand-warm/30 dark:bg-white/5 p-6 rounded-sm border border-brand-dark/5">
                      <div className="flex gap-4">
                        <MessageSquare
                          size={16}
                          className="text-brand-primary shrink-0 mt-1"
                        />
                        <p className="font-jakarta text-sm text-brand-dark/70 dark:text-white/70 leading-relaxed italic">
                          &quot;{msg.message}&quot;
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                      <a
                        href={`mailto:${msg.email}`}
                        className="px-6 py-3 bg-brand-dark text-white text-[9px] font-black uppercase tracking-widest hover:bg-brand-primary transition-colors"
                      >
                        Send Email Reply
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

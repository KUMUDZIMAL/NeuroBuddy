"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import { Send, Brain, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatbotPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [neuroHistory, setNeuroHistory] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const history = localStorage.getItem("neuroHistory");
    if (history) setNeuroHistory(JSON.parse(history));
  }, []);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          neuroHistory: neuroHistory,
          history: messages.slice(-5)
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                assistantContent += data.content;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1].content = assistantContent;
                  return updated;
                });
              }
            }
          }
        }
      }
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  const activeNamespace = neuroHistory.length > 0 ? neuroHistory[0].disorder : "General";

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="p-4 bg-white border-b flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 font-bold text-violet-600"><Brain /> NeuroBuddy</div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-emerald-500 bg-emerald-50 px-2 py-1 rounded">
          <ShieldCheck size={12} /> Knowledge Base: {activeNamespace}
        </div>
      </header>

      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center mt-20 text-slate-400 text-sm italic">
            "Hello! I can help you with coping techniques based on your EEG data."
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === "user" ? "bg-violet-600 text-white" : "bg-white border text-slate-700 shadow-sm"}`}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Ask about managing ${activeNamespace}...`} className="rounded-full px-6" />
          <Button type="submit" disabled={isLoading} className="bg-violet-600 rounded-full w-12 h-12 p-0">
            <Send size={18} />
          </Button>
        </form>
      </footer>
    </div>
  );
}
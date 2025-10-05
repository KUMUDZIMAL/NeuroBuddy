"use client";

import React, { useState, useRef, useEffect, FormEvent, ChangeEvent, ReactNode } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Custom Avatar Component for Profile
interface AvatarProps {
  imageUrl?: string;
  initials: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ imageUrl, initials, className }) => (
  <div className={`w-8 h-8 rounded-full ${className}`}>
    {imageUrl ? (
      <img src={imageUrl} alt="avatar" className="object-cover w-full h-full rounded-full" />
    ) : (
      <div className="flex items-center justify-center w-full h-full bg-gray-300">
        <span className="font-bold text-white">{initials}</span>
      </div>
    )}
  </div>
);

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`w-full h-full max-w-5xl p-6 bg-white bg-opacity-60 shadow-lg rounded-xl flex flex-col backdrop-blur-md ${className}`}>
    {children}
  </div>
);

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={`p-3 border-b border-gray-200 flex items-center space-x-2 ${className}`}>
    {children}
  </div>
);

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => (
  <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h2>
);

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={`flex-grow p-3 space-y-4 overflow-auto ${className}`}>
    {children}
  </div>
);

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={`p-2 bg-white bg-opacity-80 backdrop-blur-md rounded-t-xl border-t border-gray-300 ${className}`}>
    {children}
  </div>
);

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify({ message: input }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      let assistantMessage: Message = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(5));
                if (data.content) {
                  assistantMessage.content += data.content;
                  setMessages((prev) => [...prev.slice(0, -1), { ...assistantMessage }]);
                }
                if (data.done) {
                  break;
                }
              } catch (error) {
                console.error("Error parsing JSON:", error);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen p-6">
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
        <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
        <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
      </div>
      <Card className="max-w-6xl z-10">
        <CardHeader>
          <Avatar initials="AI" className="bg-purple-500" />
          <CardTitle className="font-outfitLight text-slate-800">Your AI-Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-end space-x-2 ${
                  message.role === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div
                  className={`max-w-2xl px-6 py-2 rounded-xl transition-transform transform hover:scale-105 shadow-md ${
                    message.role === "user"
                      ? "bg-violet-500 text-white rounded-br-none font-outfitRegular"
                      : "bg-violet-200 bg-opacity-90 text-slate-700 rounded-bl-none font-outfitRegular"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2">
                <Avatar initials="AI" className="bg-blue-500" />
                <div className="max-w-lg p-3 text-gray-900 bg-white shadow-md rounded-2xl">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            {/* <Button className="flex items-center p-1.5 bg-gray-100 rounded-full hover:bg-gray-200">
              <i className="fas fa-paperclip"></i>
            </Button>
            <Button className="flex items-center p-1.5 bg-gray-100 rounded-full hover:bg-gray-200">
              <i className="fas fa-microphone"></i>
            </Button> */}
            <Input
              type="text"
              value={input}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInput(e.target.value)
              }
              placeholder="Type a message..."
              className="flex-grow p-3 text-gray-900 bg-white border-gray-300 rounded-full bg-opacity-70 hover:border-gray-400 focus:ring-2 focus:ring-purple-500 font-outfitRegular"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="text-white bg-violet-500 rounded-full hover:bg-violet-600"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

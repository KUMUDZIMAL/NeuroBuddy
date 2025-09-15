"use client";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppLayout from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Bot, 
  User, 
  Heart, 
  Brain, 
  Smile,
  Frown,
  Meh,
  Settings,
  Volume2,
  Mic,
  MicOff
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  mood?: "positive" | "neutral" | "negative";
}

type ChatTone = "empathetic" | "motivational" | "analytical" | "casual";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello! I'm your AI therapy companion. I'm here to listen, support, and help you work through any challenges you're facing. How are you feeling today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatTone, setChatTone] = useState<ChatTone>("empathetic");
  const [isListening, setIsListening] = useState(false);
  const [currentMood, setCurrentMood] = useState<"positive" | "neutral" | "negative">("neutral");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        empathetic: [
          "I hear you, and I want you to know that your feelings are completely valid. It's okay to feel this way.",
          "Thank you for sharing that with me. It takes courage to open up about what you're experiencing.",
          "I can sense that this is difficult for you. Remember, you're not alone in this journey.",
        ],
        motivational: [
          "You've got this! Every small step you take is progress, and I believe in your strength.",
          "Remember how far you've come already. You're stronger than you realize!",
          "This challenge is an opportunity for growth. I know you can work through this!",
        ],
        analytical: [
          "Let's break this down together. What specific aspects of this situation are most challenging for you?",
          "I notice a pattern here. Have you experienced similar feelings in comparable situations before?",
          "From what you've shared, it seems like there might be some underlying thoughts driving these feelings.",
        ],
        casual: [
          "Hey, that sounds tough. Want to talk through what's going on?",
          "I get it - we all have those days. What's been the biggest challenge today?",
          "Sounds like you're dealing with a lot right now. How can I help?",
        ],
      };

      const responseArray = responses[chatTone];
      const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  const toneDescriptions = {
    empathetic: "Warm and understanding",
    motivational: "Encouraging and uplifting", 
    analytical: "Logical and solution-focused",
    casual: "Friendly and relaxed"
  };

  return (
    <AppLayout>
    <div className="p-6 h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            AI Therapy Chat 🤖
          </h1>
          <p className="text-muted-foreground">
            Your personal AI companion for mental wellness support
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Bot className="w-3 h-3 mr-1" />
            {chatTone} mode
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="btn-calm"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mood Check */}
      <Card className="gradient-calm border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">How are you feeling right now?</p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentMood("positive")}
                  className={`p-2 rounded-lg transition-all ${
                    currentMood === "positive" ? "bg-success/20 text-success" : "text-muted-foreground hover:text-success"
                  }`}
                >
                  <Smile className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentMood("neutral")}
                  className={`p-2 rounded-lg transition-all ${
                    currentMood === "neutral" ? "bg-warning/20 text-warning" : "text-muted-foreground hover:text-warning"
                  }`}
                >
                  <Meh className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentMood("negative")}
                  className={`p-2 rounded-lg transition-all ${
                    currentMood === "negative" ? "bg-destructive/20 text-destructive" : "text-muted-foreground hover:text-destructive"
                  }`}
                >
                  <Frown className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Chat Tone</p>
              <select
                value={chatTone}
                onChange={(e) => setChatTone(e.target.value as ChatTone)}
                className="mt-1 p-1 text-sm border rounded bg-background"
              >
                {Object.entries(toneDescriptions).map(([tone, description]) => (
                  <option key={tone} value={tone}>
                    {tone.charAt(0).toUpperCase() + tone.slice(1)} - {description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2 text-primary" />
            Conversation
          </CardTitle>
          <CardDescription>
            Safe space for open, judgment-free dialogue
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "chat-user ml-auto"
                      : "chat-ai"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="chat-ai">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleListening}
                className={`${isListening ? "bg-destructive/10 text-destructive" : "btn-calm"}`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind..."
                  className="pr-12"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="absolute right-1 top-1 h-8 w-8 btn-therapy"
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="btn-calm"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This AI is designed to provide support but not replace professional therapy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    </AppLayout>
  );
}
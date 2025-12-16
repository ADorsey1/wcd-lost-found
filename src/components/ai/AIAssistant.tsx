import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const initialMessage: Message = {
  id: "1",
  role: "assistant",
  content: "Hi! I'm your Lost & Found assistant. I can help you:\n\n• Search for lost items\n• Guide you through submitting found items\n• Answer questions about the claim process\n• Provide office hours and contact info\n\nHow can I help you today?",
};

// Simple response logic (can be enhanced with AI API later)
function generateResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes("hour") || lowerInput.includes("open") || lowerInput.includes("time")) {
    return "Our office hours are Monday through Friday, 8:00 AM to 4:00 PM. We're located in the Main Office, Room 101.";
  }
  
  if (lowerInput.includes("claim") || lowerInput.includes("get") || lowerInput.includes("pickup")) {
    return "To claim an item:\n\n1. Browse our items or search for what you lost\n2. Click 'Claim This Item' on the matching item\n3. Fill out the claim form with your details\n4. Bring your student ID to the office\n5. Describe any unique features to verify ownership\n\nNeed help finding a specific item?";
  }
  
  if (lowerInput.includes("found") || lowerInput.includes("submit") || lowerInput.includes("turn in")) {
    return "Thank you for wanting to turn in a found item! Here's how:\n\n1. Go to 'Report Found Item' in the menu\n2. Fill out the form with item details\n3. Add a photo if possible\n4. Submit the form\n\nYou can also bring items directly to Room 101 during office hours.";
  }
  
  if (lowerInput.includes("contact") || lowerInput.includes("email") || lowerInput.includes("phone")) {
    return "You can reach us at:\n\n📧 Email: lostandfound@school.edu\n📞 Phone: (555) 123-4567\n📍 Location: Main Office, Room 101";
  }
  
  if (lowerInput.includes("search") || lowerInput.includes("find") || lowerInput.includes("look")) {
    return "To search for your lost item:\n\n1. Go to 'Browse Items'\n2. Use the search bar to search by name\n3. Filter by category (Electronics, Clothing, etc.)\n4. Filter by location where it might have been found\n\nIf you don't find it, check back regularly as new items are added daily!";
  }
  
  if (lowerInput.includes("how long") || lowerInput.includes("keep") || lowerInput.includes("30 day")) {
    return "Items are held for 30 days from the date they were found. After that, unclaimed items may be donated. Make sure to check regularly and claim your items as soon as possible!";
  }
  
  if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
    return "Hello! How can I help you today? I can assist with:\n\n• Finding lost items\n• Reporting found items\n• The claim process\n• Office hours and contact info";
  }
  
  return "I'm not sure I understood that. I can help you with:\n\n• Searching for lost items\n• Reporting found items\n• The claim process\n• Office hours and contact info\n\nWhat would you like to know more about?";
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-105 z-50 ${isOpen ? "hidden" : ""}`}
        size="icon"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent animate-pulse-ring" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] animate-slide-up">
          <div className="rounded-xl border border-border bg-background shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-primary px-4 py-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary-foreground" />
                <span className="font-semibold text-primary-foreground">
                  AI Assistant
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg px-3 py-2 text-sm max-w-[80%] whitespace-pre-line ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-lg bg-muted px-3 py-2">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-border p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

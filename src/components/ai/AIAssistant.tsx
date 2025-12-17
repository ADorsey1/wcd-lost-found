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
  content: "Hi! I'm your EAHS Lost & Found assistant. I can help you:\n\n• Search for lost items\n• Guide you through claiming items\n• Answer questions from the Student Handbook\n• Provide office hours and contact info\n\nHow can I help you today?",
};

// Handbook-powered response logic
function generateResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  // Lost and Found specific
  if (lowerInput.includes("lost and found") || lowerInput.includes("lost item") || lowerInput.includes("where is lost")) {
    return "📍 **Lost and Found Location**\n\nThe lost and found is located in the cafeteria. Valuables such as rings, eyeglasses, and wallets are kept separately and secured in the Main Office.\n\nItems are held until the end of the school year. If an item goes missing, please visit the Security Office in Room B116 to report it.\n\n⚠️ Note: EAHS is not liable for any lost or stolen student possessions.";
  }
  
  if (lowerInput.includes("claim") || lowerInput.includes("get my") || lowerInput.includes("pickup") || lowerInput.includes("pick up")) {
    return "To claim an item:\n\n1. Browse our items or search for what you lost\n2. Click 'Claim This Item' on the matching item\n3. Fill out the claim form with your details\n4. Bring your student ID to verify ownership\n5. Visit the cafeteria lost and found or Main Office for valuables\n\nNeed help finding a specific item?";
  }
  
  if (lowerInput.includes("found") || lowerInput.includes("submit") || lowerInput.includes("turn in") || lowerInput.includes("report found")) {
    return "Thank you for wanting to turn in a found item!\n\n1. Go to 'Report Found Item' in the menu\n2. Fill out the form with item details\n3. Add a photo if possible\n4. Submit the form\n\nYou can also bring items directly to the Main Office or leave them at the cafeteria lost and found.";
  }

  // School hours and schedules
  if (lowerInput.includes("bell") || lowerInput.includes("schedule") || lowerInput.includes("what time") || lowerInput.includes("when does school")) {
    return "📅 **Daily Bell Schedule**\n\n• Block 1 (Per 1-2): 7:20 AM - 8:38 AM\n• Homeroom: 8:38 AM - 8:48 AM\n• Block 2 (Per 3-4): 8:53 AM - 10:11 AM\n• Block 3 (Per 5-6): 10:16 AM - 11:34 AM\n• Block 4 (Per 7-8): 11:39 AM - 12:57 PM\n• Block 5 (Per 9-10): 1:02 PM - 2:20 PM\n\n🚪 Dismissal: 2:20 PM\n\nStudents can enter the cafeteria or gym lobby at 7:05 AM.";
  }

  if (lowerInput.includes("late start") || lowerInput.includes("2 hour") || lowerInput.includes("two hour") || lowerInput.includes("delay")) {
    return "📅 **Two-Hour Late Start Schedule**\n\n• Block 1: 9:20 AM - 10:10 AM\n• Homeroom: 10:10 AM - 10:15 AM\n• Block 2: 10:20 AM - 11:10 AM\n• Block 3: 11:15 AM - 12:15 PM\n• Block 4: 12:20 PM - 1:20 PM\n• Block 5: 1:25 PM - 2:20 PM\n\nDismissal: 2:20 PM";
  }

  // Contact and office info
  if (lowerInput.includes("contact") || lowerInput.includes("phone") || lowerInput.includes("call") || lowerInput.includes("number")) {
    return "📞 **Contact Information**\n\n**Main Office:** 610-250-2481\n\n**Address:**\nEaston Area High School\n2601 William Penn Highway\nEaston, PA 18045\n\n**Security Office:** Room B116\n\n**Lost and Found:** Cafeteria (valuables in Main Office)";
  }

  if (lowerInput.includes("principal") || lowerInput.includes("admin")) {
    return "🏫 **EAHS Administration**\n\n• Head Principal: Mr. Kyle Geiger\n• Principal (A-Dau): Mrs. Deidre Hakimi\n• Principal (Dav-He): Mrs. Jessie Singh\n• Principal (Hi-Mol): Mr. Andrew Menard\n• Principal (Mon-Sce): Mrs. Kendra Durrah\n• Principal (Sch-Z): Mr. Tyler Merrick\n\n📞 Main Office: 610-250-2481";
  }

  // Counselor info
  if (lowerInput.includes("counselor") || lowerInput.includes("guidance") || lowerInput.includes("counseling")) {
    return "👩‍💼 **School Counselors (by last name)**\n\n• A-BRO: Mrs. Young (x32016)\n• BRU-DAU: Mr. Gordon (x32019)\n• DAV-FRE: Mrs. Jayant (x32205)\n• FRI-HE: Mrs. Orlena (x32014)\n• HI-LA: Mr. Okorji (x32044)\n• LE-MOL: Ms. Hunsicker (x32017)\n• MON-PIO: Mrs. Brown (x32046)\n• PIP-SCE: Mrs. Calandra (x32208)\n• SCH-THO: Mrs. Statile (x32013)\n• THR-Z: Mr. Velasquez (x32066)\n\n📞 Counseling Office: 610-250-2481, ext. 32011 or 32018";
  }

  // Library
  if (lowerInput.includes("library")) {
    return "📚 **Library Hours**\n\n• Monday-Friday: 7:10 AM - 2:30 PM\n• Tuesday & Thursday: Extended until 4:00 PM\n\n**Policies:**\n• Books circulate for 3 weeks\n• No fines for overdue books\n• Lost/damaged materials require replacement cost\n• Use SecurlyPass to visit from study hall";
  }

  // Attendance
  if (lowerInput.includes("absent") || lowerInput.includes("attendance") || lowerInput.includes("miss school") || lowerInput.includes("excused")) {
    return "📋 **Attendance Policy**\n\n**Legal excuses:**\n• Personal/family illness\n• Death in immediate family\n• Impassable roads\n• Urgent family reasons\n• Approved family trips\n\n**Key rules:**\n• Parents have 72 hours to report absences\n• Use SafeArrival app or call the office\n• After 3 consecutive days, a doctor's note is required\n• Maximum 10 days with parental notes; beyond that needs doctor's excuse\n• Arriving after 10:58 AM = absent for the day\n\n📞 Contact your Assistant Principal's office for questions.";
  }

  if (lowerInput.includes("tardy") || lowerInput.includes("late to school") || lowerInput.includes("arrive late")) {
    return "⏰ **Tardy Policy**\n\n• Students must be in class by 7:20 AM\n• Late arrivals get a ScholarChip pass\n• Every 5 unexcused tardies = 1 after-school detention\n• Arriving after 10:58 AM = marked absent\n\n**Tardy codes:**\n• X = Excused tardy\n• T = Unexcused tardy\n• L = Late to class";
  }

  // Grades
  if (lowerInput.includes("grade") || lowerInput.includes("grading") || lowerInput.includes("gpa") || lowerInput.includes("report card")) {
    return "📊 **Grading Scale**\n\n• A: 90-100\n• B: 80-89\n• C: 70-79\n• D: 60-69\n• F: Below 60 (No Credit)\n\n**Final Grade Calculation:**\n• Semester courses: 45% per marking period + 10% final exam\n• Full year courses: 22.5% per marking period + 10% final exam\n\n**Weighting:**\n• AP courses: +9% on grades 60-100\n• Honors courses: +6% on grades 60-100\n\nReport cards are electronic via PowerSchool.";
  }

  // Graduation
  if (lowerInput.includes("graduat") || lowerInput.includes("diploma") || lowerInput.includes("credit") || lowerInput.includes("requirement")) {
    return "🎓 **Graduation Requirements (24.5 credits minimum)**\n\n• English: 4 units\n• Social Studies: 4 units\n• Science: 3 units (Biology required)\n• Mathematics: 3 units\n• Physical Education: 2 units\n• Health: 0.5 units\n• Electives: 8 units\n\n**Also required:**\n• Shadow Day Experience (by end of Junior year)\n• Must attend graduation practice to participate in ceremony";
  }

  // Lockers
  if (lowerInput.includes("locker")) {
    return "🔐 **Locker Policy**\n\n• Assigned by Assistant Principal's office upon request\n• Keep locked at all times\n• No sharing lockers\n• No writing or attaching items outside\n• Subject to search by school officials\n• Remove all items by end of school year\n\n⚠️ School is not responsible for lost/stolen items.";
  }

  // Parking
  if (lowerInput.includes("parking") || lowerInput.includes("drive") || lowerInput.includes("car")) {
    return "🚗 **Parking Information**\n\n• Only Juniors and Seniors can apply\n• Parking tag cost: $5.00\n• Apply via Google Form during summer\n• Student parking: D lot, V lot, portions of H lot\n• Speed limit: 15 MPH on campus\n• No smoking/vaping in cars on property\n• Lost tag replacement: $25.00 (Room B116)\n\n⚠️ EAHS is not responsible for vehicle damage or theft.";
  }

  // Nurse/Medical
  if (lowerInput.includes("nurse") || lowerInput.includes("medical") || lowerInput.includes("sick") || lowerInput.includes("health")) {
    return "🏥 **Health Services**\n\n**Nurse Locations:**\n• Grades 9-10: Room D112 (by main gym)\n• Grades 11-12: Room C203 (by cafeteria)\n\n**Policies:**\n• Use SecurlyPass to visit (emergencies accepted anytime)\n• Nurse must assess students before going home\n• Medication requires authorization form + original container\n• Elevator keys: $10 deposit at Security Office B116";
  }

  // Cheating
  if (lowerInput.includes("cheat") || lowerInput.includes("plagiar")) {
    return "⚠️ **Cheating & Plagiarism Policy**\n\nCheating or plagiarism results in:\n• Zero (0) grade on test/paper\n• Person giving information may also receive zero\n• Seniors may lose privileges\n• Teachers will contact parents\n\nStudents must be familiar with copyright and Internet use policies.";
  }

  // Dress code
  if (lowerInput.includes("dress") || lowerInput.includes("clothes") || lowerInput.includes("wear")) {
    return "👕 **Dress Code**\n\nStudents must dress to meet standards of safety and health, and not cause disruption to the educational process.\n\nFor specific dress code guidelines, please refer to the Student Handbook or contact your Assistant Principal's office.";
  }

  // Leaving campus
  if (lowerInput.includes("leave") || lowerInput.includes("campus") || lowerInput.includes("building")) {
    return "🚪 **Leaving Campus Policy**\n\n• Cannot leave without principal permission once on campus\n• First offense: 2 days ISS\n• Subsequent: 2 days OSS\n• Enter/exit only through main entrance or gym lobby\n• Must swipe ID in/out\n• Opening doors for others: 3 days OSS\n\n⚠️ Freshmen, Sophomores, and Juniors cannot leave during lunch, study hall, or advisory.";
  }

  // Working papers
  if (lowerInput.includes("work") && (lowerInput.includes("paper") || lowerInput.includes("permit"))) {
    return "📝 **Working Papers**\n\nStudents ages 14-18 need a work permit:\n\n1. Download application from EAHS website (Students or Parents section)\n2. Email to Mrs. Negron: negront@eastonsd.org\n3. Bring valid ID and proof of age to pick up\n\n📞 Contact: 610-250-2460 ext. 32006\n📍 Mrs. Negron's office: Front desk security";
  }

  // General greetings
  if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey") || lowerInput.includes("help")) {
    return "Hello, Red Rover! 🔴 How can I help you today?\n\nI can answer questions about:\n• Lost and Found\n• Bell schedules & school hours\n• Attendance & tardy policies\n• Grading & graduation requirements\n• Counselors & administration\n• Library, parking, lockers\n• And more from the Student Handbook!\n\nWhat would you like to know?";
  }

  if (lowerInput.includes("thank")) {
    return "You're welcome! If you have any other questions about lost items or school policies, feel free to ask. Go Rovers! 🔴";
  }

  // Default response
  return "I'm not sure I understood that. I can help you with:\n\n• **Lost and Found** - locations, claiming items\n• **School Hours** - bell schedules, late start\n• **Contacts** - principals, counselors, offices\n• **Policies** - attendance, grading, parking\n• **And more** from the Student Handbook!\n\nWhat would you like to know about?";
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
                  EAHS Assistant
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
                  placeholder="Ask about lost items or school info..."
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

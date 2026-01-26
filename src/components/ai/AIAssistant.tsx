import { useEffect } from "react";

declare global {
  interface Window {
    embeddedChatbotConfig?: {
      chatbotId: string;
      domain: string;
    };
  }
}

export function AIAssistant() {
  useEffect(() => {
    // Set Chatbase config
    window.embeddedChatbotConfig = {
      chatbotId: "dNP6fgT1kE4T_xVxug5IK",
      domain: "www.chatbase.co"
    };

    // Load Chatbase script
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.setAttribute("chatbotId", "dNP6fgT1kE4T_xVxug5IK");
    script.setAttribute("domain", "www.chatbase.co");
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      document.body.removeChild(script);
    };
  }, []);

  return null;
}

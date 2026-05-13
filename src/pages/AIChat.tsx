import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import CRTMonitorScene from "@/components/CRTMonitorScene";

interface Conversation {
  id: string;
  title: string;
  question: string;
  answer: string;
  date: string;
}

const AIChat = () => {
  const [inputText, setInputText] = useState("");
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [journeyComplete, setJourneyComplete] = useState(false);
  
  const [displayResponse, setDisplayResponse] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const tokenQueueRef = useRef<string[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Helper to generate a simple browser fingerprint (from original scene)
  const getFingerprint = useCallback(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("fingerprint", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("fingerprint", 4, 17);
    }
    return (canvas.toDataURL().slice(-50) + navigator.userAgent.slice(0, 50)).replace(/[^a-zA-Z0-9]/g, "");
  }, []);

  const processTokenQueue = useCallback(() => {
    if (tokenQueueRef.current.length > 0) {
      const chunk = tokenQueueRef.current.splice(0, 3).join('');
      setDisplayResponse(prev => prev + chunk);
      animationFrameRef.current = requestAnimationFrame(processTokenQueue);
    } else {
      setIsLoadingAI(false);
      animationFrameRef.current = null;
    }
  }, []);

  const saveConversation = (q: string, a: string) => {
    try {
      const existing = localStorage.getItem("usn-ki-conversations");
      const conversations: Conversation[] = existing ? JSON.parse(existing) : [];
      // FK10: Auto-tittel fra de første 40 tegnene i meldingen
      const title = q.length > 40 ? q.slice(0, 40) + "..." : q;
      
      const newConv: Conversation = {
        id: crypto.randomUUID(),
        title,
        question: q,
        answer: a,
        date: new Date().toISOString()
      };
      
      localStorage.setItem("usn-ki-conversations", JSON.stringify([newConv, ...conversations]));
    } catch (e) {
      console.error("Failed to save conversation", e);
    }
  };

  const startAIStream = useCallback(async (question: string) => {
    setIsLoadingAI(true);
    setDisplayResponse("");
    setAiError(null);
    tokenQueueRef.current = [];
    
    abortRef.current = new AbortController();

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: { session } } = await supabase.auth.getSession();

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (session) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      } else {
        headers["Authorization"] = `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`;
        headers["x-client-fingerprint"] = getFingerprint();
      }

      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ question }),
        signal: abortRef.current.signal
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Feil ${resp.status}`);
      }

      const data = await resp.json();
      const answer = (data?.answer as string) ?? "";
      
      saveConversation(question, answer);

      // Start typewriter effect
      tokenQueueRef.current = answer.split('');
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(processTokenQueue);
      }

    } catch (e: any) {
      if (e.name === "AbortError") {
        console.log("Chat aborted");
      } else {
        console.error("AI stream error:", e);
        setAiError(e instanceof Error ? e.message : "Ukjent feil");
        setIsLoadingAI(false);
      }
    }
  }, [getFingerprint, processTokenQueue]);

  const handleAbort = useCallback(() => {
    // Avbryt nettverkskall
    if (abortRef.current) {
      abortRef.current.abort();
    }
    // Avbryt typewriter animasjon
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    tokenQueueRef.current = [];
    
    // UC7: Resetter tilbake til startskjermen slik brukeren ba om
    setJourneyStarted(false);
    setIntroDone(false);
    setJourneyComplete(false);
    setInputText("");
    setDisplayResponse("");
    setIsLoadingAI(false);
    setAiError(null);
  }, []);

  const handleJourneyComplete = useCallback(() => {
    setJourneyComplete(true);
  }, []);

  return (
    <section className="relative bg-[#050a05]">
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center bg-[#050a05]">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#0aff0a]/30 border-t-[#0aff0a]" />
              <p className="font-mono text-sm text-[#0aff0a]/60">Laster 3D-scene...</p>
            </div>
          </div>
        }
      >
        <CRTMonitorScene 
          inputText={inputText}
          setInputText={setInputText}
          journeyStarted={journeyStarted}
          setJourneyStarted={setJourneyStarted}
          introDone={introDone}
          setIntroDone={setIntroDone}
          journeyComplete={journeyComplete}
          onJourneyComplete={handleJourneyComplete}
          aiResponse={displayResponse}
          isLoadingAI={isLoadingAI}
          aiError={aiError}
          startAIStream={startAIStream}
          onAbort={handleAbort}
        />
      </Suspense>
    </section>
  );
};

export default AIChat;

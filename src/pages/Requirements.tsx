import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mic, MicOff, ArrowRight, Lightbulb } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useApp } from "@/lib/context";
import { validateRequirements, validateEmail } from "@/lib/validation";
import { supabase } from "@/lib/supabase";

const SUGGESTIONS = [
  "Your profession or role (e.g., freelance designer, startup founder)",
  "The problem you want to solve (e.g., manage projects, design social media posts)",
  "Your monthly budget (e.g., free, under ₹500, ₹2000+)",
  "Tools you've already tried and didn't like",
  "Must-have features or integrations",
  "Team size or solo use",
];

export default function Requirements() {
  const navigate = useNavigate();
  const { state, setState } = useApp();
  const [text, setText] = useState(state.requirements);
  const [email, setEmail] = useState(state.email);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    if (w.SpeechRecognition || w.webkitSpeechRecognition) setSpeechSupported(true);
  }, []);

  const toggleSpeech = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const w = window as unknown as Record<string, unknown>;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SR as any)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognitionRef.current = recognition;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText(transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
    setListening(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const reqValidation = validateRequirements(text);
    if (!reqValidation.valid) {
      setError(reqValidation.message || "Invalid requirements");
      return;
    }

    if (email) {
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        setError(emailValidation.message || "Invalid email");
        return;
      }
    }

    setLoading(true);
    setState((prev) => ({ ...prev, requirements: text, email }));

    try {
      if (email) {
        await supabase.from("leads").insert({
          email,
          profession: "general",
          problem: text.substring(0, 200),
          budget: "not specified",
          tools_tried: null,
        }).then(() => {});
      }
    } catch {
      // non-blocking
    }

    navigate("/loading-result");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Tell us what you need
          </h1>
          <p className="text-text-muted max-w-lg mx-auto">
            Describe your requirements in your own words. The more detail you give, the better our AI can find your perfect tool.
          </p>
        </div>

        <div className="mb-6 bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">What to include</span>
          </div>
          <ul className="space-y-1">
            {SUGGESTIONS.map((s) => (
              <li key={s} className="text-sm text-text-muted flex items-start gap-2">
                <span className="text-primary mt-0.5">&#8226;</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`E.g., "I'm a freelance graphic designer struggling to manage client projects and invoices. I've tried Trello but it's too basic. Need something with time tracking and Indian payment integration. Budget under ₹1,000/month."`}
              maxLength={2000}
              rows={6}
              className="w-full bg-surface border border-border-custom rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 resize-none pr-12"
            />
            {speechSupported && (
              <button
                type="button"
                onClick={toggleSpeech}
                className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-200 ${
                  listening
                    ? "bg-red-500/20 text-red-400 animate-pulse"
                    : "bg-surface text-text-muted hover:text-primary hover:bg-primary/10"
                }`}
                title={listening ? "Stop recording" : "Start voice input"}
              >
                {listening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}
            {listening && (
              <div className="absolute bottom-2 left-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-red-400">Listening...</span>
              </div>
            )}
          </div>

          <div className="text-right text-xs text-text-muted">
            {text.length}/2000
          </div>

          <Input
            type="email"
            placeholder="your@email.com (optional — for deals & updates)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" className="w-full text-lg py-4" disabled={loading}>
            {loading ? (
              "Analyzing..."
            ) : (
              <>
                Find My Perfect Tool <ArrowRight size={20} className="ml-2 inline" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-text-muted">
          Our AI searches the internet for the latest tools and real working coupon codes.
        </p>
      </motion.div>
    </div>
  );
}

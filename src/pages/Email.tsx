import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useQuiz } from "@/lib/context";
import { validateEmail } from "@/lib/validation";
import { supabase } from "@/lib/supabase";

export default function Email() {
  const navigate = useNavigate();
  const { state, setState } = useQuiz();
  const [email, setEmail] = useState(state.email);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validation = validateEmail(email);
    if (!validation.valid) {
      setError(validation.message || "Invalid email");
      return;
    }

    setLoading(true);
    setState((prev) => ({ ...prev, email }));

    try {
      const { error: dbError } = await supabase.from("leads").insert({
        email,
        profession: state.profession,
        problem: state.problem,
        budget: state.budget,
        tools_tried: state.tools_tried || null,
      });

      if (dbError) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      navigate("/loading-result");
    } catch {
      setError("Connection issue. Please check your internet.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-md mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">&#10003;</span>
        </div>

        <h1 className="text-2xl font-semibold mb-2">
          Your perfect tool match is ready!
        </h1>
        <p className="text-text-muted mb-8">
          Enter your email to see your result + exclusive coupon code
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Show My Match \u2192"}
          </Button>
        </form>

        <p className="mt-4 text-xs text-text-muted">
          No spam. Just your result and occasional tool deals.
        </p>
      </motion.div>
    </div>
  );
}

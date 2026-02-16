import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CodeEntryScreenProps {
  onVerified: () => void;
  onBack: () => void;
}

const CodeEntryScreen = ({ onVerified, onBack }: CodeEntryScreenProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== 8) {
      toast({ title: "请输入8位验证码", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-code", {
        body: { code: trimmed },
      });

      if (error) {
        toast({ title: "验证失败，请稍后重试", variant: "destructive" });
        return;
      }

      if (data.valid) {
        toast({ title: "验证成功！即将开始测评 ✨" });
        setTimeout(onVerified, 600);
      } else {
        toast({ title: data.error || "验证码无效", variant: "destructive" });
      }
    } catch {
      toast({ title: "网络错误，请稍后重试", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <div className="blur-circle w-72 h-72 bg-primary/15 top-20 -right-20" />
      <div className="blur-circle w-60 h-60 bg-accent/20 bottom-20 -left-20" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <ShieldCheck className="w-8 h-8 text-primary" />
          </motion.div>

          <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
            输入专属验证码
          </h2>
          <p className="text-muted-foreground font-serif mb-8 text-sm leading-relaxed">
            请输入您购买后获得的8位验证码，每个验证码仅可使用一次
          </p>

          <div className="space-y-4">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 8))}
              placeholder="例如：A3K9M2X7"
              className="text-center text-xl tracking-[0.3em] font-mono h-14 bg-background/50 border-primary/20 focus:border-primary/50"
              maxLength={8}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />

            <Button
              onClick={handleSubmit}
              disabled={loading || code.trim().length !== 8}
              className="w-full py-6 text-base rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  验证中...
                </>
              ) : (
                "验证并开始测评"
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground/70 mt-6 font-serif">
            验证码可通过小红书店铺购买获取
          </p>
        </div>

        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </motion.button>
      </motion.div>
    </section>
  );
};

export default CodeEntryScreen;

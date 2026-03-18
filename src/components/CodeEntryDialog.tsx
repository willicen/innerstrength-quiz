import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CodeEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
}

const CodeEntryDialog = ({ open, onOpenChange, onVerified }: CodeEntryDialogProps) => {
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
        setTimeout(() => {
          onOpenChange(false);
          onVerified();
        }, 600);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-card border-primary/20">
        <DialogHeader className="text-center items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2"
          >
            <ShieldCheck className="w-7 h-7 text-primary" />
          </motion.div>
          <DialogTitle className="text-xl font-display font-semibold text-foreground">
            输入专属兑换码
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-serif text-sm">
            请输入您购买后获得的8位兑换码，每个兑换码仅可使用一次
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
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

        <p className="text-xs text-muted-foreground/70 text-center font-serif">
          兑换码可通过小红书店铺购买获取
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default CodeEntryDialog;

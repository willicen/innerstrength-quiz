import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onStartQuiz: () => void;
}

const HeroSection = ({ onStartQuiz }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Decorative background elements */}
      <div className="blur-circle w-96 h-96 bg-primary/20 -top-48 -right-48" />
      <div className="blur-circle w-80 h-80 bg-accent/25 -bottom-40 -left-40" />
      <div className="blur-circle w-64 h-64 bg-lavender/30 top-1/3 right-1/4" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Brand badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
        >
          <Heart className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">东亮情感陪伴</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight text-foreground mb-6 leading-tight"
        >
          分手自愈与
          <br />
          <span className="text-gradient-warm">自我重建</span>
          深度测评
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground font-serif leading-relaxed mb-4 max-w-xl mx-auto"
        >
          不教讨好，只练底气
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-base text-muted-foreground/80 font-serif leading-relaxed mb-10 max-w-lg mx-auto"
        >
          通过科学的情感评估，发现你内在的力量源泉，
          开启属于你的自我重建之旅
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Button
            onClick={onStartQuiz}
            size="lg"
            className="group relative px-8 py-6 text-lg font-medium rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            开始测评
          </Button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/60" />
            <span>5分钟完成</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent/60" />
            <span>专业分析</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-lavender" />
            <span>个性化建议</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

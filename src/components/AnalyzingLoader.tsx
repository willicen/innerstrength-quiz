import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Star } from "lucide-react";

const healingQuotes = [
  "治愈需要时间，而你做得很好",
  "每一次心碎，都是重建自我的机会",
  "你的感受是有效的，给自己一些温柔",
  "真正的力量来自内心的平静",
  "接受不完美，拥抱真实的自己",
  "你值得被爱，首先从爱自己开始",
];

interface AnalyzingLoaderProps {
  onComplete: () => void;
}

const AnalyzingLoader = ({ onComplete }: AnalyzingLoaderProps) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through quotes
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % healingQuotes.length);
    }, 2000);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="blur-circle w-96 h-96 bg-primary/20"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "20%", left: "10%" }}
        />
        <motion.div
          className="blur-circle w-80 h-80 bg-accent/25"
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "20%", right: "10%" }}
        />
        <motion.div
          className="blur-circle w-64 h-64 bg-lavender/30"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "40%", right: "30%" }}
        />
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Animated heart icon */}
        <motion.div
          className="mb-8 inline-flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center pulse-glow">
              <Heart className="w-12 h-12 text-primary fill-primary/30" />
            </div>
            {/* Orbiting sparkles */}
            <motion.div
              className="absolute"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ top: "-8px", left: "50%", marginLeft: "-8px" }}
            >
              <Sparkles className="w-4 h-4 text-accent" />
            </motion.div>
            <motion.div
              className="absolute"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{ bottom: "-8px", left: "50%", marginLeft: "-8px" }}
            >
              <Star className="w-4 h-4 text-lavender" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-4"
        >
          正在分析你的情感能量...
        </motion.h2>

        {/* Rotating quotes */}
        <div className="h-16 flex items-center justify-center mb-8">
          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg font-serif text-muted-foreground italic"
          >
            "{healingQuotes[quoteIndex]}"
          </motion.p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs mx-auto">
          <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-sm text-muted-foreground">{progress}%</p>
        </div>
      </div>
    </section>
  );
};

export default AnalyzingLoader;

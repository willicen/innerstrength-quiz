import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface EmotionalGaugeProps {
  score: number;
}

const EmotionalGauge = ({ score }: EmotionalGaugeProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);
    return () => clearTimeout(timer);
  }, [score]);

  // Calculate the stroke dash offset for the arc
  const radius = 80;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Get color based on score
  const getScoreColor = () => {
    if (score >= 75) return "hsl(var(--primary))";
    if (score >= 50) return "hsl(var(--accent))";
    return "hsl(var(--highlight))";
  };

  const getScoreLabel = () => {
    if (score >= 75) return "良好";
    if (score >= 50) return "恢复中";
    return "需要关注";
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width="200"
        height="120"
        viewBox="0 0 200 120"
        className="overflow-visible"
      >
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Animated progress arc */}
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={getScoreColor()}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        />

        {/* Glow effect */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Score indicator dot */}
        <motion.circle
          cx="100"
          cy="100"
          r="4"
          fill={getScoreColor()}
          filter="url(#glow)"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            cx: 100 + 80 * Math.cos(Math.PI - (animatedScore / 100) * Math.PI),
            cy: 100 - 80 * Math.sin((animatedScore / 100) * Math.PI),
          }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        />
      </svg>

      {/* Score display */}
      <div className="absolute bottom-0 text-center">
        <motion.div
          className="text-4xl font-display font-bold"
          style={{ color: getScoreColor() }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {animatedScore}
        </motion.div>
        <motion.div
          className="text-sm text-muted-foreground mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {getScoreLabel()}
        </motion.div>
      </div>

      {/* Scale labels */}
      <div className="absolute w-full flex justify-between px-2" style={{ bottom: "40px" }}>
        <span className="text-xs text-muted-foreground">0</span>
        <span className="text-xs text-muted-foreground">100</span>
      </div>
    </div>
  );
};

export default EmotionalGauge;

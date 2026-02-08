import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="mb-10">
      {/* Question counter */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-muted-foreground">
          问题 {current + 1} / {total}
        </span>
        <span className="text-sm font-medium text-primary">
          {Math.round(progress)}% 完成
        </span>
      </div>

      {/* Progress track */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mt-3">
        {Array.from({ length: total }).map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index <= current ? "bg-primary" : "bg-muted"
            }`}
            initial={{ scale: 0.8 }}
            animate={{ scale: index === current ? 1.2 : 1 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;

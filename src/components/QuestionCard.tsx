import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Option {
  text: string;
  value: number;
}

interface QuestionCardProps {
  question: string;
  options: Option[];
  selectedValue: number | null;
  onSelect: (value: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard = ({
  question,
  options,
  selectedValue,
  onSelect,
}: QuestionCardProps) => {
  return (
    <div className="glass-card p-8 md:p-10">
      {/* Question text */}
      <h2 className="text-xl md:text-2xl font-display font-medium text-foreground leading-relaxed mb-8">
        {question}
      </h2>

      {/* Options */}
      <div className="space-y-4">
        {options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => onSelect(option.value)}
            className={`quiz-option w-full text-left flex items-center gap-4 ${
              selectedValue === option.value ? "selected" : ""
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Selection indicator */}
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                selectedValue === option.value
                  ? "border-primary bg-primary"
                  : "border-border"
              }`}
            >
              {selectedValue === option.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}
            </div>

            {/* Option text */}
            <span
              className={`font-serif text-base md:text-lg transition-colors duration-300 ${
                selectedValue === option.value
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {option.text}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;

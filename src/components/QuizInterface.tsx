import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";

interface Question {
  id: number;
  category: "internal_friction" | "dependency" | "confidence";
  question: string;
  options: {
    text: string;
    value: number;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    category: "internal_friction",
    question: "当你独处时，脑海中是否经常重复回放过去的对话或场景？",
    options: [
      { text: "几乎从不，我很少沉溺于过去", value: 4 },
      { text: "偶尔会，但很快就能放下", value: 3 },
      { text: "经常会，有时难以控制", value: 2 },
      { text: "总是如此，几乎无法停止", value: 1 },
    ],
  },
  {
    id: 2,
    category: "internal_friction",
    question: "你是否经常因为担心别人的看法而改变自己的决定？",
    options: [
      { text: "我坚持自己的选择，不太在意他人看法", value: 4 },
      { text: "有时会考虑，但最终遵从内心", value: 3 },
      { text: "经常会，别人的意见对我影响很大", value: 2 },
      { text: "总是如此，我很难做出独立决定", value: 1 },
    ],
  },
  {
    id: 3,
    category: "dependency",
    question: "分手后，你觉得自己的生活还有多少意义？",
    options: [
      { text: "生活依然充实，我有很多值得期待的事", value: 4 },
      { text: "虽然失落，但我知道会好起来的", value: 3 },
      { text: "感觉很空虚，不知道该做什么", value: 2 },
      { text: "觉得一切都没有意义了", value: 1 },
    ],
  },
  {
    id: 4,
    category: "dependency",
    question: "你是否经常想要联系前任，或者查看对方的社交动态？",
    options: [
      { text: "完全不想，我已经放下了", value: 4 },
      { text: "偶尔会想，但能控制住自己", value: 3 },
      { text: "经常忍不住想要联系或查看", value: 2 },
      { text: "每天都在关注，无法停止", value: 1 },
    ],
  },
  {
    id: 5,
    category: "confidence",
    question: "你如何看待这段感情的结束？",
    options: [
      { text: "这是成长的一部分，我从中学到很多", value: 4 },
      { text: "虽然遗憾，但接受这个结果", value: 3 },
      { text: "觉得是自己的问题导致了分手", value: 2 },
      { text: "认为自己不值得被爱", value: 1 },
    ],
  },
  {
    id: 6,
    category: "confidence",
    question: "对于未来的感情，你有什么样的期待？",
    options: [
      { text: "相信会遇到更适合的人", value: 4 },
      { text: "需要时间，但对未来保持开放", value: 3 },
      { text: "害怕再次受伤，不敢期待", value: 2 },
      { text: "觉得自己不会再有好的感情了", value: 1 },
    ],
  },
  {
    id: 7,
    category: "internal_friction",
    question: "当遇到困难时，你通常如何应对？",
    options: [
      { text: "积极寻找解决方案", value: 4 },
      { text: "虽然焦虑，但会努力克服", value: 3 },
      { text: "容易陷入负面情绪中", value: 2 },
      { text: "感到无助，不知所措", value: 1 },
    ],
  },
];

interface QuizInterfaceProps {
  onComplete: (answers: Record<number, number>) => void;
  onBack: () => void;
}

const QuizInterface = ({ onComplete, onBack }: QuizInterfaceProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canGoNext = selectedOption !== null;

  const handleOptionSelect = (value: number) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswers = { ...answers, [question.id]: selectedOption };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      onComplete(newAnswers);
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(answers[questions[currentQuestion + 1]?.id] ?? null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion === 0) {
      onBack();
    } else {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedOption(answers[questions[currentQuestion - 1]?.id] ?? null);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Background decorations */}
      <div className="blur-circle w-72 h-72 bg-primary/15 top-20 -right-20" />
      <div className="blur-circle w-60 h-60 bg-accent/20 bottom-20 -left-20" />

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Progress bar */}
        <ProgressBar current={currentQuestion} total={questions.length} />

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <QuestionCard
              question={question.question}
              options={question.options}
              selectedValue={selectedOption}
              onSelect={handleOptionSelect}
              questionNumber={currentQuestion + 1}
              totalQuestions={questions.length}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between items-center mt-8"
        >
          <Button
            variant="ghost"
            onClick={handlePrevious}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentQuestion === 0 ? "返回首页" : "上一题"}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canGoNext}
            className="flex items-center gap-2 px-6 py-5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isLastQuestion ? "查看结果" : "下一题"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default QuizInterface;

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import QuizInterface from "@/components/QuizInterface";
import AnalyzingLoader from "@/components/AnalyzingLoader";
import ResultsDashboard from "@/components/ResultsDashboard";

type Stage = "hero" | "quiz" | "analyzing" | "results";

const Index = () => {
  const [stage, setStage] = useState<Stage>("hero");
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleStartQuiz = () => {
    setStage("quiz");
  };

  const handleQuizComplete = (quizAnswers: Record<number, number>) => {
    setAnswers(quizAnswers);
    setStage("analyzing");
  };

  const handleAnalysisComplete = () => {
    setStage("results");
  };

  const handleRestart = () => {
    setAnswers({});
    setStage("hero");
  };

  const handleBackToHero = () => {
    setStage("hero");
  };

  return (
    <main className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {stage === "hero" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeroSection onStartQuiz={handleStartQuiz} />
          </motion.div>
        )}

        {stage === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <QuizInterface onComplete={handleQuizComplete} onBack={handleBackToHero} />
          </motion.div>
        )}

        {stage === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnalyzingLoader onComplete={handleAnalysisComplete} />
          </motion.div>
        )}

        {stage === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResultsDashboard answers={answers} onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Index;

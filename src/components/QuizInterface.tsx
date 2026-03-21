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
  // === 内耗维度 (10题) ===
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
    category: "internal_friction",
    question: "当遇到困难时，你通常如何应对？",
    options: [
      { text: "积极寻找解决方案", value: 4 },
      { text: "虽然焦虑，但会努力克服", value: 3 },
      { text: "容易陷入负面情绪中", value: 2 },
      { text: "感到无助，不知所措", value: 1 },
    ],
  },
  {
    id: 4,
    category: "internal_friction",
    question: "你是否经常在做完一个决定后反复怀疑自己？",
    options: [
      { text: "很少，我对自己的判断有信心", value: 4 },
      { text: "偶尔会，但不影响执行", value: 3 },
      { text: "经常反复纠结，消耗精力", value: 2 },
      { text: "几乎每个决定都让我痛苦", value: 1 },
    ],
  },
  {
    id: 5,
    category: "internal_friction",
    question: "睡前你的大脑是否会不自觉地「翻旧账」？",
    options: [
      { text: "不会，我入睡很快", value: 4 },
      { text: "偶尔会，但能调节", value: 3 },
      { text: "经常失眠想事情", value: 2 },
      { text: "几乎每晚都在反刍痛苦回忆", value: 1 },
    ],
  },
  {
    id: 6,
    category: "internal_friction",
    question: "你是否觉得自己总在为还没发生的事焦虑？",
    options: [
      { text: "很少，我更关注当下", value: 4 },
      { text: "有时会，但能理性看待", value: 3 },
      { text: "经常焦虑未来的不确定性", value: 2 },
      { text: "对未来充满恐惧和担忧", value: 1 },
    ],
  },
  {
    id: 7,
    category: "internal_friction",
    question: "当别人无意间的一句话让你不舒服时，你会怎样？",
    options: [
      { text: "不太在意，很快就忘了", value: 4 },
      { text: "会想一下，但能释然", value: 3 },
      { text: "反复琢磨对方的意思", value: 2 },
      { text: "可能会为此难受好几天", value: 1 },
    ],
  },
  {
    id: 8,
    category: "internal_friction",
    question: "你是否常常觉得「明明很累，却什么都没做」？",
    options: [
      { text: "不会，我的精力管理很好", value: 4 },
      { text: "偶尔有这种感觉", value: 3 },
      { text: "经常感到精神疲惫", value: 2 },
      { text: "每天都在精神内耗中度过", value: 1 },
    ],
  },
  {
    id: 9,
    category: "internal_friction",
    question: "遇到矛盾时，你是否习惯性地先怪自己？",
    options: [
      { text: "会客观分析，不会一味自责", value: 4 },
      { text: "有时会，但能调整", value: 3 },
      { text: "总觉得是自己的错", value: 2 },
      { text: "深深地自我否定和自责", value: 1 },
    ],
  },
  {
    id: 10,
    category: "internal_friction",
    question: "你是否经常感到情绪起伏很大，难以稳定？",
    options: [
      { text: "情绪比较稳定", value: 4 },
      { text: "偶尔波动，但可控", value: 3 },
      { text: "经常情绪化，影响生活", value: 2 },
      { text: "情绪像过山车，完全失控", value: 1 },
    ],
  },
  // === 依赖维度 (10题) ===
  {
    id: 11,
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
    id: 12,
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
    id: 13,
    category: "dependency",
    question: "你觉得离开对方后，自己还是完整的吗？",
    options: [
      { text: "当然，我本身就是完整的个体", value: 4 },
      { text: "有些缺失感，但在恢复中", value: 3 },
      { text: "觉得自己缺了一部分", value: 2 },
      { text: "感觉自己什么都不是了", value: 1 },
    ],
  },
  {
    id: 14,
    category: "dependency",
    question: "你是否把对方当作你快乐的唯一来源？",
    options: [
      { text: "不是，我有很多快乐的来源", value: 4 },
      { text: "曾经有些依赖，现在在改变", value: 3 },
      { text: "对方确实是我最大的快乐来源", value: 2 },
      { text: "没有对方，我完全感受不到快乐", value: 1 },
    ],
  },
  {
    id: 15,
    category: "dependency",
    question: "独处时你是否感到强烈的不安或恐惧？",
    options: [
      { text: "享受独处时光", value: 4 },
      { text: "偶尔不安，但能接受", value: 3 },
      { text: "很难忍受独处", value: 2 },
      { text: "独处让我感到极度恐惧", value: 1 },
    ],
  },
  {
    id: 16,
    category: "dependency",
    question: "你是否会为了维持关系而放弃自己的底线？",
    options: [
      { text: "不会，底线不可妥协", value: 4 },
      { text: "偶尔妥协，但会反思", value: 3 },
      { text: "经常委曲求全", value: 2 },
      { text: "为了不被抛弃可以放弃一切", value: 1 },
    ],
  },
  {
    id: 17,
    category: "dependency",
    question: "你是否觉得只有在恋爱中才能确认自己的价值？",
    options: [
      { text: "我的价值与恋爱无关", value: 4 },
      { text: "有些影响，但不是全部", value: 3 },
      { text: "被爱才觉得自己有价值", value: 2 },
      { text: "没有人爱我就一文不值", value: 1 },
    ],
  },
  {
    id: 18,
    category: "dependency",
    question: "分手后你是否急于寻找下一段感情来填补空虚？",
    options: [
      { text: "不会，我会先好好爱自己", value: 4 },
      { text: "有点冲动，但能克制", value: 3 },
      { text: "很想马上找到替代", value: 2 },
      { text: "无法忍受没有人陪伴的日子", value: 1 },
    ],
  },
  {
    id: 19,
    category: "dependency",
    question: "你是否经常需要对方的肯定才能安心？",
    options: [
      { text: "我能自我肯定", value: 4 },
      { text: "偶尔需要，但不依赖", value: 3 },
      { text: "非常需要对方的认可", value: 2 },
      { text: "没有对方的肯定就极度不安", value: 1 },
    ],
  },
  {
    id: 20,
    category: "dependency",
    question: "回忆这段感情时，你是否美化了对方和这段关系？",
    options: [
      { text: "能客观看待优缺点", value: 4 },
      { text: "有些美化，但能清醒", value: 3 },
      { text: "觉得对方哪里都好", value: 2 },
      { text: "完全活在美化的回忆里", value: 1 },
    ],
  },
  // === 自信维度 (10题) ===
  {
    id: 21,
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
    id: 22,
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
    id: 23,
    category: "confidence",
    question: "你觉得自己有哪些独特的优点？",
    options: [
      { text: "我能说出很多自己的优点", value: 4 },
      { text: "有一些，但不太确定", value: 3 },
      { text: "很难想到自己的优点", value: 2 },
      { text: "觉得自己没有什么优点", value: 1 },
    ],
  },
  {
    id: 24,
    category: "confidence",
    question: "面对陌生的社交场合，你的感受是？",
    options: [
      { text: "自信从容，享受认识新朋友", value: 4 },
      { text: "有些紧张，但能应对", value: 3 },
      { text: "很不自在，想要逃避", value: 2 },
      { text: "极度恐惧，觉得别人会看不起我", value: 1 },
    ],
  },
  {
    id: 25,
    category: "confidence",
    question: "当你照镜子时，对自己的感觉是？",
    options: [
      { text: "喜欢自己，接纳真实的样子", value: 4 },
      { text: "大体满意，有些小遗憾", value: 3 },
      { text: "经常挑剔自己的外表", value: 2 },
      { text: "非常讨厌镜子里的自己", value: 1 },
    ],
  },
  {
    id: 26,
    category: "confidence",
    question: "当别人夸奖你时，你的内心反应是？",
    options: [
      { text: "坦然接受，觉得自己值得", value: 4 },
      { text: "有些不好意思，但内心高兴", value: 3 },
      { text: "觉得对方只是客气", value: 2 },
      { text: "认为自己根本配不上这些夸奖", value: 1 },
    ],
  },
  {
    id: 27,
    category: "confidence",
    question: "你是否相信自己有能力让生活变得更好？",
    options: [
      { text: "完全相信，我有这个能力", value: 4 },
      { text: "大部分时候相信", value: 3 },
      { text: "不太确定，经常怀疑自己", value: 2 },
      { text: "觉得自己什么都做不好", value: 1 },
    ],
  },
  {
    id: 28,
    category: "confidence",
    question: "失败或犯错后，你如何对待自己？",
    options: [
      { text: "总结经验，鼓励自己再试", value: 4 },
      { text: "虽然难过，但能原谅自己", value: 3 },
      { text: "严厉批评自己很长时间", value: 2 },
      { text: "觉得自己就是个失败者", value: 1 },
    ],
  },
  {
    id: 29,
    category: "confidence",
    question: "你觉得你值得拥有一段健康、平等的感情吗？",
    options: [
      { text: "毫无疑问，我值得最好的", value: 4 },
      { text: "应该值得吧", value: 3 },
      { text: "不太确定，可能我要求太高了", value: 2 },
      { text: "我不配拥有好的感情", value: 1 },
    ],
  },
  {
    id: 30,
    category: "confidence",
    question: "此刻的你，愿意开始好好爱自己吗？",
    options: [
      { text: "是的，我已经在路上了", value: 4 },
      { text: "愿意尝试，虽然不知道怎么做", value: 3 },
      { text: "想要，但觉得很难", value: 2 },
      { text: "不知道什么是爱自己", value: 1 },
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

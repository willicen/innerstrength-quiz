import { motion } from "framer-motion";
import { Download, MessageCircle, Sparkles, TrendingUp, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmotionalGauge from "./EmotionalGauge";
import InsightCard from "./InsightCard";

interface ResultsDashboardProps {
  answers: Record<number, number>;
  onRestart: () => void;
}

const calculateScores = (answers: Record<number, number>) => {
  const values = Object.values(answers);
  const total = values.reduce((sum, val) => sum + val, 0);
  const maxPossible = values.length * 4;
  const overallScore = Math.round((total / maxPossible) * 100);

  // Calculate category scores
  const internalFriction = Math.round(
    ((answers[1] + answers[2] + answers[7]) / 12) * 100
  );
  const dependency = Math.round(((answers[3] + answers[4]) / 8) * 100);
  const confidence = Math.round(((answers[5] + answers[6]) / 8) * 100);

  return { overallScore, internalFriction, dependency, confidence };
};

const getInsights = (scores: ReturnType<typeof calculateScores>) => {
  const { overallScore, internalFriction, dependency, confidence } = scores;

  let currentState = {
    title: "当前状态",
    description: "",
    icon: Heart,
    color: "accent" as const,
  };

  let strength = {
    title: "潜在优势",
    description: "",
    icon: TrendingUp,
    color: "primary" as const,
  };

  let advice = {
    title: "重建建议",
    description: "",
    icon: Shield,
    color: "lavender" as const,
  };

  // Current state analysis
  if (overallScore >= 75) {
    currentState.description =
      "你的情感状态相对稳定，展现出良好的自我调节能力。虽然经历了分手，但你正在积极地面对和处理这段经历。";
  } else if (overallScore >= 50) {
    currentState.description =
      "你正处于情感恢复的过程中，有时会感到迷茫或焦虑，这是完全正常的。给自己更多的时间和耐心。";
  } else {
    currentState.description =
      "目前你可能正经历较大的情感波动，内心有些疲惫。请记住，寻求帮助是勇敢的表现，你不需要独自承受。";
  }

  // Strength analysis
  if (confidence >= 60) {
    strength.description =
      "你拥有较强的自我认同感，这是重建的坚实基础。即使在困难时期，你依然能够看到自己的价值。";
  } else if (internalFriction >= 60) {
    strength.description =
      "你具备良好的自我觉察能力，能够识别自己的情绪模式。这种觉察力将帮助你更好地理解和改变。";
  } else {
    strength.description =
      "你愿意直面自己的感受并寻求帮助，这本身就是一种力量。真正的勇气不是没有恐惧，而是带着恐惧前行。";
  }

  // Reconstruction advice
  if (dependency <= 40) {
    advice.description =
      "建议先建立稳定的日常作息和自我关怀习惯。可以尝试记录每天的三件好事，重新发现生活中的小确幸。";
  } else if (internalFriction <= 40) {
    advice.description =
      "尝试正念冥想来减少内耗，每天给自己10分钟的安静时间。学会和负面想法和平共处，而不是与之对抗。";
  } else {
    advice.description =
      "保持目前的状态，同时可以开始探索新的兴趣爱好。与值得信赖的朋友分享你的感受，建立更深层的连接。";
  }

  return [currentState, strength, advice];
};

const ResultsDashboard = ({ answers, onRestart }: ResultsDashboardProps) => {
  const scores = calculateScores(answers);
  const insights = getInsights(scores);

  return (
    <section className="relative min-h-screen px-4 py-12 md:py-20">
      {/* Background decorations */}
      <div className="blur-circle w-96 h-96 bg-primary/15 -top-20 -right-40" />
      <div className="blur-circle w-80 h-80 bg-accent/20 bottom-40 -left-40" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">测评完成</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-4">
            你的情感重建报告
          </h1>
          <p className="text-muted-foreground font-serif">
            基于你的回答，我们为你生成了个性化的分析报告
          </p>
        </motion.div>

        {/* Main score gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 md:p-12 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <EmotionalGauge score={scores.overallScore} />
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
                情感韧性指数
              </h2>
              <p className="text-muted-foreground font-serif mb-4">
                这个分数反映了你当前的情感恢复能力和内在力量水平
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="px-4 py-2 rounded-full bg-primary/10">
                  <span className="text-sm text-primary">
                    内耗指数: {scores.internalFriction}%
                  </span>
                </div>
                <div className="px-4 py-2 rounded-full bg-accent/10">
                  <span className="text-sm text-accent">
                    独立性: {scores.dependency}%
                  </span>
                </div>
                <div className="px-4 py-2 rounded-full bg-lavender/50">
                  <span className="text-sm text-lavender-foreground">
                    自信心: {scores.confidence}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Insight cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <InsightCard
                title={insight.title}
                description={insight.description}
                icon={insight.icon}
                color={insight.color}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-8 md:p-10 text-center"
        >
          <h3 className="text-2xl font-display font-semibold text-foreground mb-3">
            开启你的自我重建之旅
          </h3>
          <p className="text-muted-foreground font-serif mb-8 max-w-xl mx-auto">
            获取专业的情感指导和个性化的21天自愈计划，
            让专业顾问陪伴你走过这段旅程
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="px-8 py-6 text-base rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              预约私人咨询
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-base rounded-xl border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all"
            >
              <Download className="w-5 h-5 mr-2" />
              下载21天自愈手册
            </Button>
          </div>

          <button
            onClick={onRestart}
            className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            重新测评
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsDashboard;

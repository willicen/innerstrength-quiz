import { motion } from "framer-motion";
import { Download, MessageCircle, Sparkles, Quote, Heart, Lightbulb, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmotionalGauge from "./EmotionalGauge";
import { getTierByScore, ResultTier } from "@/lib/resultTiers";

interface ResultsDashboardProps {
  answers: Record<number, number>;
  onRestart: () => void;
}

const calculateScore = (answers: Record<number, number>) => {
  const values = Object.values(answers);
  const total = values.reduce((sum, val) => sum + val, 0);
  const maxPossible = values.length * 4;
  return Math.round((total / maxPossible) * 100);
};

// Map tier accent colors to semantic classes
const getTierStyles = (tier: ResultTier) => {
  const accentMap: Record<string, { badge: string; border: string; button: string; glow: string }> = {
    "#E67E22": {
      badge: "bg-accent/20 text-accent",
      border: "border-accent",
      button: "bg-accent hover:bg-accent/90 text-accent-foreground",
      glow: "from-accent/10 to-primary/5"
    },
    "#2C3E50": {
      badge: "bg-primary/20 text-primary",
      border: "border-primary",
      button: "bg-primary hover:bg-primary/90 text-primary-foreground",
      glow: "from-primary/10 to-accent/5"
    },
    "#27AE60": {
      badge: "bg-primary/20 text-primary",
      border: "border-primary",
      button: "bg-primary hover:bg-primary/90 text-primary-foreground",
      glow: "from-primary/15 to-lavender/10"
    }
  };
  return accentMap[tier.accent_color] || accentMap["#2C3E50"];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

const ResultsDashboard = ({ answers, onRestart }: ResultsDashboardProps) => {
  const score = calculateScore(answers);
  const tier = getTierByScore(score);
  const styles = getTierStyles(tier);

  const getCtaIcon = () => {
    if (score <= 40) return <Download className="w-5 h-5 mr-2" />;
    if (score <= 75) return <MessageCircle className="w-5 h-5 mr-2" />;
    return <Users className="w-5 h-5 mr-2" />;
  };

  return (
    <section className="relative min-h-screen px-4 py-12 md:py-20 overflow-hidden">
      {/* Background decorations with tier-based colors */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="blur-circle w-96 h-96 bg-primary/15 -top-20 -right-40" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        className="blur-circle w-80 h-80 bg-accent/20 bottom-40 -left-40" 
      />

      <motion.div 
        className="relative z-10 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">测评完成</span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-4">
            你的情感重建报告
          </h1>
          <p className="text-muted-foreground font-serif">
            基于你的回答，我们为你生成了个性化的分析报告
          </p>
        </motion.div>

        {/* Main score gauge with level */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-8 md:p-12 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <EmotionalGauge score={score} />
            <div className="text-center md:text-left flex-1">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className={`inline-block px-4 py-1.5 rounded-full ${styles.badge} mb-4`}
              >
                <span className="text-sm font-medium">{tier.level}</span>
              </motion.div>
              <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
                {tier.status}
              </h2>
              <p className="text-muted-foreground font-serif">
                情感韧性指数反映了你当前的情感恢复能力和内在力量水平
              </p>
            </div>
          </div>
        </motion.div>

        {/* Analysis Card */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 md:p-8 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-3">
                深度解析
              </h3>
              <p className="text-muted-foreground font-serif leading-relaxed">
                {tier.analysis}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Private Talk Card */}
        <motion.div
          variants={itemVariants}
          className={`glass-card p-6 md:p-8 mb-6 border-l-4 ${styles.border}`}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-3">
                悄悄话
              </h3>
              <p className="text-muted-foreground font-serif leading-relaxed italic">
                {tier.private_talk}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Advice Card */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-6 md:p-8 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-lavender/50 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-lavender-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-3">
                重建建议
              </h3>
              <p className="text-muted-foreground font-serif leading-relaxed">
                {tier.advice}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Golden Quote */}
        <motion.div
          variants={itemVariants}
          className={`relative p-8 md:p-10 mb-8 bg-gradient-to-br ${styles.glow} rounded-2xl border border-primary/10`}
        >
          <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/20" />
          <Quote className="absolute bottom-4 right-4 w-8 h-8 text-primary/20 rotate-180" />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-xl md:text-2xl font-display font-medium text-foreground leading-relaxed"
          >
            "{tier.golden_quote}"
          </motion.p>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-8 md:p-10 text-center"
        >
          <h3 className="text-2xl font-display font-semibold text-foreground mb-3">
            开启你的自我重建之旅
          </h3>
          <p className="text-muted-foreground font-serif mb-8 max-w-xl mx-auto">
            获取专业的情感指导和个性化的自愈计划，让专业顾问陪伴你走过这段旅程
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                className={`px-8 py-6 text-base rounded-xl ${styles.button} shadow-lg hover:shadow-xl transition-all`}
              >
                {getCtaIcon()}
                {tier.cta_text}
              </Button>
            </motion.div>
          </div>

          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.02 }}
            className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            重新测评
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ResultsDashboard;

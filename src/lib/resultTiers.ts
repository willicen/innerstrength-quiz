export interface ResultTier {
  range: [number, number];
  level: string;
  status: string;
  analysis: string;
  private_talk: string;
  advice: string;
  golden_quote: string;
  cta_text: string;
  theme_color: string;
  accent_color: string;
}

export const resultTiers: ResultTier[] = [
  {
    range: [0, 40],
    level: "极度内耗期",
    status: "你正在亲手把刀递给对方",
    analysis: "目前的你，像是一台断了电的精密仪器。你的情绪开关完全握在对方手里：他回消息你就满电，他冷暴力你就黑屏。你不是在爱，是在「乞讨」认同。",
    private_talk: "姐妹，心疼你的懂事，但更心疼你弄丢了自己。高敏感不是错，但把敏感当成讨好对方的工具，就是在自我损耗。",
    advice: "强行止损，立刻物理隔离。你现在需要的不是挽回他，而是通过《21天自愈清单》强行找回你的「出厂设置」。",
    golden_quote: "当你不再期待他拯救你，你就已经拯救了自己。",
    cta_text: "获取21天紧急自愈清单",
    theme_color: "#F5F5F5",
    accent_color: "#E67E22"
  },
  {
    range: [41, 75],
    level: "觉醒重建期",
    status: "你在黑暗中摸到了那把梯子",
    analysis: "你已经意识到讨好没用，但旧的惯性还在拉扯你。你会在深夜反复复盘，在「想通了」和「好难过」之间反复横跳。这是最痛苦的阶段，也是破茧成蝶的前夜。",
    private_talk: "你已经在变好的路上了。你会难受，是因为你正在剥离那些不属于你的标签。高敏感的你，现在需要把那份细腻拿来「投喂」自己的灵魂。",
    advice: "刻意练习「不解释」。试着在生活中拒绝那些消耗你的人，别怕被讨厌，那是你自由的开始。",
    golden_quote: "你不需要很完美才值得被爱，你只需要很有底气地活着。",
    cta_text: "预约东亮老师1对1诊断",
    theme_color: "#FAF9F6",
    accent_color: "#2C3E50"
  },
  {
    range: [76, 100],
    level: "能量自洽期",
    status: "你终于成为了自己的避风港",
    analysis: "恭喜你，你已经拿回了人生的裁判权。现在的你，看感情像是看风景，能入戏也能出戏。你的安全感不再向外索取，而是由内而生。",
    private_talk: "现在的你，才是最高级的自愈者。你的高敏感变成了洞察力，你的过去变成了你的底气。你不再害怕失去，因为你深知，你从未失去过自己。",
    advice: "保持这种「关我屁事」的松弛感，你的磁场会自然吸引同频的高能量。向下扎根，向外赋能。",
    golden_quote: "爱自己，才是这场博弈里唯一的稳赢法门。",
    cta_text: "加入底气女性高能量社群",
    theme_color: "#F0FFF0",
    accent_color: "#27AE60"
  }
];

export const getTierByScore = (score: number): ResultTier => {
  for (const tier of resultTiers) {
    if (score >= tier.range[0] && score <= tier.range[1]) {
      return tier;
    }
  }
  return resultTiers[0];
};

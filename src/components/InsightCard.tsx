import { LucideIcon } from "lucide-react";

interface InsightCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "primary" | "accent" | "lavender";
}

const colorStyles = {
  primary: {
    bg: "bg-primary/10",
    icon: "text-primary",
    border: "border-primary/20",
  },
  accent: {
    bg: "bg-accent/10",
    icon: "text-accent",
    border: "border-accent/20",
  },
  lavender: {
    bg: "bg-lavender/30",
    icon: "text-lavender-foreground",
    border: "border-lavender/30",
  },
};

const InsightCard = ({ title, description, icon: Icon, color }: InsightCardProps) => {
  const styles = colorStyles[color];

  return (
    <div className={`glass-card h-full p-6 border ${styles.border}`}>
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl ${styles.bg} flex items-center justify-center mb-4`}
      >
        <Icon className={`w-6 h-6 ${styles.icon}`} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-display font-semibold text-foreground mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm font-serif text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default InsightCard;

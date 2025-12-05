import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: "primary" | "accent" | "success" | "info" | "warning";
  delay?: number;
}

const colorVariants = {
  primary: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
  accent: "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground",
  success: "bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground",
  info: "bg-info/10 text-info group-hover:bg-info group-hover:text-info-foreground",
  warning: "bg-warning/10 text-warning group-hover:bg-warning group-hover:text-warning-foreground",
};

export function ModuleCard({ title, description, icon: Icon, href, color, delay = 0 }: ModuleCardProps) {
  return (
    <Link
      to={href}
      className="group block"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative h-full rounded-2xl border border-border bg-card p-6 card-hover animate-slide-up overflow-hidden">
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          <div className={cn(
            "mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300",
            colorVariants[color]
          )}>
            <Icon className="h-7 w-7" />
          </div>
          
          <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
          
          <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Open Module</span>
            <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

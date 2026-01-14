import { 
  Flame, 
  Skull, 
  Zap, 
  Droplets, 
  AlertTriangle, 
  Leaf, 
  Bomb, 
  Cylinder, 
  Activity 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const GHS_PICTOGRAMS = [
  { id: "explosive", label: "Explosive", icon: Bomb },
  { id: "flammable", label: "Flammable", icon: Flame },
  { id: "oxidizing", label: "Oxidizing", icon: Zap }, // Using Zap as abstract for Oxidizing
  { id: "compressed_gas", label: "Gas", icon: Cylinder },
  { id: "corrosive", label: "Corrosive", icon: Droplets },
  { id: "toxic", label: "Toxic", icon: Skull },
  { id: "irritant", label: "Irritant", icon: AlertTriangle },
  { id: "health_hazard", label: "Health", icon: Activity },
  { id: "environmental", label: "Env.", icon: Leaf },
];

interface GhsPickerProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
}

export function GhsPicker({ selected, onChange, disabled }: GhsPickerProps) {
  const toggle = (id: string) => {
    if (disabled) return;
    if (selected.includes(id)) {
      onChange(selected.filter((i) => i !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {GHS_PICTOGRAMS.map((p) => {
        const isSelected = selected.includes(p.id);
        const Icon = p.icon;
        
        return (
          <motion.button
            key={p.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggle(p.id)}
            disabled={disabled}
            className={cn(
              "relative flex flex-col items-center justify-center p-2 rounded border-2 transition-all duration-200 aspect-square",
              isSelected 
                ? "border-accent bg-accent/10 text-accent shadow-[0_0_10px_rgba(220,38,38,0.3)]" 
                : "border-border bg-secondary/20 text-muted-foreground hover:border-primary/50 hover:text-primary",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {/* Diamond shape border for GHS style */}
            <div className={cn(
              "absolute inset-1 border-2 transform rotate-45 pointer-events-none transition-colors",
              isSelected ? "border-accent" : "border-transparent"
            )} />
            
            <Icon className={cn("w-6 h-6 mb-1 z-10", isSelected && "fill-current")} />
            <span className="text-[10px] font-mono uppercase tracking-tighter leading-none z-10">{p.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

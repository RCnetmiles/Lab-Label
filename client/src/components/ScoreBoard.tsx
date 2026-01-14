import { motion } from "framer-motion";

interface ScoreBoardProps {
  score: number;
  total: number;
  current: number;
}

export function ScoreBoard({ score, total, current }: ScoreBoardProps) {
  return (
    <div className="flex items-center space-x-4 bg-black/40 border border-white/10 px-4 py-2 rounded">
      <div className="flex flex-col">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Shift Progress</span>
        <div className="flex gap-1 mt-1">
          {Array.from({ length: total }).map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-1 rounded-full ${i < current ? 'bg-primary' : 'bg-secondary'}`}
            />
          ))}
        </div>
      </div>
      
      <div className="h-8 w-px bg-white/10 mx-2" />
      
      <div className="flex flex-col items-end min-w-[60px]">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Credits</span>
        <motion.span 
          key={score}
          initial={{ scale: 1.2, color: "var(--primary)" }}
          animate={{ scale: 1, color: "var(--foreground)" }}
          className="font-mono text-xl font-bold"
        >
          {score}
        </motion.span>
      </div>
    </div>
  );
}

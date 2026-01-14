import { useState, useEffect } from "react";
import { useProducts, useVerifyAnswer } from "@/hooks/use-game";
import { ProductVisual } from "@/components/ProductVisual";
import { GhsPicker } from "@/components/GhsPicker";
import { RequisitionForm } from "@/components/RequisitionForm";
import { ScoreBoard } from "@/components/ScoreBoard";
import { Button } from "@/components/ui/button";
import { FileText, Archive, RefreshCw, TriangleAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Game() {
  const { data: products, isLoading, error, refetch } = useProducts();
  const verifyMutation = useVerifyAnswer();
  const { toast } = useToast();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [container, setContainer] = useState<"glass" | "plastic">("glass");
  const [pictograms, setPictograms] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [stamp, setStamp] = useState<"APPROVED" | "CITATION" | null>(null);
  const [gameStatus, setGameStatus] = useState<"start" | "playing" | "end">("start");

  const TOTAL_ROUNDS = 5;

  const handleStart = () => {
    setGameStatus("playing");
    setCurrentIndex(0);
    setScore(0);
    setContainer("glass");
    setPictograms([]);
  };

  const handleRestart = () => {
    setGameStatus("start");
    refetch();
  };

  const handleStore = async () => {
    if (!products) return;
    const currentProduct = products[currentIndex];
    
    try {
      const result = await verifyMutation.mutateAsync({
        productId: currentProduct.id,
        selectedContainer: container,
        selectedPictograms: pictograms,
      });

      setScore(s => s + result.scoreDelta);
      setStamp(result.correct ? "APPROVED" : "CITATION");

      // Visual feedback delay before next round
      setTimeout(() => {
        setStamp(null);
        if (currentIndex < TOTAL_ROUNDS - 1) {
          setCurrentIndex(prev => prev + 1);
          // Reset form for next product
          setContainer("glass");
          setPictograms([]);
        } else {
          setGameStatus("end");
        }
      }, 1500);

    } catch (err) {
      toast({
        title: "System Error",
        description: "Communication with mainframe failed.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-primary font-mono crt-flicker">
        INITIALIZING LAB SYSTEMS...
      </div>
    );
  }

  if (error || !products) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-destructive font-mono p-4 text-center">
        <TriangleAlert className="w-12 h-12 mb-4" />
        <h1 className="text-xl">SYSTEM CRITICAL FAILURE</h1>
        <p className="mb-4">Unable to load product manifest.</p>
        <Button onClick={() => window.location.reload()} variant="outline">REBOOT SYSTEM</Button>
      </div>
    );
  }

  // --- START SCREEN ---
  if (gameStatus === "start") {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 max-w-md w-full text-center space-y-8"
        >
          <div className="space-y-2">
            <h1 className="font-display text-6xl text-primary text-glow">LAB RAT</h1>
            <p className="font-mono text-muted-foreground tracking-widest text-sm">SHIFT #492-B // HAZMAT DIVISION</p>
          </div>

          <div className="bg-card/50 border border-border p-6 rounded-lg backdrop-blur-sm text-left space-y-4">
            <h3 className="text-white font-bold font-display text-xl tracking-wide border-b border-border pb-2">Directives:</h3>
            <ul className="space-y-3 font-mono text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">01.</span>
                <span>Review requisition forms for chemical properties.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">02.</span>
                <span>Select appropriate containment vessel (Glass/Plastic).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">03.</span>
                <span>Apply mandatory GHS safety pictograms.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1">04.</span>
                <span>Incorrect labeling results in immediate citation.</span>
              </li>
            </ul>
          </div>

          <Button 
            onClick={handleStart}
            size="lg"
            className="w-full h-16 text-xl font-display tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all"
          >
            BEGIN SHIFT
          </Button>
        </motion.div>
      </div>
    );
  }

  // --- END SCREEN ---
  if (gameStatus === "end") {
    const isPassing = score > 0;
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center p-6 bg-background">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <h1 className="font-display text-5xl uppercase text-white">Shift Complete</h1>
          
          <div className="py-8">
            <div className="font-mono text-sm text-muted-foreground uppercase mb-2">Final Performance</div>
            <div className={`font-display text-8xl ${isPassing ? 'text-success' : 'text-destructive'} text-glow`}>
              {score}
            </div>
          </div>

          <div className="bg-card/30 p-4 rounded border border-border">
            <p className="font-mono text-sm">
              {isPassing 
                ? "Performance acceptable. Credits have been wired to your account." 
                : "Performance below mandatory minimums. Re-education required."}
            </p>
          </div>

          <Button 
            onClick={handleRestart}
            variant="outline"
            size="lg"
            className="w-full gap-2 font-mono"
          >
            <RefreshCw className="w-4 h-4" /> START NEW SHIFT
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentProduct = products[currentIndex];

  // --- MAIN GAME LOOP ---
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background select-none">
      {/* Top Half: Visual */}
      <div className="h-[45%] relative">
        <div className="absolute top-4 right-4 z-20">
          <ScoreBoard score={score} total={TOTAL_ROUNDS} current={currentIndex + 1} />
        </div>
        <ProductVisual 
          containerType={container} 
          product={currentProduct}
          pictograms={pictograms}
          stamp={stamp}
        />
      </div>

      {/* Bottom Half: Controls */}
      <div className="h-[55%] bg-card border-t border-primary/20 flex flex-col relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        
        {/* Control Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/20 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsFormOpen(true)}
              className="gap-2 bg-secondary/30 border-primary/30 hover:bg-primary/20 text-primary font-mono text-xs uppercase"
            >
              <FileText className="w-4 h-4" />
              Requisition Form
            </Button>
            {!isFormOpen && (
              <span className="animate-pulse text-xs text-primary font-mono">&lt; READ THIS FIRST</span>
            )}
          </div>

          {/* Container Toggle */}
          <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
             <button
                onClick={() => setContainer("glass")}
                className={`px-3 py-1 text-xs font-mono uppercase rounded transition-all ${container === "glass" ? "bg-blue-500/20 text-blue-400 shadow-sm" : "text-muted-foreground hover:text-white"}`}
             >
               Glass
             </button>
             <div className="w-px bg-white/10 mx-1" />
             <button
                onClick={() => setContainer("plastic")}
                className={`px-3 py-1 text-xs font-mono uppercase rounded transition-all ${container === "plastic" ? "bg-white/20 text-white shadow-sm" : "text-muted-foreground hover:text-white"}`}
             >
               Plastic
             </button>
          </div>
        </div>

        {/* Pictogram Grid */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="mb-2 flex items-center justify-between">
             <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">Required Labeling</span>
             <span className="text-[10px] font-mono text-muted-foreground">{pictograms.length} Selected</span>
          </div>
          <GhsPicker 
            selected={pictograms} 
            onChange={setPictograms}
            disabled={!!stamp}
          />
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-black/40 border-t border-white/5">
          <Button 
            size="lg" 
            className="w-full h-14 font-display text-2xl tracking-[0.2em] bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(234,179,8,0.2)] disabled:opacity-50 disabled:grayscale transition-all active:scale-[0.98]"
            onClick={handleStore}
            disabled={!!stamp || verifyMutation.isPending}
          >
            {verifyMutation.isPending ? "PROCESSING..." : "STORE ITEM"} <Archive className="ml-3 w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isFormOpen && (
          <RequisitionForm 
            product={currentProduct} 
            isOpen={isFormOpen} 
            onClose={() => setIsFormOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

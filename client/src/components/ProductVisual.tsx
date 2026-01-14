import { motion, AnimatePresence } from "framer-motion";
import { type Product } from "@shared/schema";
import { FlaskConical, Milk } from "lucide-react";

interface ProductVisualProps {
  containerType: "glass" | "plastic";
  product?: Product;
  pictograms: string[]; // IDs of selected pictograms
  stamp?: "APPROVED" | "CITATION" | null;
}

export function ProductVisual({ containerType, product, pictograms, stamp }: ProductVisualProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#1a1c23] border-b-4 border-border shadow-inner overflow-hidden">
      {/* Background industrial texture */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #333 1px, transparent 0)", backgroundSize: "20px 20px" }} />

      {/* The Vessel */}
      <div className="relative z-10 transform scale-150">
        <AnimatePresence mode="wait">
          <motion.div
            key={containerType}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {containerType === "glass" ? (
              <div className="relative">
                <FlaskConical 
                  className="w-48 h-48 text-blue-200/40 drop-shadow-[0_0_15px_rgba(100,200,255,0.3)]" 
                  strokeWidth={1}
                />
                {/* Liquid inside */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-16 bg-blue-500/20 blur-md rounded-b-3xl" />
              </div>
            ) : (
              <div className="relative">
                <Milk 
                  className="w-48 h-48 text-white/60 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                  strokeWidth={1.5}
                />
                 {/* Opaque Plastic Texture */}
                 <div className="absolute inset-0 bg-white/5 rounded-lg backdrop-blur-[2px]" />
              </div>
            )}
            
            {/* The Label on the bottle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-24 bg-white/90 shadow-lg flex flex-col items-center justify-center p-1 gap-1 border border-gray-300">
               <div className="w-full h-1 bg-black mb-1" />
               <div className="grid grid-cols-2 gap-0.5 w-full h-full content-start">
                  {pictograms.slice(0, 4).map((pid) => (
                    <div key={pid} className="border border-red-600 rotate-45 w-6 h-6 flex items-center justify-center bg-white m-auto">
                       <div className="-rotate-45 w-3 h-3 bg-black rounded-full" />
                    </div>
                  ))}
               </div>
               <div className="text-[6px] font-mono text-center leading-none mt-auto w-full truncate px-0.5">
                  {product?.name || "UNKNOWN"}
               </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Stamp Overlay */}
      <AnimatePresence>
        {stamp && (
          <motion.div
            initial={{ scale: 2, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: -15 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 border-[6px] px-8 py-2 font-display text-5xl tracking-widest uppercase mix-blend-hard-light backdrop-blur-sm shadow-xl
              ${stamp === 'APPROVED' ? 'border-success text-success bg-success/10' : 'border-destructive text-destructive bg-destructive/10'}`}
          >
            {stamp}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

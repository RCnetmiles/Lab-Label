import { motion } from "framer-motion";
import { type Product } from "@shared/schema";
import { X } from "lucide-react";

interface RequisitionFormProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function RequisitionForm({ product, isOpen, onClose }: RequisitionFormProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        className="w-full max-w-md bg-[var(--paper)] text-[var(--paper-foreground)] rounded-t-lg sm:rounded-lg shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
        layoutId="requisition-card"
      >
        {/* Header - Paper Style */}
        <div className="bg-[#e5e5e5] p-4 border-b border-stone-300 flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="font-display text-2xl uppercase tracking-wider text-stone-800">Requisition Form</h2>
            <span className="font-mono text-xs text-stone-500">REF-{product.id.toString().padStart(6, '0')}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-stone-300 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-stone-600" />
          </button>
        </div>

        {/* Content - Typewriter Style */}
        <div className="p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-stone-500 block border-b border-stone-300 pb-1">Substance Name</label>
            <p className="font-mono text-lg font-bold text-stone-900">{product.name}</p>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-stone-500 block border-b border-stone-300 pb-1">Technical Description</label>
            <p className="font-mono text-sm leading-relaxed text-stone-800 whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          <div className="pt-4 flex justify-end">
            <div className="border-2 border-stone-800 px-4 py-1 -rotate-3 opacity-50 font-display text-xl uppercase tracking-widest text-stone-800">
              Lab Copy
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-[#e5e5e5] h-4 border-t border-stone-300" />
      </motion.div>
    </motion.div>
  );
}

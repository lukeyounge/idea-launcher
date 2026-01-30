
import React from 'react';
import { Instruction } from '../types';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface InstructionChipProps {
  instruction: Instruction;
  onToggle: () => void;
  onDelete?: () => void;
}

const getCategoryStyles = (category: string, isApproved: boolean) => {
  if (!isApproved) return 'bg-white border-slate-100 hover:border-slate-300 text-slate-500 hover:shadow-lg';
  
  switch(category) {
    case 'design': return 'bg-rose-50 border-rose-500 text-rose-900 shadow-[0_10px_20px_rgba(225,29,72,0.1)]';
    case 'functionality': return 'bg-slate-900 border-slate-900 text-white shadow-[0_10px_20px_rgba(15,23,42,0.15)]';
    case 'users': return 'bg-white border-rose-300 text-rose-800 shadow-[0_10px_20px_rgba(225,29,72,0.05)]';
    default: return 'bg-white border-slate-200';
  }
};

const getIconStyles = (category: string, isApproved: boolean) => {
  if (!isApproved) return 'bg-white border-slate-200';
  
  switch(category) {
    case 'design': return 'bg-rose-600 border-rose-600';
    case 'functionality': return 'bg-white border-white';
    case 'users': return 'bg-rose-500 border-rose-500';
    default: return 'bg-rose-600 border-rose-600';
  }
};

const getCheckColor = (category: string, isApproved: boolean) => {
  if (!isApproved) return 'transparent';
  return category === 'functionality' ? '#0f172a' : 'white';
};

export const InstructionChip: React.FC<InstructionChipProps> = ({
  instruction,
  onToggle,
  onDelete
}) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={`
        relative group cursor-pointer p-6 rounded-[2rem] border-2 transition-all duration-300 flex items-start gap-4
        ${getCategoryStyles(instruction.category, instruction.isApproved)}
      `}
    >
      <div className={`
        mt-1 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300
        ${getIconStyles(instruction.category, instruction.isApproved)}
      `}>
        {instruction.isApproved && <Check size={16} color={getCheckColor(instruction.category, true)} strokeWidth={3.5} />}
      </div>
      
      <p className="text-sm font-extrabold flex-1 leading-tight tracking-tight">
        {instruction.text}
      </p>

      {instruction.isCustom && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-rose-100 rounded-xl text-rose-500"
        >
          <X size={18} />
        </button>
      )}
    </motion.div>
  );
};

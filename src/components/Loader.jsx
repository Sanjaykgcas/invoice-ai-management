import { Loader2 } from 'lucide-react';

const Loader = ({ text = "Processing with AI + OCR + RPA...", progress = null }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="animate-spin duration-1000 ease-linear">
        <Loader2 className="h-16 w-16 text-[#D4AF37] glow-gold rounded-full" />
      </div>
      <h3 className="text-[#FFD700] text-xl font-medium tracking-wide animate-pulse">
        {text}
      </h3>
      
      {progress !== null && (
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
          <div 
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] glow-gold transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default Loader;

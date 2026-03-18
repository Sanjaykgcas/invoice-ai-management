

const GoldButton = ({ children, onClick, type = 'button', className = '', icon = null, disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group hover:scale-[1.02] active:scale-[0.98]
        ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-800 text-gray-400 border border-gray-600' : 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0A0A0A] glow-gold glow-gold-hover'}
        ${className}
      `}
    >
      {!disabled && (
        <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      )}
      {icon}
      <span>{children}</span>
    </button>
  );
};

export default GoldButton;

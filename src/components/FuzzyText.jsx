

const FuzzyText = ({ children, className = '' }) => {
  return (
    <h1 
      className={`font-bold tracking-tight bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#EAEAEA] bg-clip-text text-transparent relative ${className}`}
    >
      {/* Glow layer */}
      <span className="absolute inset-0 blur-xl opacity-40 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent" aria-hidden="true">
        {children}
      </span>
      {children}
    </h1>
  );
};

export default FuzzyText;

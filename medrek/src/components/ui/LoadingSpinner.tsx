import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="relative w-36 h-36">
        {/* Circuit ring — rotating dashed border */}
        <div className="absolute inset-0 rounded-full circuit-rotate" />
        {/* Logo with warm brown glow directly on the image */}
        <div className="absolute inset-2 rounded-full overflow-hidden flex items-center justify-center circuit-logo">
          <img src="/new_logo.png" alt="Loading" className="w-full h-full object-contain circuit-glow-img" />
        </div>
        {/* Orbiting dots */}
        <div className="absolute inset-0 rounded-full circuit-dot-1" />
        <div className="absolute inset-0 rounded-full circuit-dot-2" />
      </div>
      {text && <p className="text-sm text-[#9C836A]">{text}</p>}

      <style>{`
        .circuit-rotate {
          border: 2.5px dashed #A8692A;
          animation: spin 3s linear infinite;
        }
        .circuit-glow-img {
          filter: drop-shadow(0 0 8px rgba(168, 105, 42, 0.4)) drop-shadow(0 0 20px rgba(168, 105, 42, 0.2));
          animation: pulseGlow 2s ease-in-out infinite;
        }
        .circuit-dot-1, .circuit-dot-2 {
          border: 2px solid transparent;
          border-radius: 50%;
        }
        .circuit-dot-1::after {
          content: '';
          position: absolute;
          top: -3px;
          left: 50%;
          width: 7px;
          height: 7px;
          background: #C9904F;
          border-radius: 50%;
          transform: translateX(-50%);
          box-shadow: 0 0 8px 3px rgba(201, 144, 79, 0.6);
        }
        .circuit-dot-2::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 50%;
          width: 5px;
          height: 5px;
          background: #A8692A;
          border-radius: 50%;
          transform: translateX(-50%);
          box-shadow: 0 0 8px 3px rgba(168, 105, 42, 0.5);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(168, 105, 42, 0.3)) drop-shadow(0 0 15px rgba(168, 105, 42, 0.1)); }
          50% { filter: drop-shadow(0 0 12px rgba(168, 105, 42, 0.6)) drop-shadow(0 0 30px rgba(168, 105, 42, 0.3)); }
        }
      `}</style>
    </div>
  );
};
import { useEffect, useState } from 'react';

export default function GlitchText({ text, as = 'h1', className = '' }) {
      const [glitchText, setGlitchText] = useState(text);

      // Random char replacement glitch
      useEffect(() => {
            const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~';
            const interval = setInterval(() => {
                  if (Math.random() > 0.95) {
                        const charArr = text.split('');
                        const randIdx = Math.floor(Math.random() * charArr.length);
                        charArr[randIdx] = chars[Math.floor(Math.random() * chars.length)];
                        setGlitchText(charArr.join(''));

                        // Reset quickly
                        setTimeout(() => setGlitchText(text), 100);
                  }
            }, 200);

            return () => clearInterval(interval);
      }, [text]);

      const Tag = as;

      return (
            <Tag className={`glitch-wrapper ${className}`} data-text={text} style={{ position: 'relative', display: 'inline-block' }}>
                  {glitchText}
                  <style>{`
        .glitch-wrapper::before,
        .glitch-wrapper::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--c-void);
        }
        .glitch-wrapper::before {
          left: 2px;
          text-shadow: -1px 0 #ff00c1;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim-1 5s infinite linear alternate-reverse;
          z-index: -1;
        }
        .glitch-wrapper::after {
          left: -2px;
          text-shadow: -1px 0 #00fff9;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim-2 5s infinite linear alternate-reverse;
          z-index: -2;
        }
        @keyframes glitch-anim-1 {
          0% { clip: rect(2px, 9999px, 83px, 0); }
          20% { clip: rect(30px, 9999px, 8px, 0); }
          40% { clip: rect(66px, 9999px, 12px, 0); }
          60% { clip: rect(10px, 9999px, 55px, 0); }
          80% { clip: rect(48px, 9999px, 33px, 0); }
          100% { clip: rect(89px, 9999px, 92px, 0); }
        }
        @keyframes glitch-anim-2 {
          0% { clip: rect(64px, 9999px, 8px, 0); }
          20% { clip: rect(8px, 9999px, 86px, 0); }
          40% { clip: rect(21px, 9999px, 66px, 0); }
          60% { clip: rect(78px, 9999px, 5px, 0); }
          80% { clip: rect(93px, 9999px, 3px, 0); }
          100% { clip: rect(19px, 9999px, 26px, 0); }
        }
      `}</style>
            </Tag>
      );
}

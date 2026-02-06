export default function ChromeTitle({ text, subtext }) {
      return (
            <div style={{ position: 'relative', textAlign: 'center', zIndex: 10 }}>
                  {/* Glitch Shadow Layer */}
                  <h1 className="glitch-layer" aria-hidden="true">{text}</h1>

                  {/* Main Chrome Text */}
                  <h1 className="chrome-text">{text}</h1>

                  {/* Subtext with Neon Glow */}
                  <p className="neon-subtext">{subtext}</p>

                  <style>{`
        .chrome-text {
          font-size: clamp(4rem, 12vw, 9rem);
          font-family: var(--font-display);
          background: linear-gradient(
            to bottom,
            #ffffff 0%,
            #e0e4ea 40%,
            #8e9eab 50%,
            #e0e4ea 60%,
            #ffffff 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0px 2px 0px rgba(0,0,0,0.5));
          margin: 0;
          line-height: 0.9;
          text-transform: uppercase;
        }

        .glitch-layer {
          position: absolute;
          top: 0; left: 0; width: 100%;
          font-size: clamp(4rem, 12vw, 9rem);
          font-family: var(--font-display);
          color: var(--c-neon-red);
          opacity: 0.3;
          margin: 0;
          line-height: 0.9;
          text-transform: uppercase;
          z-index: -1;
          animation: glitch-skew 3s infinite linear alternate-reverse;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          transform: translate(-3px, 2px);
        }

        .neon-subtext {
          font-family: var(--font-geo);
          color: var(--c-electric-blue);
          font-size: 1.5rem;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          margin-top: 1rem;
          text-shadow: 0 0 10px var(--c-electric-blue);
        }

        @keyframes glitch-skew {
          0% { transform: translate(-2px, 1px) skew(0deg); }
          20% { transform: translate(2px, -1px) skew(-2deg); }
          40% { transform: translate(-1px, 2px) skew(1deg); }
          100% { transform: translate(1px, -2px) skew(0deg); }
        }
      `}</style>
            </div>
      );
}

export default function MarqueeBar({ text, direction = 'left', speed = '20s', bg = 'var(--c-acid-green)', color = 'var(--c-void)' }) {
      return (
            <div style={{
                  background: bg,
                  color: color,
                  width: '100%',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  padding: '1rem 0',
                  borderTop: '2px solid black',
                  borderBottom: '2px solid black',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  textTransform: 'uppercase',
                  display: 'flex'
            }}>
                  <div style={{
                        display: 'inline-block',
                        paddingLeft: '100%',
                        animation: `marquee-${direction} ${speed} linear infinite`
                  }}>
                        {text} &nbsp; • &nbsp; {text} &nbsp; • &nbsp; {text} &nbsp; • &nbsp; {text}
                  </div>
                  <style>{`
        @keyframes marquee-left {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-100%, 0); }
        }
        @keyframes marquee-right {
          0% { transform: translate(-100%, 0); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
            </div>
      );
}

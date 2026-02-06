export default function CyberButton({ children }) {
      return (
            <button style={{
                  background: 'transparent',
                  color: 'var(--c-electric-blue)',
                  border: '2px solid var(--c-electric-blue)',
                  padding: '1rem 3rem',
                  fontSize: '1.2rem',
                  fontFamily: 'var(--font-pixel)',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '4px 4px 0px var(--c-hot-pink)',
                  transition: 'all 0.1s',
                  margin: '2rem'
            }}
                  onMouseEnter={(e) => {
                        e.target.style.transform = 'translate(-2px, -2px)';
                        e.target.style.boxShadow = '6px 6px 0px var(--c-acid-green)';
                        e.target.style.background = 'rgba(0, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                        e.target.style.transform = 'translate(0, 0)';
                        e.target.style.boxShadow = '4px 4px 0px var(--c-hot-pink)';
                        e.target.style.background = 'transparent';
                  }}
                  onMouseDown={(e) => {
                        e.target.style.transform = 'translate(2px, 2px)';
                        e.target.style.boxShadow = '0px 0px 0px var(--c-hot-pink)';
                  }}
                  onMouseUp={(e) => {
                        e.target.style.transform = 'translate(-2px, -2px)';
                        e.target.style.boxShadow = '6px 6px 0px var(--c-acid-green)';
                  }}
            >
                  {children}
            </button>
      );
}

import { animate, spring } from 'motion';

export const initializeAnimations = () => {
  // General entrance animation for sections and cards
  const applyEntranceAnimations = (scope: HTMLElement) => {
    const sections = scope.querySelectorAll('section');
    const glassItems = scope.querySelectorAll('.glass-panel, .glass-card, .glass-modal');

    if (sections.length > 0) {
      animate(
        sections,
        { opacity: [0, 1], y: [20, 0] } as any,
        { delay: (i: number) => i * 0.1, duration: 0.6, easing: spring() } as any
      );
    }

    if (glassItems.length > 0) {
      animate(
        glassItems,
        { opacity: [0, 1], y: [20, 0] } as any,
        { delay: (i: number) => i * 0.05 + 0.3, duration: 0.5, easing: spring() } as any
      );
    }
  };

  // Click animation for buttons
  const applyClickAnimations = (scope: HTMLElement) => {
    scope.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        animate(
          button,
          { scale: [1, 0.98, 1] } as any,
          { duration: 0.3, easing: spring() } as any
        );
      });
    });
  };

  return { applyEntranceAnimations, applyClickAnimations, animate, spring };
};

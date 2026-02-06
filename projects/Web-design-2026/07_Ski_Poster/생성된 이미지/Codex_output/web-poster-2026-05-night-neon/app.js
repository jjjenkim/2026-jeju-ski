const blocks = document.querySelectorAll('.block');
let t = 0;
function drift(){
  t += 0.02;
  blocks.forEach((b, i) => {
    const x = Math.sin(t + i) * 6;
    const y = Math.cos(t + i) * 6;
    b.style.transform = `translate(${x}px, ${y}px)`;
  });
  requestAnimationFrame(drift);
}
drift();

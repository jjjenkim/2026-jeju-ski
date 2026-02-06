const stickers = document.querySelectorAll('.stickers span');
let t = 0;
function wobble(){
  t += 0.03;
  stickers.forEach((el, i) => {
    const r = Math.sin(t + i) * 6;
    el.style.transform = `rotate(${r}deg)`;
  });
  requestAnimationFrame(wobble);
}
wobble();

const tape = document.querySelectorAll('.tape');
let t = 0;
function jiggle(){
  t += 0.03;
  tape.forEach((el, i) => {
    const r = Math.sin(t + i) * 3;
    el.style.transform = `rotate(${r}deg)`;
  });
  requestAnimationFrame(jiggle);
}
jiggle();

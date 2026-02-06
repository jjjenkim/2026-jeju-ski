const orb = document.querySelector('.orb');
let t = 0;
function floaty(){
  t += 0.02;
  orb.style.transform = `translateY(${Math.sin(t) * 8}px)`;
  requestAnimationFrame(floaty);
}
floaty();

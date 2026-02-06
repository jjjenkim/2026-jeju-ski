const digits = document.querySelector('.digits');
let on = true;
setInterval(() => {
  on = !on;
  digits.style.textShadow = on ? '0 0 18px #f9ff7a' : '0 0 6px #8cffb0';
}, 600);

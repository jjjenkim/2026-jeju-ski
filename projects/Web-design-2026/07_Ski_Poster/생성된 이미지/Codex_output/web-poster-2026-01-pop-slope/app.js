const poster=document.getElementById('poster');
poster.addEventListener('mousemove',e=>{const r=poster.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;poster.style.transform=`rotateX(${y*-4}deg) rotateY(${x*6}deg)`});
poster.addEventListener('mouseleave',()=>{poster.style.transform='rotateX(0deg) rotateY(0deg)'});

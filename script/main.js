/**
 * =========================
 * Service Worker
 * =========================
 */

const SW_PATH = '/sw.js';
const SW_HOST = 'localhost';

if ('serviceWorker' in navigator && location.hostname !== SW_HOST) {
  navigator.serviceWorker.register(SW_PATH);
}

// navigator.serviceWorker.register('/sw.js');

/**
 * =========================
 * Custom Elements
 * =========================
 */

class ScrollingTitle extends HTMLElement {
  constructor() {
    super();

    const wrapperTop = document.createElement('div');
    const textTop = document.createElement('div');
    const wrapperBottom = document.createElement('div');
    const textBottom = document.createElement('div');

    const color = this.hasAttribute('color')
      ? this.getAttribute('color')
      : 'default';

    wrapperTop.classList.add('title-wrapper');
    textTop.classList.add('title', color);
    textTop.innerHTML = this.innerHTML;

    wrapperTop.appendChild(textTop);

    wrapperBottom.classList.add('scrolling-title');
    textBottom.innerHTML = this.innerHTML.replace('<br>', '');

    wrapperBottom.appendChild(textBottom);

    this.innerHTML = '';
    this.appendChild(wrapperTop);
    this.appendChild(wrapperBottom);
  }
}

class Note extends HTMLElement {
  constructor() {
    super();

    const container = document.createElement('div');
    const topImg = document.createElement('img');
    const bottomImg = document.createElement('img');

    const color = this.hasAttribute('color')
      ? this.getAttribute('color')
      : 'green';

    container.classList.add('note', 'note-section', color);
    container.innerHTML = this.innerHTML;

    this.innerHTML = '';

    topImg.src = `assests/images/generic/note-top-${color}.svg`;
    topImg.classList.add('note-top');

    bottomImg.src = `assests/images/generic/note-bottom-${color}.svg`;
    bottomImg.classList.add('note-bottom');

    this.appendChild(topImg);
    this.appendChild(container);
    this.appendChild(bottomImg);
  }
}

/**
 * =========================
 * Init
 * =========================
 */

window.onload = () => {
  customElements.define('note-component', Note);
  customElements.define('scrolling-title', ScrollingTitle);

  createScrollListeners();
  createNavListeners();
  createAnimListeners();
  createHoverListeners();

  const bmiInputs = document.querySelectorAll('.bmi .calc input');
  if (bmiInputs.length && document.body.classList.contains('bmi')) {
    setBMI();
  }

  updatePageHeightVar();
  window.onresize = updatePageHeightVar;
};

function updatePageHeightVar() {
  document.body.style.setProperty(
    '--top',
    document.querySelector('.top').offsetHeight + 'px'
  );
}

/**
 * =========================
 * BMI CALCULATOR
 * =========================
 */

function setBMI() {
  const inputs = document.querySelectorAll('.bmi .calc input');

  inputs[0].addEventListener('input', onBMIInput);
  inputs[1].addEventListener('input', onBMIInput);
}

function onBMIInput() {
  const weight = document.querySelectorAll('.bmi .calc input')[0].value;
  const height = document.querySelectorAll('.bmi .calc input')[1].value;

  const result = document.querySelector('.bmi .ans');

  result.classList.remove('text-red', 'text-green', 'text-blue');

  if (weight !== '' && height !== '') {
    const bmi = (Number(weight) / Math.pow(Number(height), 2)).toFixed(1);

    result.innerHTML = bmi;

    if (bmi >= 30 || bmi < 13) {
      result.classList.add('text-red');
    } else if (bmi >= 25) {
      result.classList.add('text-blue');
    } else {
      result.classList.add('text-green');
    }
  } else {
    result.innerHTML = 'הכניסו נתונים';
  }
}

/**
 * =========================
 * NAVIGATION
 * =========================
 */

function createNavListeners() {
  const items = document.querySelectorAll('nav li');

  items.forEach(item => {
    item.addEventListener('click', onNavClick);
  });
}

function onNavClick(e) {
  updateNav(e.currentTarget);
}

function updateNav(activeItem) {
  const current = document.querySelector('.current');

  if (current) current.classList.remove('current');
  activeItem.classList.add('current');
}

/**
 * =========================
 * SCROLL SYSTEM
 * =========================
 */

function createScrollListeners() {
  main.addEventListener('scroll', onScroll);
  setupScroll(main);

  const subjects = document.querySelectorAll('.subject');

  subjects.forEach(sub => {
    sub.addEventListener('viewtop', subjectIn);
    sub.addEventListener('viewbottom', subjectIn);
  });

  about.addEventListener('viewtop', subjectIn);
  about.addEventListener('viewbottom', subjectIn);
}

function subjectIn(e) {
  const section = e.currentTarget;

  const navLink = document.querySelector(`[href="#${section.id}"]`);
  updateNav(navLink);
}

function onScroll() {
  progBar.style.width =
    ((main.scrollTop + main.offsetHeight) / main.scrollHeight) * 100 + 'vw';
}

/**
 * =========================
 * ANIMATIONS
 * =========================
 */

function createAnimListeners() {
  const animItems = document.querySelectorAll('.toAnimate');

  animItems.forEach(el => {
    el.classList.add('animate');
    el.classList.remove('reset');

    el.addEventListener('animate', animate);
    el.addEventListener('viewout', resetAnimation);
  });

  const switchImgs = document.querySelectorAll('.switch-img');

  switchImgs.forEach(img => {
    img.classList.add('animate');
    img.addEventListener('animate', switchImgTimer);
  });
}

function animate(e) {
  const container = e.currentTarget;
  const imgs = container.querySelectorAll('img');

  imgs.forEach(img => {
    img.addEventListener('transitionend', onTransitionEnd);
    img.src = img.src.replace('.png', '.svg');
  });
}

function onTransitionEnd(e) {
  e.target.removeEventListener('transitionend', onTransitionEnd);
  e.target.src = e.target.src.replace('.svg', '.png');
}

function resetAnimation(e) {
  e.currentTarget.classList.remove('animate');
  e.currentTarget.classList.add('reset');
}

/**
 * =========================
 * SWITCH IMAGE TIMER
 * =========================
 */

function switchImgTimer(e) {
  const imgs = Array.from(e.currentTarget.children);

  imgs.forEach((img, i) => {
    setTimeout(() => {
      imgs.forEach(el => (el.style.display = 'none'));
      img.style.display = 'block';
    }, 500 * i);
  });
}

/**
 * =========================
 * HOVER SYSTEM
 * =========================
 */

function createHoverListeners() {
  const items = document.querySelectorAll('.slide-out, .link');

  items.forEach(item => {
    item.addEventListener('click', openHover);
  });
}

function openHover(e) {
  removeHoverListeners();

  e.currentTarget.classList.add('open');

  setTimeout(() => {
    document.body.addEventListener('click', closeHover);
  }, 100);
}

function closeHover() {
  document.body.removeEventListener('click', closeHover);
  createHoverListeners();
}

function removeHoverListeners() {
  const items = document.querySelectorAll('.slide-out, .link');

  items.forEach(item => {
    item.removeEventListener('click', openHover);
  });
}
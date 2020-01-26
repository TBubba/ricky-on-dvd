'use strict';
/**
 * Based on Ricky Berwick's video "NOW ON DVD"
 * https://www.youtube.com/watch?v=N19UIXiSI0g
 * 
 * Developed by TBubba
 * https://github.com/TBubba
 * https://bigbub.net/
 */

const PIXEL_RATIO = window.devicePixelRatio || 1;
const SPEED = 3;
const SCALE = 0.5 * (1 / PIXEL_RATIO);

let muted = false;

let bound_width  = 0;
let bound_height = 0;

const ricky_width  = 305 * SCALE;
const ricky_height = 494 * SCALE;

const rickys = [];

const imgs = [
  'ricky_green.png',
  'ricky_pink.png',
  'ricky_red.png',
  'ricky_yellow.png',
];

const sounds = [
  'sfx_ah.mp3',
  'sfx_oh.mp3',
  'sfx_uh.mp3',
  'sfx_haha.mp3',
];

window.addEventListener('resize', function onResize() {
  updateBoundries();
});

window.addEventListener('load', function onLoad() {
  updateBoundries();
  addRicky();   
  onRender();

  document.body.addEventListener('keypress', function onKeyPress(event) {
    switch (event.keyCode) {
      case 32: // SPACE
        addRicky();
        break;
      case 109: // M
        muted = !muted;
        break;
    }
  })
});

function onRender() {
  window.requestAnimationFrame(onRender);

  for (let i = 0; i < rickys.length; i++) {
    updateRicky(rickys[i]);
  }
}

function addRicky() {
  const element = document.createElement('div');
  element.classList.add('ricky');
  element.style.setProperty('width',  ricky_width  + 'px');
  element.style.setProperty('height', ricky_height + 'px');

  const ricky = {
    x: Math.random() * bound_width,
    y: Math.random() * bound_height,
    dir_x: (Math.random() >= 0.5) ? 1 : -1,
    dir_y: (Math.random() >= 0.5) ? 1 : -1,
    img: imgs.length,
    sound: sounds.length,
    element,
  };

  onBounce(ricky);

  document.body.appendChild(element);

  rickys.push(ricky);
}

function updateRicky(ricky) {
  let did_bounce = false;

  ricky.x += ricky.dir_x * SPEED;
  ricky.y += ricky.dir_y * SPEED;

  if (ricky.y >= bound_height) {
    ricky.dir_y = -1;
    did_bounce = true;
  } else if (ricky.y <= 0) {
    ricky.dir_y = 1;
    did_bounce = true;
  }

  if (ricky.x >= bound_width) {
    ricky.dir_x = -1;
    did_bounce = true;
  } else if (ricky.x <= 0) {
    ricky.dir_x = 1;
    did_bounce = true;
  }

  if (did_bounce) {
    onBounce(ricky);
  }

  ricky.element.style.setProperty('left', ricky.x + 'px');
  ricky.element.style.setProperty('top',  ricky.y + 'px');
}

function onBounce(ricky) {
  const new_img = Math.floor(Math.random() * (imgs.length - 1));
  if (new_img === ricky.img) { ricky.img = imgs.length - 1; }
  else { ricky.img = new_img; }

  const new_sound = Math.floor(Math.random() * (sounds.length - 1));
  if (new_sound === ricky.sound) { ricky.sound = sounds.length - 1; }
  else { ricky.sound = new_sound; }
  
  if (!muted) {
    const audio = new Audio(sounds[ricky.sound]);
    audio.play();
  }

  ricky.element.style.setProperty('background-image', `url(${imgs[ricky.img]})`);
}

function updateBoundries() {
  bound_width  = document.body.clientWidth  - ricky_width;
  bound_height = document.body.clientHeight - ricky_height;

  for (let i = 0; i < rickys.length; i++) {
    const ricky = rickys[i];
    if (ricky.x > bound_width)  { ricky.x = bound_width;  }
    if (ricky.y > bound_height) { ricky.y = bound_height; }
  }
}

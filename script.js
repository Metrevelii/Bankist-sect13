'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

///////////////////////////////////////
// Modal window


const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));


btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


// 188. Implementing Smooth scrolling
btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  // console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);
  // Scrolling
  // Old way
  // one way
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  // second way: smooth scrolling
  
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset, 
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Modern way
  section1.scrollIntoView({ behavior: 'smooth' });

}) 

// 192. Event delegation: implementing page navigation

//////////////////////////////////////////////////////////
// Page Navigation
// document.querySelectorAll('.nav__link').forEach(function(el) {
//   el.addEventListener('click', function(e) {
//     e.preventDefault();
//     // gets #section--1 2 or 3, depending on which is clicked
//     const id = this.getAttribute('href');
    
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//   })
// })


// Getting the same result by using Event delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();
  // shows whole child element: <a class="nav__link" href="#section--1"> ...
  // console.log(e.target);
  
  // Matching strategy
  if(e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
})


// 194. Building a Tabbed Component

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// Marking tabs using Event delegation
tabsContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab');

  // if u click near operations__tab it gets error: null, to fix that:
  // Guard clause
  if (!clicked) return;
  // removing active class to all of them
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // then adding it to one of them
  clicked.classList.add('operations__tab--active');

  //Activating content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
  
})

// 195. Passing arguments to Event Handlers
// Menu fade animation
const handleHover = function(e, opacity) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
  
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    })
    logo.style.opacity = opacity;
  
  }
}

const nav = document.querySelector('.nav');

nav.addEventListener('mouseover', function(e) {
  handleHover(e, 0.5);
})

nav.addEventListener('mouseout', function(e) {
  handleHover(e, 1);
})

//prettier code using bind method
// we have to change = opacity in handleHover function to = this, so this works. 
// nav.addEventListener('mouseover', handleHover.bind(0.5));
// nav.addEventListener('mouseout', handleHover.bind(1)); 

// 197 A Better Way for sticky nav: The Intersection Observer API

// Creating new intersection observer
// const obsCallBack = function(entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
  const [entry] = entries;

  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);


// 198. Revealing Elements on Scroll
// removing section--hidden class when we approach current section
const allSections = document.querySelectorAll('.section');

const revealSection = function(entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  // stop observing after revealing all the sections. (no more console events on scroll)
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})

// 199 Lazy Loading Images

// selecting only imgs that have data-src attribute
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if(!entry.isIntersecting) return;

  // Replace src attribute with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', //root margin loads observed target before '200px'
});

imgTargets.forEach(img => imgObserver.observe(img));


// 200 Building Slider Component

const slider = function() {

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length;

// Functions

// Creating Dots for slider
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)

  })
};
// createDots();

const activateDot = function(slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');

}
// activateDot(0);

// 1st - 0% , 2nd - 100%, 3rd - 200%, 4th - 300%
const goToSlide = function(slide) {
  slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
}
// goToSlide(0);

// curSlide = 1: 1st - -100% , 2nd - 0%, 3rd - 100%, 4th - 200%

const nextSlide = function () {
  if (curSlide == maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide ++;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
}

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
}
//functions
const init = function() {
  goToSlide(0);
  createDots();
  activateDot(0);
}
init();

// Next slide: Event handlers
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// Moving slider using right and left keys
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

// Creating dot Events
dotContainer.addEventListener('click', function (e) {
  if(e.target.classList.contains('dots__dot')) {
    // const slide = e.target.dataset.slide;
    // const slide destructured:
    const {slide} = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
})
};
slider();


// 196. implementing a sticky navigation: The Scroll Event
// Sticky navigation
// scroll event is not adviced to be used. it makes bad performance
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', function(e) {
//   // console.log(window.scrollY);

//   if(this.window.scrollY > initialCoords.top) nav.classList.add('sticky') 
//   else nav.classList.remove('sticky'); 
// })


// 193. DOM Traversing
// const h1 = document.querySelector('h1');

// // Going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes); // rarely used
// console.log(h1.children); // most used 
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// //Going upwards: parents

// console.log(h1.parentNode); // ---> header__title
// console.log(h1.parentElement); // div.header__title

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

// // Going sideways: siblings

// console.log(h1.previousElementSibling); // null, no sibling
// console.log(h1.nextElementSibling); // h4 element

// // useless way
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// // getting all of the siblings
// console.log(h1.parentElement.children);

// // looping over sibling elements
// [...h1.parentElement.children].forEach(function(el) {
//   if (el !== h1) el.style.transform ='scale(0.5)';
// })





// 191. Event Propagation in Practice
// rgb(255, 255, 255)

// const randomInt = (min,max) => Math.floor(Math.random () * (max-min + 1) + min);

// const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();

//   // Stop propagation : now only this element changes colors. not its parents
//   // e.stopPropagation();
  
// });
// document.querySelector('.nav__links').addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav').addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();
// });




// 189. Types of Events and Event Handlers
// Google: Event reference MDN

// const h1 = document.querySelector('h1');
//OLD SCHOOL: Nobody uses xD
// mouseenter: something like Hover
// const alertH1 = function (e) {
//   alert('addEventListener: Great! You are reading the heading');

//   // to listen event only once we can use remove eventlistener :>
//   h1.removeEventListener('mouseenter', alertH1);
// } 
  

// h1.addEventListener('mouseenter', alertH1);
// useless
// h1.onmouseenter = (e) => alert('addEventListener: Great! blablabla');




// 186. Selecting, Creating and Deleting Elements

// console.log(document.documentElement); // logs whole html
// console.log(document.head); // logs head
// console.log(document.body); // logs body

// const header = document.querySelector('.header');

// const allSections = document.querySelectorAll('.section');
// console.log(allSections);


// // Creating and inserting elements
// // .insertAdjacentHTML

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionality and anaytics.';
// message.innerHTML = 'We use cookies for improved functionality and anaytics. <button class="btn btn--close-cookie">Got it!</button>';

// // header.prepend(message); // adds text message with button top of the header
// header.append(message); // does the same but its in the bottom

// // header.append(message.cloneNode(true)); // shows both message top and bottom

// // we can also use before and after message
// // header.before(message);
// // header.after(message);

// // Delete Element
// document.querySelector('.btn--close-cookie').addEventListener('click', () => {
//   // message.remove();
//   message.parentElement.removeChild(message);
// })

// 187. Styles, attributes and Classes 
// Styles
// inline styles -- old way
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// // computed styles => real style that appears on page
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height); 

// message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// // changing color from :root

// document.documentElement.style.setProperty('--color-primary', 'orangered');


// // Attributes

// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt); // alt = "Bankist logo"
// console.log(logo.src); // src="link" .. 

// logo.alt ="Beautiful minimalist logo"; // changes alt name

// // Non-standart
// console.log(logo.designer); // undefined
// console.log(logo.getAttribute('designer')); // gela
// logo.setAttribute('company', 'Bankist'); // sets new attribute: company="Bankist"


// // Data attributes
// // data-version-number = "3.0" in HTML
// console.log(logo.dataset.versionNumber); // 3.0

// // Classes
// logo.classList.add('c', 'j');
// logo.classList.remove('c', 'j');
// logo.classList.toggle('c');
// logo.classList.contains('c');


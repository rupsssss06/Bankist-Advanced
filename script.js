'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
const btnScrollTo=document.querySelector('.btn--scroll-to')
const section1=document.querySelector('#section--1');
const nav=document.querySelector('.nav');
const  tabs= document.querySelectorAll('.operations__tab');
const tabsContainer=document.querySelector('.operations__tab-container');
const tabsContent=document.querySelectorAll('.operations__content');
///////////////////////////////////////
// Modal window

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//Button Scrolling:
btnScrollTo.addEventListener('click', function(e){
  const s1coords=section1.getBoundingClientRect();
  console.log(s1coords);   

  
  /*Scrolling:
  // window.scrollTo(s1coords.left+window.pageXOffset, s1coords.top+window.pageYOffset);

  // window.scrollTo({
  //   left:s1coords.left+window.pageXOffset,
  //   top:s1coords.top+window.pageYOffset,
  //   behavior:'smooth'
   });
   */

  section1.scrollIntoView({behavior:'smooth'});
})

//Page Navigataion:
// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click', function(e){
//     e.preventDefault();
//     // console.log('LINK');
//     const id=this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior:'smooth'});
//   });
// });
//Event Delegation:
//1.Add event listener to common parent element 2. Determine wht element originated the event:
document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();
  // console.log(e.target);
  //Matching Strategy:
  if(e.target.classList.contains('nav__link')){   
    const id=e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
   
  }
});
//Tabbed Content:

// tabs.forEach(t=>t.addEventListener('click', ()=>console.log('TAB')));

//Event Delegation:
tabsContainer.addEventListener('click', function(e){
  const clicked=e.target.closest('.operations__tab') ;
  //Guard Clause:
  if(!clicked) return;
  console.log(clicked);
  tabs.forEach(t=>t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c=>c.classList.remove('operations__content--active'));
  clicked.classList.add('operations__tab--active');
  //Activate Content Area:

  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');

  
});
//Menu Fade Animation
const handleHover=function(e, opacity){
   if(e.target.classList.contains('nav__link')){
    const link=e.target;
    console.log(link);
    const siblings=link.closest('.nav').querySelectorAll('.nav__link');
    console.log(siblings);
    const logo=link.closest('.nav').querySelector('img');
    siblings.forEach(el=>{
      if(el !== link) el.style.opacity=opacity;
      logo.style.opacity=opacity;
    })
     
  }
};
nav.addEventListener('mouseover', function(e){
  handleHover(e, 0.5);
});
nav.addEventListener('mouseout', function(e){
  handleHover(e, 1);
});

/*Sticky Navigation:
// const initialcoords= section1.getBoundingClientRect();
// console.log(initialcoords);
// window.addEventListener('scroll', function(e){
//   console.log(this.window.scrollY );
//   if(this.window.scrollY > initialcoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// })
*/
//Sticky navigation:Intersection Observer API
// const obsCallback=function(entries, Observer){
//   entries.forEach(entry=>{
//     console.log('entry');
//   })
// };
// const obsOptions={
//   root:null,
//   threshold:0.1
// };
// const Observer=new IntersectionObserver(obsCallback,obsOptions);
// Observer.observe(section1);

const header=document.querySelector('.header');
const stickyNav=function(entries){
  const [entry]=entries;
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
  
};
const navHeight=nav.getBoundingClientRect().height;

const headerObserver=new IntersectionObserver(stickyNav,{
  root:null,
  threshold:0,
  rootMargin:`-${navHeight}px`,
});
headerObserver.observe(header);

//Revealing Setions:
const allSections=document.querySelectorAll('.section');

const revealSection=function(entries, observer){
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target); 
  });
};

const sectionObserver=new IntersectionObserver(revealSection,{
  root:null,
  threshold:0.15,

});
allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add( 'section--hidden');
})
//Lazy Loading images:
const imgTargets=document.querySelectorAll('img[data-src]');

const loadImg=function(entries, observer){
    const[entry]=entries;
    
    if(!entry.isIntersecting) return;
    //Replace src with data-src
    entry.target.src=entry.target.dataset.src;
    entry.target.addEventListener('load',function(){
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);

};
const imgObserver=new IntersectionObserver(loadImg,{
  root:null,
  threshold:0,
  rootMargin:'200px'
});
imgTargets.forEach(img=>imgObserver.observe(img));

//Sliders
const slider=function(){
const slides=document.querySelectorAll('.slide');
const slider=document.querySelector('.slider');
const btnLeft=document.querySelector('.slider__btn--left');
const btnRight=document.querySelector('.slider__btn--right');
const maxSlides=slides.length;
let currSlide=0;
const dotContainer=document.querySelector('.dots');
//Functions:
const createDots= function(){
  slides.forEach(function(_, i){
    dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></buttons>`);
  });
};
 
const goToSlide=function(slide){
  slides.forEach((s,i)=>(s.style.transform=`translateX(${100*(i-slide)}%)`))
};
const activateDots=function(slide){
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active') ;
};

const nextSlide=function(){
  if(currSlide===maxSlides-1) currSlide=0;
  else currSlide++;
   goToSlide(currSlide);
   activateDots(currSlide);
};
const prevSlide=function(){
  if(currSlide===0) currSlide=maxSlides-1;
  else currSlide--;
  goToSlide(currSlide);
  activateDots(currSlide);
};
//Functions:
const init=function(){
  goToSlide(0);
  createDots();
  activateDots(0);
  
};
init();
//EVent Handlers:
btnRight.addEventListener('click',nextSlide);
btnLeft.addEventListener('click',prevSlide);
document.addEventListener('keydown', function(e){
  if(e.key ==='ArrowLeft') prevSlide();
  if(e.key==='ArrowRight') nextSlide();

});
dotContainer.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')) {
    currSlide=Number(e.target.dataset.slide);
    goToSlide(currSlide);
    activateDots(currSlide); 
  };
});
};
slider();
/*Lectures:
// Selceting elements:
console.log(document.documentElement);

console.log(document.body);
const header=document.querySelector('.header');
const allSelections=document.querySelectorAll('.section');
console.log(allSelections);

document.getElementById('section--1');
const allButtons=document.getElementsByTagName('button');
console.log(allButtons);
console.log(document.getElementsByClassName('btn'));

//Creating and inserting elemets:
// .insetAdjacentHTML
const message=document.createElement('div');
message.classList.add('cookie-message');
// message.textContent='We use cookies for improved functionality and analytics.';
message.innerHTML='We use cookies for improved functionality and analytics.<button class="btn btn--close-cookie">Got it!</button>';

header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));
// header.append(message);

// header.before(message);
// header.after(message);

//Delete Element:
document.querySelector('.btn--close-cookie').addEventListener('click', function(){
  // message.remove();
  message.parentElement.removeChild(message);
});
//Styles:
message.style.backgroundColor='#37383d';
message.style.width='120%';

console.log(message.style.backgroundColor);
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);
message.style.height=Number.parseFloat(getComputedStyle(message).height,10)+30+'px';
console.log(getComputedStyle(message).height);

//CSS Variables:
// document.documentElement.style.setProperty('--color-primary', 'orangered');

 
//Attributes:
const logo=document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);
logo.alt='beautiful minimalist logo';
logo.setAttribute('company', 'bankist');
console.log(logo.getAttribute('src'));

const link=document.querySelector('.twitter-link');
console.log(link.href);
console.log(link.getAttribute('href'));
const link1=document.querySelector('.nav__link--btn');
console.log(link1.href);
console.log(link1.getAttribute('href'));

//data Attribute: starts with word data
console.log(logo.dataset.versionNumber);

//classes:
logo.classList.add('c', 'j');
logo.classList.remove('c','j');
logo.classList.toggle('c');
logo.classList.contains('c'); //not includes
 

//Don't use:
logo.className='jonas';
*/
//Event:
// const h1=document.querySelector('h1');
// const alertH1=function(e){
//    alert('addEventListener:Great! You are reading the heading :D');
//   //  h1.removeEventListener('mouseenter',alertH1);
// };
// h1.addEventListener('mouseenter',alertH1);
// setTimeout(()=>h1.removeEventListener('mouseenter', alertH1), 3000); 
// h1.onmouseenter=function(e){
//   alert('addEventListener:Great! You are reading the heading :D');
// };

// //Event Propagation:
// //rgb(255, 255, 255);

// const randomInt=(min, max)=> Math.floor(Math.random()*(max-min+1)+min);
// const randomColor=()=>`rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`;

// document.querySelector('.nav__link').addEventListener('click', function(e){
//   // console.log('LINK');
//   this.style.backgroundColor=randomColor();
//   console.log('LINK',e.target, e.currentTarget===this);

//   //Stop propagation:
//   // e.stopPropagation(); 
// });
// document.querySelector('.nav__links').addEventListener('click', function(e){
//   // console.log('LINK');
//   this.style.backgroundColor=randomColor();
//   console.log('Container',e.target,e.currentTarget===this);
// });
// document.querySelector('.nav').addEventListener('click', function(e){
//   // console.log('LINK');
//   this.style.backgroundColor=randomColor();
//   console.log('NAV',e.target, e.currentTarget===this);
// });

//DOM Traversing:
// const h1=document.querySelector('h1');
// //Going downwards:child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color='white';
// h1.lastElementChild.style.color='green';
// console.log(h1.lastElementChild);

// //Going Upwards: Parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background='var(--gradient-secondary)';
// h1.closest('h1').style.background='var(--gradient-primary)'

// //Going Sideways:Siblings:
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// //ALL sibling:
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function(el){
//   if(el!== h1) el.style.transform='scale(0.5)';
// });
//LifeCycle DOM Events:
document.addEventListener('DOMContentLoaded', function(e){
  console.log('HTML Parsed and DOM tree Built', e);
});
window.addEventListener('load', function(e){
  console.log('Page is fully loaded');
});
// window.addEventListener('beforeunload', function(e){
//   e.preventDefault();
//   e.returnValue="";
// })








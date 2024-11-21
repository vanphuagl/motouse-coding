"use strict";

// ===== init =====
const init = () => {
  history.scrollRestoration = "manual";
  // # app-height
  appHeight();
  // # init video
  initVideo();
  // # init loading
  initLoading();
  // # init swiper feature
  const swiperFeature = new Swiper("[data-feature-swiper]", {
    loop: true,
    speed: 600,
    effect: "fade",
    allowTouchMove: false,
    fadeEffect: {
      crossFade: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + (index + 1) + "</span>";
      },
    },
  });
  // # init swiper product

};

// ===== add event on multiple element =====

const addEventOnElements = function (elements, eventType, callback) {
  if (elements) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener(eventType, callback);
    }
  }
};

// ===== app height =====
const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty(
    "--app-height",
    `${document.documentElement.clientHeight}px`
  );
};
window.addEventListener("resize", appHeight);

// ===== lenis =====
const lenis = new Lenis({
  lerp: 0.05,
  smoothWheel: true,
});
lenis.on("scroll", (e) => { });
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ===== init loading =====
const [loading, loadingLogo] = [
  document.querySelector("[data-loading]"),
  document.querySelector("[data-loading-logo]"),
];
const initLoading = function () {
  // ##
  lenis.stop();
  setTimeout(() => {
    loadingLogo.classList.add("is-fade");
    setTimeout(() => {
      $("#js-play").get(0).play();
    }, 1000);
  }, 1000);
  // ##
  setTimeout(function () {
    loading.classList.add("is-done");
    setTimeout(() => {
      lenis.start();
    }, 800);
  }, 3000);
};

// ===== init Video =====
const initVideo = function () {
  let vCont = document.getElementById("fvVideo");
  // autoplay attribute
  if (window.innerWidth > 1023) {
    vCont.innerHTML =
      '<video id="js-play" playsinline muted loop><source src="/assets/img/bg-video-pc.mp4"></video>';
  } else {
    vCont.innerHTML =
      '<video id="js-play" playsinline muted loop><source src="/assets/img/bg-video-sp.mp4"></video>';
  }
};

// ===== menu =====
// ### Toggle
let isOpened = false;
const [menu, menuLogo, menuTogglers, linkTogglers] = [
  document.querySelector("[data-menu]"),
  document.querySelector("[data-menu-logo]"),
  document.querySelectorAll("[data-menu-toggler]"),
  document.querySelectorAll("[data-menu-link]"),
];

const toggleMenu = function () {
  isOpened = !isOpened;
  updateMenu();
};
addEventOnElements(menuTogglers, "click", toggleMenu);

const updateMenu = function () {
  menu.classList.toggle("is-open");
  menuLogo.classList.toggle("is-show");
  menuTogglers[0].classList.toggle("is-close");
  menuTogglers[0].innerText = isOpened ? "close" : "menu";

  if (isOpened) {
    lenis.stop();
  } else {
    lenis.start();
  }
};

// ### Nav link toggle
const toggleLink = () => {
  menu.classList.remove("is-open");
  menuLogo.classList.remove("is-show");
  menuTogglers[0].classList.remove("is-close");
  menuTogglers[0].innerText = "menu";
  lenis.start();
};
addEventOnElements(linkTogglers, "click", toggleLink);

// ### Scroll Menu
$(window).on("pageshow scroll", function () {
  let hSize = $("[data-offsettop]").offset().top - 10,
    scroll = $(window).scrollTop();

  scroll >= hSize
    ? $("[data-header-change]").addClass("is-top")
    : $("[data-header-change]").removeClass("is-top");
});

// ### Scroll Secion
const scrollNav = document.querySelectorAll("[data-scrollto]");
// scroll nav function on click
scrollNav.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault(); // prevent a tag to change url

    // scroll function
    let currentData = item.getAttribute("data-scrollto");
    let currentSection = document.getElementById(currentData);
    if (currentSection) {
      window.scrollTo(
        0,
        currentSection.getBoundingClientRect().top + window.scrollY
      );
    }
  });
});

// ===== handle tab change =====
let numberIndex = 0;
$(window).on("load resize", function () {
  handleTabChange($(".store_nav li.active"));
});

function handleTabChange(tab) {
  $(".store_nav .indicator").css({
    width: tab.outerWidth(),
    left: tab.position() ? tab.position().left : 0,
  });
  tab = tab + 1;
}

$(document).on("click", ".store_nav li", function () {
  numberIndex = $(this).index();

  if (!$(this).is("active")) {
    $(".store_nav li").removeClass("active");
    $(".store_content").removeClass("active");
    // tab
    $(this).addClass("active");
    handleTabChange($(this));
    // content
    $(".store_content:eq(" + numberIndex + ")").addClass("active");
  }
});

// ===== accordion =====
const accordion = document.getElementsByClassName("js-collapse");
const panel = document.getElementsByClassName("js-panel");

for (let i = 0; i < accordion.length; i++) {
  accordion[i].addEventListener("click", function () {
    this.classList.toggle("open");
    if (panel[i].style.maxHeight) {
      panel[i].style.maxHeight = null;
    } else {
      panel[i].style.maxHeight = panel[i].scrollHeight + "px";
    }
  });
}

// ===== popup product =====
let index = 0;
let swiperProduct;

const lightBox = document.querySelector("[data-modal]");
const imgLightbox = document.querySelectorAll("[data-modal-toggler]");

const swiperImages = () => {
  swiperProduct = new Swiper("[data-product-swiper]", {
    loop: true,
    speed: 600,
    fadeEffect: { crossFade: true },
    effect: "fade",
    slidesPerView: 1,
    allowTouchMove: false,
    navigation: {
      nextEl: ".modal-button-next",
      prevEl: ".modal-button-prev",
    },
  })
}
swiperImages();
imgLightbox.forEach((item) =>
  item.addEventListener("click", handleZoomImage)
);

function handleZoomImage(event) {
  let image = event.target.parentElement.getAttribute("data-modal-toggler");
  index = [...imgLightbox].findIndex(
    (item) => item.getAttribute("data-modal-toggler") === image
  );
  swiperProduct.slideTo(index + 1, 0);
  // #
  const swiperModalProduct = new Swiper("[data-modal-swiper]", {
    speed: 1000,
    fadeEffect: { crossFade: true },
    effect: "fade",
    slidesPerView: 1,
    allowTouchMove: false,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    watchSlidesProgress: true,
    observer: true,
  })
  $("[data-modal]").fadeIn(500);
}

$("[data-modal-close]").each(function () {
  $(this).on("click", function () {
    $("[data-modal]").fadeOut(500);
  });
});

// ===== lazy loading =====
const ll = new LazyLoad({
  threshold: 0,
});

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("DOMContentLoaded", init);

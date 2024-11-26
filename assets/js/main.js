"use strict";

// ===== init =====
const init = () => {
  history.scrollRestoration = "manual";
  document.body.classList.remove("--overlay");
  // # app-height
  appHeight();
  // # init video
  // initVideo();
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
  // height menu
  const windowHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
  if (window.innerWidth < 1024) {
    document.querySelector("[data-menu]").style.height = windowHeight + "px";
  }
};
window.addEventListener("resize", appHeight);

// ===== lenis =====
const lenis = new Lenis({
  lerp: 0.05,
  smoothWheel: true,
});
lenis.on("scroll", (e) => {});
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
      // $("#js-play").get(0).play();
      $(".js-play").get(0).play();
      $(".js-play").get(1).play();
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

// ===== modal product =====
let modalSwiper;
modalSwiper = new Swiper(`[data-modal-swiper]`, {
  init: false,
  loop: true,
  speed: 1000,
  fadeEffect: { crossFade: true },
  effect: "fade",
  slidesPerView: 1,
  initialSlide: 0,
  pagination: {
    el: `.swiper-pagination`,
    clickable: true,
    renderBullet: function (index, className) {
      return (
        '<div class="' + className + '"><span class="action"></span></div>'
      );
    },
  },
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
  watchSlidesProgress: true,
  observer: true,
  observeParents: true,
  breakpoints: {
    0: {
      allowTouchMove: true,
    },
    1024: {
      allowTouchMove: false,
    },
  },
});

$("[data-modal]").on("click", function (event) {
  event.preventDefault();
  if (window.innerWidth > 1023) {
    // lenis.stop();
  }

  $($(this).data("modal")).modal({
    fadeDuration: 600,
    fadeDelay: 0.6,
  });

  modalSwiper.forEach((item, index) => {
    modalSwiper[index].init();
    modalSwiper[index].slideTo(0, 0);
  });

  if ($.modal.isActive() == true) {
    $("body").addClass("--overlay");
    $("body").addClass("--pointer-none");
  }
  setTimeout(function () {
    $("body").removeClass("--pointer-none");
  }, 1500);

  return false;
});

// ##
$("[data-modal-close]").on("click", function () {
  $("body").removeClass("--overlay");
  $("body").removeClass("--pointer-none");
  lenis.start();
});

// ##

if (window.innerWidth < 1024) {
  $(".modal-btn").on("click", function () {
    $(this).children(".dropdown").stop().slideToggle("slow");
  });
} else {
  $(".modal-btn").hover(function () {
    $(this).children(".dropdown").slideToggle("slow");
  });
}

// ===== scroll fade content =====
$(window).on("pageshow scroll", function () {
  let scrollTop = $(window).scrollTop();
  let bottom = scrollTop + $(window).height();

  $(".ufade").each(function () {
    if (bottom > $(this).offset().top + 150) {
      $(this).addClass("fadein");
    }
  });
});

// ===== lazy loading =====
const ll = new LazyLoad({
  threshold: 0,
});

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("DOMContentLoaded", init);

(() => {
  if (window.Swiper) {
    new window.Swiper(".olimp-swiper", {
      slidesPerView: 1,
      spaceBetween: 12,
      rewind: true,

      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },

      navigation: {
        nextEl: ".olimp-swiper .swiper-button-next",
        prevEl: ".olimp-swiper .swiper-button-prev",
      },

      pagination: {
        el: ".olimp-swiper .swiper-pagination",
        clickable: true,
      },

      breakpoints: {
        600: { slidesPerView: 2 },
        960: { slidesPerView: 3 },
      },

      a11y: {
        prevSlideMessage: "Попередній слайд",
        nextSlideMessage: "Наступний слайд",
        paginationBulletMessage: "Перейти до слайда {{index}}",
      },
    });
  }

  if (window.Fancybox) {
    window.Fancybox.bind('[data-fancybox="olimp-gallery"]', {
      Carousel: { transition: "slide" },
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: [],
          right: ["iterateZoom", "close"],
        },
      },
    });
  }
})();

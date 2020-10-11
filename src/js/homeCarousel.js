$(document).ready(function(){
  $("#homeCarousel").owlCarousel({
    autoplay: true,
    autoplayTimeout: 3000,
    loop: true,
    center: true,
    margin: 10,
    nav: true,
    responsiveClass: true,
    responsive: {
      0:{
        items:1
      },
      600:{
          items:3
      },
      1000:{
          items:4
      }
    }
  });
});
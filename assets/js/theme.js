
      (function ($) {"use strict";
      
      $(function () {
        var header = $(".start-style");
        $(window).scroll(function () {
          var scroll = $(window).scrollTop();
    
          if (scroll >= 10) {
            header.removeClass('start-style').addClass("scroll-on");
          } else {
            header.removeClass("scroll-on").addClass('start-style');
          }
        });
      });
    
      //Animation
    
      $(document).ready(function () {
        $('body.hero-anime').removeClass('hero-anime');
      });
    
      //Menu On Hover
    
      $('body').on('mouseenter mouseleave', '.nav-item', function (e) {
        if ($(window).width() > 750) {
          var _d = $(e.target).closest('.nav-item');_d.addClass('show');
          setTimeout(function () {
            _d[_d.is(':hover') ? 'addClass' : 'removeClass']('show');
          }, 1);
        }
      });
    
    
    
    })(jQuery);

// Blank Target External Links
$(document.links).filter(function() {
return this.hostname != window.location.hostname;
}).attr('target', '_blank');

// Dark Mode Toggle
(function ($) {
  const toggleButton = $('#theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';

  // 적용된 테마에 따라 data-theme 속성 설정
  if (currentTheme === 'dark') {
    $('html').attr('data-theme', 'dark');
  }

  // 버튼 클릭 시 다크 모드/라이트 모드 전환
  toggleButton.on('click', function () {
    const theme = $('html').attr('data-theme') === 'dark' ? 'light' : 'dark';
    $('html').attr('data-theme', theme);
    localStorage.setItem('theme', theme);
  });
})(jQuery);

(function ($) {
  $.fn.WIF_SLIDESHOW = function (options) {
    let opt = {
      width: "100%", // Width and height of the images
      height: 400,

      bullets: {
        // bulletsPosition of the navigation
        position: "center",
      },

      auto: true, // Auto rotate
      autoSpeed: 4000,
      fadeSpeed: 1000,
    };

    this.each(function () {
      if (options) {
        $.extend(opt, options);
      }

      /* Container and wrapper
			-----------------------------------------------*/
      $(this).children().wrapAll('<div class="wifSlide" />');
      let container = $(this).find(".wifSlide");
      container.find("img").wrapAll('<div class="wrapper" />');
      let wrapper = container.find(".wrapper");

      /* Previous & next buttons
			-----------------------------------------------*/
      container.append('<div class="prev"></div><div class="next"></div>');

      /* Left & right Logo
			-----------------------------------------------*/
      if (opt.logo.left && opt.logo.right) {
        container.append(
          `<img class="slide__logo slide__logo--left" src='${opt.logo.left}'/>`
        );
        container.append(
          `<img class="slide__logo slide__logo--right" src='${opt.logo.right}'/>`
        );
      }
      /* Navigation & captions
			-----------------------------------------------*/
      switch (
        opt.bullets.position // Navigation bulletsPosition
      ) {
        case "left":
          container.append('<div class="nav left" />');
          break;
        case "center":
          container.append('<div class="nav center" />');
          break;
        case "right":
          container.append('<div class="nav right" />');
          break;
      }

      let nav = container.find(".nav");

      wrapper.find("img").each(function (i) {
        if (opt.bullets) {
          // Bullet navigation
          nav.append('<a href="#"></a>');
        }

        // Captions
        let title = $(this).attr("title");
        let subtitle = $(this).attr("data-subtitle");
        let country = $(this).attr("data-country");
        let button_title = $(this).attr("data-link-title");
        let button_link = $(this).attr("data-link");

        $(this).wrapAll('<div class="image" />');

        $(this).after('<div class="slide__info"></div>');
        $(this).attr("title", "");
        if (subtitle) {
          $(this)
            .next(".slide__info")
            .append(`<span class="slide__info--subTitle">${subtitle}</span>`);
        }

        $(this)
          .next(".slide__info")
          .append(`<h3 class="slide__info--title">${title}</h3>`);
        $(this).next(".slide__info").append(`<hr>`);
        $(this)
          .next(".slide__info")
          .append(`<h5 class="slide__info--country">${country}</h5>`);

        $(this)
          .next(".slide__info")
          .append(
            `<div><a target="_blank" href="${button_link}" class="slide__info--button">${button_title}</a></div>`
          );
      });

      /* Slider Object
			-----------------------------------------------*/
      let Slider = function () {
        this.imgs = wrapper.find("div.image");
        this.imgCount = this.imgs.length - 1; // Match index
        this.navPrev = container.find(".prev");
        this.navNext = container.find(".next");

        this.bullets = container.find(".nav a");

        this.getCurrentIndex = function () {
          // Index
          return this.imgs.filter(".current").index();
        };

        this.go = function (index) {
          // Rotate images
          this.imgs
            .removeClass("current")
            .fadeOut(opt.fadeSpeed)
            .eq(index)
            .fadeIn(opt.fadeSpeed)
            .addClass("current");
          this.bullets.removeClass("current").eq(index).addClass("current");
        };

        this.next = function () {
          let index = this.getCurrentIndex();
          if (index < this.imgCount) {
            this.go(index + 1); // Go next
          } else {
            this.go(0); // If last go first
          }
        };

        this.prev = function () {
          let index = this.getCurrentIndex();
          if (index > 0) {
            this.go(index - 1); // Go previous
          } else {
            this.go(this.imgCount); // If first go last
          }
        };

        this.init = function () {
          // Init
          container
            .width(opt.width)
            .height(opt.height); /* Set width and height */

          this.imgs
            .hide()
            .first()
            .addClass("current")
            .show(); /* Set current image */
          this.bullets.first().addClass("current");
        };
      };

      let slider = new Slider();
      slider.init();

      /* Mouse Events
			-----------------------------------------------*/
      container.hover(function () {
        // Hover image wrapper

        slider.navNext.stop(true, true).fadeToggle();
        slider.navPrev.stop(true, true).fadeToggle();
      });

      slider.navNext.click(function (e) {
        // Click next button

        e.preventDefault();
        slider.next();
      });
      slider.navPrev.click(function (e) {
        // Click previous button
        e.preventDefault();
        slider.prev();
      });
      slider.bullets.click(function (e) {
        // Click numbered bullet
        e.preventDefault();

        slider.go($(this).index());
      });

      /* Auto Rotate	
			-----------------------------------------------*/
      if (opt.auto === true) {
        let timer = function () {
          slider.next();
        };
        let interval = setInterval(timer, opt.autoSpeed);

        // Pause when hovering image
        wrapper.hover(
          function () {
            clearInterval(interval);
          },
          function () {
            interval = setInterval(timer, opt.autoSpeed);
          }
        );

        // Reset timer when clicking thumbnail or bullet

        slider.bullets.click(function () {
          clearInterval(interval);
          interval = setInterval(timer, opt.autoSpeed);
        });
      }
    });
  };
})(jQuery);

/*______________________________     WIF SLIDSHOW START        __________________________*/
$("#slider").WIF_SLIDESHOW({
  logo: {
    left: "https://worldinvestmentforum.unctad.org/wp-content/uploads/2018/03/logo_wif2018.png",
    right:
      "https://worldinvestmentforum.unctad.org/wp-content/uploads/2018/02/unctad_transparent.png",
  },
  bullets: {
    position: "center", // options "left", "center", right
  },
});

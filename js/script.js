/**
* Fama Barber Shop & Beauty Salon - Custom JS
*/
document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('loaded'); // Add class to trigger fade out
      setTimeout(() => {
          preloader.remove();
      }, 500); // Remove after animation
    });
  }

  /**
   * Sticky header on scroll
   */
  const selectHeader = document.querySelector('#header');
  if (selectHeader) {
    let headerOffset = selectHeader.offsetTop;
    const nextElement = selectHeader.nextElementSibling; // If there's an element right after header to get offset from

    const headerFixed = () => {
      // Use a more reliable offset if nextElement exists, otherwise fallback
      let currentOffset = nextElement ? (selectHeader.offsetHeight + nextElement.offsetTop) : 100;
      if ((headerOffset - window.scrollY) <= 0 || window.scrollY > currentOffset) {
        selectHeader.classList.add('header-scrolled');
      } else {
        selectHeader.classList.remove('header-scrolled');
      }
    }
    window.addEventListener('load', headerFixed);
    document.addEventListener('scroll', headerFixed);
  }

  /**
   * Mobile nav toggle
   */
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', function(e) {
      const navbar = document.querySelector('#navbar');
      navbar.classList.toggle('navbar-mobile');
      this.classList.toggle('fa-bars');
      this.classList.toggle('fa-times'); // Assuming you use fa-times for close
    });
  }

  /**
   * Scrool with ofset on links with a class name .scrollto
   * And active state on scroll for navbar links
   */
  let navbarlinks = document.querySelectorAll('#navbar .scrollto, #navbar .nav-link'); // Include .nav-link for direct hrefs

  const navbarlinksActive = () => {
    let position = window.scrollY + (selectHeader ? selectHeader.offsetHeight : 0) + 50; // Offset for header and buffer
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      let section = document.querySelector(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('#navbar .active').forEach(el => el.classList.remove('active'));
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    })
     // Ensure home is active if at top
    if (window.scrollY < (document.querySelector('#hero') ? document.querySelector('#hero').offsetHeight / 2 : 200)) {
        const homeLink = document.querySelector('#navbar a[href="#hero"]');
        if (homeLink && !homeLink.classList.contains('active')) {
            document.querySelectorAll('#navbar .active').forEach(el => el.classList.remove('active'));
            homeLink.classList.add('active');
        }
    }
  }
  window.addEventListener('load', navbarlinksActive);
  document.addEventListener('scroll', navbarlinksActive);

  const scrollto = (el) => {
    let header = document.querySelector('#header');
    let offset = header.offsetHeight;

    let elementPos = document.querySelector(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    });
  }
  
  // Attach click event to scrollto links
  document.querySelectorAll('.scrollto, .nav-link[href*="#"]:not([href="#"])').forEach(link => {
      link.addEventListener('click', function(e) {
          if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
              let target = document.querySelector(this.hash);
              if (target) {
                  e.preventDefault();
                  scrollto(this.hash);

                  // If mobile nav is active, close it
                  const navbar = document.querySelector('#navbar');
                  if (navbar.classList.contains('navbar-mobile')) {
                      navbar.classList.remove('navbar-mobile');
                      const navToggle = document.querySelector('.mobile-nav-toggle');
                      navToggle.classList.remove('fa-times');
                      navToggle.classList.add('fa-bars');
                  }
              }
          }
      });
  });


  /**
   * Back to top button
   */
  const backtotop = document.querySelector('.back-to-top');
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active');
      } else {
        backtotop.classList.remove('active');
      }
    }
    window.addEventListener('load', toggleBacktotop);
    document.addEventListener('scroll', toggleBacktotop);
    backtotop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * Init AOS
   */
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
  });

  /**
   * Testimonials slider
   */
  if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonials-slider', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      }
    });
  }

  /**
   * Porfolio isotope and filter (If you add filtering later)
   * For now, just initialize Fancybox for gallery
   */
  if (typeof Fancybox !== 'undefined') {
      Fancybox.bind("[data-fancybox='gallery']", {
        Toolbar: {
          display: {
            left: ["infobar"],
            middle: [],
            right: ["slideshow", "thumbs", "close"],
          },
        },
      });
  }
  
  /**
   * Contact Form Submission using Web3Forms
   * This is a basic example. For robust error handling and UX, more is needed.
   */
  const contactForm = document.querySelector('.php-email-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const loading = this.querySelector('.loading');
      const errorMessage = this.querySelector('.error-message');
      const sentMessage = this.querySelector('.sent-message');
      
      loading.style.display = 'block';
      errorMessage.style.display = 'none';
      sentMessage.style.display = 'none';

      const formData = new FormData(this);
      const object = {};
      formData.forEach((value, key) => object[key] = value);
      const json = JSON.stringify(object);

      fetch('https://api.web3forms.com/submit', { // Ensure form action matches this
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: json
      })
      .then(async (response) => {
          let jsonResponse = await response.json();
          if (response.status == 200) {
              if(jsonResponse.success){
                  sentMessage.innerHTML = jsonResponse.message || "Your message has been sent. Thank you!";
                  sentMessage.style.display = 'block';
                  this.reset(); // Clear the form
              } else {
                  errorMessage.innerHTML = jsonResponse.message || "An error occurred. Please try again.";
                  errorMessage.style.display = 'block';
              }
          } else {
              console.error('Form submission failed:', jsonResponse);
              errorMessage.innerHTML = jsonResponse.message || "An error occurred. Please try again.";
              errorMessage.style.display = 'block';
          }
      })
      .catch(error => {
          console.error('Error submitting form:', error);
          errorMessage.innerHTML = "An unexpected error occurred. Please try again later.";
          errorMessage.style.display = 'block';
      })
      .finally(() => {
          loading.style.display = 'none';
      });
    });
  }

  /**
   * Set current year in footer
   */
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
  }

});
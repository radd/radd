
(function () {

  var sidebar = document.getElementById("sidebar");
  var container = document.getElementById("container");
  var navigation = document.getElementById("navigation");
  var sidebarNavigation = document.querySelector("#sidebar .navigation");
  var body = document.getElementsByTagName("body")[0];
  var overlay = document.getElementById("overlay");
  var popUp = document.getElementById("popUp");

  ///////////////////////
  // Scroll Animations
  ///////////////////////

  // setTimeout( () => {
  // }, 1000);
  var sr = ScrollReveal({useDelay: 'onload'});
  var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy",
    // load_delay: 1000,
    callback_reveal: function (el) {
      sr.reveal(el, { duration: 1500 });
    }

  });


  enableReveal();
  // var animEls = document.getElementsByClassName('load-hidden');
  // for (var i = 0; i < animEls.length; i++) {
  //   animEls[i].style.visibility = "visible";
  // }

  function enableReveal() {
    // var sr = ScrollReveal({useDelay: 'onload'});

    sr.reveal('#nav .logo .author-info', { duration: 1000, delay: 200 });
    sr.reveal('#top .top-left', { duration: 1000, delay: 200 });
    sr.reveal('#menu', { duration: 1000, delay: 200 });
    sr.reveal('section.top .title', { duration: 1000, delay: 300 });
    sr.reveal('section.top .about', { duration: 1000, delay: 400 });
    sr.reveal('.projects-btn', { duration: 1000, scale: .5, delay: 500 });

    sr.reveal('.contact-item ', { duration: 1000, scale: .8 });

    // sr.reveal('.lazy', { duration: 2000 });
  }

  ///////////////////////
  // Overlay
  ///////////////////////

  function showOverlay() {
    overlay.classList.add("active");
    //body.classList.add("no-scroll");
  }

  overlay.addEventListener("click", (e) => {
    e.stopPropagation();
    closeOverlay();
  });

  overlay.addEventListener("touchstart", (e) => {
    e.preventDefault();
    closeOverlay();
  });

  function closeOverlay() {
    if (overlay.classList.contains("active")) {
      overlay.classList.remove("active");
      // body.classList.remove("no-scroll");

      closeSidebar();
      closePopUp();
    }
  }

  function closeSidebar() {
    sidebar.classList.remove("active");
    container.classList.remove(getSidebarSide() + "-sidebar-active");
  }

  function closePopUp() {
    popUp.classList.remove("active");
  }

  function openPopUp() {
    showOverlay();
    popUp.classList.add("active");
  }


  ///////////////////////
  // Menu links and buttons
  ///////////////////////

  var hasMenuRight = document.querySelector('.menu-mobile-right');

  function getSidebarSide() {
    var side = 'left';
    var width = window.innerWidth;
    if(hasMenuRight && width <= 768) {
      side = 'right';
    }
    return side;
  }

  document.getElementById("openMenu").addEventListener("click", (e) => {
    openMenu(e);
  });

  document.getElementById("menuFixed").addEventListener("click", (e) => {
    openMenu(e);
  });

  function openMenu() {
    showOverlay();
    // body.classList.add("no-scroll");
    sidebar.classList.add("active");

    container.classList.add(getSidebarSide() + "-sidebar-active");
  }

  // intercept menu links
  var menuEls = navigation.getElementsByTagName('a');
  for (var i = 0, len = menuEls.length; i < len; i++) {
    menuEls[i].onclick = function (event) {
      menuOnClick(event);
    }
  }

  // intercept mobile menu links
  var menuMobileEls = sidebar.getElementsByTagName('a');
  for (var i = 0, len = menuMobileEls.length; i < len; i++) {
    menuMobileEls[i].onclick = function (event) {
      menuOnClick(event, true);
    }
  }

  function menuOnClick(event, mobile = false) {
    var anchor = event.currentTarget.getAttribute("href");
    if (anchor == null || !anchor.startsWith("#"))
      return;

    event.preventDefault();

    if (mobile) {
      closeOverlay();
      selectMenuItem(event.currentTarget);
    }

    doScrolling(anchor);

    saveHistory(anchor);
  }

  function saveHistory(anchor) {
    if (anchor === "#home")
      window.history.pushState('', "" + anchor, "/");
    else
      window.history.pushState('', "" + anchor, "/" + anchor);
  }

  // intercept buttons 
  var btnEls = document.getElementsByTagName('button');
  for (var i = 0, len = btnEls.length; i < len; i++) {
    btnEls[i].onclick = function (event) {
      btnOnClick(event);
    }
  }

  function btnOnClick(event, mobile = false) {
    var anchor = event.currentTarget.getAttribute("data-href");
    if (anchor == null || !anchor.startsWith("#"))
      return;

    event.preventDefault();

    doScrolling(anchor);

    saveHistory(anchor);
  }

  //TODO all link and buttons 
  function selectMenuItem(item) {

    var liEls = sidebarNavigation.getElementsByTagName('li');
    for(var i=0; i<liEls.length; i++) {
      liEls[i].classList.remove('active');
    }

    item.parentElement.classList.add('active');

  }

    // intercept title links
    var titleLinks = document.querySelectorAll(".title-anchor");
    for (var i = 0, len = titleLinks.length; i < len; i++) {
      titleLinks[i].onclick = function (event) {
        menuOnClick(event);
      }
    }

  // scroll animation - https://jsfiddle.net/s61x7c4e/
  function getElementY(query) {
    return window.pageYOffset + document.querySelector(query).getBoundingClientRect().top
  }

  //edited - @radd
  function doScrolling(element) {

    var startingY = window.pageYOffset
    var elementY = getElementY(element)
    // If element is close to page's bottom then window will scroll only to some position above the element.
    var targetY = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight : elementY
    var diff = targetY - startingY
    var duration = 1000;
    //console.log(diff);

    if (diff < 1000)
      duration = 1000;
    else if (diff < 3000)
      duration = 1500;
    else
      duration = 2000;

    // Easing function: easeInOutQuart
    // From: https://gist.github.com/gre/1650294
    var easing = function (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t }
    var start

    if (!diff) return

    // Bootstrap our animation - it will get called right before next frame shall be rendered.
    window.requestAnimationFrame(function step(timestamp) {
      if (!start) start = timestamp
      // Elapsed miliseconds since start of scrolling.
      var time = timestamp - start
      // Get percent of completion in range [0, 1].
      var percent = Math.min(time / duration, 1)
      // Apply the easing.
      // It can cause bad-looking slow frames in browser performance tool, so be careful.
      percent = easing(percent)

      window.scrollTo(0, startingY + diff * percent)

      // Proceed with animation as long as we wanted it to.
      if (time < duration) {
        window.requestAnimationFrame(step)
      }
    })
  }
  // scroll animation - https://jsfiddle.net/s61x7c4e/

  var scrollEls = {}

  scrollEls.scrollTop = {};
  scrollEls.scrollTop.elDOM = document.getElementById('scrollTop');
  scrollEls.scrollTop.isVisible = false;
  scrollEls.scrollTop.threshold = 1000;

  scrollEls.menuFixed = {};
  scrollEls.menuFixed.elDOM = document.getElementById('menuFixed');
  scrollEls.menuFixed.isVisible = false;
  var topSection = document.querySelector('.top');
  scrollEls.menuFixed.threshold = topSection.offsetTop + topSection.offsetHeight;

  function scrollListener() {
    var windowY = window.scrollY;
    for (var i in scrollEls) {
      var el = scrollEls[i];
      if(el.isVisible) {
        if(windowY <= el.threshold) {
          el.isVisible = false;
          el.elDOM.classList.remove('active');
        }
      }
      else {
        if(windowY > el.threshold) {
          el.isVisible = true;
          el.elDOM.classList.add('active');
        }
      }
    }
  }

  function throttle(fn, wait) {
    var time = Date.now();
    return function() {
      if ((time + wait - Date.now()) < 0) {
        fn();
        time = Date.now();
      }
    }
  }

  window.addEventListener('scroll', throttle(scrollListener, 100));
  

  ///////////////////////
  // PopUp
  ///////////////////////

  function popUp_setTitle(title) {
    popUp.getElementsByClassName('title')[0].innerHTML = title;
  }

  function popUp_setContentHTML(content) {
    popUp.getElementsByClassName('panel-content')[0].innerHTML = content;
  }

  function popUp_setContentEl(content) {
    popUp.getElementsByClassName('panel-content')[0].appendChild(content);
  }

  function popUp_createAction(el, href, html) {
    var item = document.createElement(el);
    if(el === 'a')
      item.setAttribute('href', href);
    item.setAttribute('class', 'action-btn');
    item.innerHTML = html;
    return item;
  }

  function popUp_removeActions() {
    popUp.getElementsByClassName('panel-action')[0].innerHTML = '';
  }

  function popUp_addAction(item) {
    popUp.getElementsByClassName('panel-action')[0].appendChild(item);
  }

  popUp.getElementsByClassName('close')[0].addEventListener( 'click', (e) => {
    closeOverlay();
  });

  ///////////////////////
  // Email
  ///////////////////////

  function hgiycrn(jore = false) {
    var skamf = 16; var enfwf = 41; if (jore) skamf = 9; var aklng = ""; for (var yjtaie = ["Pg", "aw", "Lw", "aQ", "bQ", "eg", "YQ", "YQ", "Pg", "PQ", "dw", "Lg", "Zw", "ZQ", "aQ", "bQ", "cw", "cA", "cg", "ZQ", "cg", "PA", "cw", "IA", "Lg", "ZA", "cw", "eg", "cw", "aQ", "dw", "eg", "bQ", "QA", "aA", "cg", "bA", "Zg", "Yw", "bw", "bA", "Yw", "YQ", "bw", "Ig", "aQ", "aQ", "dA", "bw", "ZA", "cA", "ZQ", "Lg", "cg", "Zw", "Lg", "YQ", "Og", "bQ", "cg", "eg", "bA", "aQ", "YQ", "aQ", "PA", "YQ", "bQ", "QA", "Ig", "YQ", "aw"], ozimor = [71, 29, 69, 30, 60, 22, 34, 70, 42, 7, 54, 45, 32, 26, 11, 40, 28, 16, 17, 5, 46, 0, 24, 2, 64, 21, 51, 49, 55, 62, 27, 52, 33, 58, 3, 19, 12, 6, 38, 14, 36, 65, 10, 66, 41, 50, 57, 13, 39, 48, 43, 53, 18, 4, 59, 37, 47, 15, 9, 44, 25, 63, 23, 1, 35, 68, 20, 67, 31, 8, 61, 56], hfswvy = new Array, i = 0; i < ozimor.length; i++)hfswvy[ozimor[i]] = yjtaie[i]; for (var i = skamf; i < enfwf; i++)aklng += atob(hfswvy[i] + "=="); return aklng;
  }

  var email = hgiycrn();
  var email2 = hgiycrn(true);

  var contactEmail = document.getElementById('contactEmail');
  var emailTop = document.getElementById('emailTop');
  
  // Show contact email
  setTimeout(() => {
    contactEmail.getElementsByClassName('subtitle')[0].innerHTML = email;
  }, 5000);

  emailTop.addEventListener( 'click', (e) => {
    e.preventDefault();
    showEmail();
  });

  contactEmail.addEventListener( 'click', (e) => {
    e.preventDefault();
    showEmail();
  });

  function showEmail() {
    createEmailPopUp();
    openPopUp();
  }

  function createEmailPopUp() {
    popUp_setTitle('Email');

    var emailInput = document.createElement('input');
    emailInput.setAttribute('value', email);
    
    popUp_setContentHTML('');
    popUp_setContentEl(emailInput);
    popUp_removeActions();

    var sendEmail = popUp_createAction('a', email2, 'Send email');
    var copyEmail = popUp_createAction('button', '', 'Copy email');

    copyEmail.addEventListener('click', (e) => {
      emailInput.select();
      document.execCommand('copy');
      emailInput.blur();
      e.target.innerHTML = "Copied";
    })

    popUp_addAction(sendEmail);
    popUp_addAction(copyEmail);
  }

})();

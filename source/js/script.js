// debouncer
function debounce(func, wait = 20, immediate = true) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// scrollers
/*(function() {
  const header = document.querySelector('.header');
  const down = document.querySelector('.scroll-down');
  let previos = window.scrollY;

  document.addEventListener('scroll', debounce(showMenu));
  down.addEventListener('click', scrollDown);

  function showMenu() {
    const current = window.scrollY;
    if (current > previos) {
      header.classList.remove('header--sticky');
      down.classList.add('scroll-down--show');
    } else {
      header.classList.add('header--sticky');
      down.classList.remove('scroll-down--show');
    }
    previos = current;
  }

  function scrollDown() {
    window.scrollBy({
      top: window.innerHeight,
      left: 0,
      behavior: 'smooth'
    });
  }
})();*/

// facts
(function() {
  const window = document.querySelector('.facts__window');
  const list = document.querySelector('.facts__list');
  const item = document.querySelector('.facts__item');
  let transform = 0;

  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('touchstart', onMouseDown);

  function onMouseDown(downEvt) {
    if (downEvt.type === 'mousedown' && downEvt.buttons !== 1) return;
    if (downEvt.type === 'mousedown') downEvt.preventDefault();

    const startX = downEvt.clientX || downEvt.touches[0].clientX;
    const width = item.offsetWidth;
    const length = list.offsetWidth - window.offsetWidth;
    let diff = 0;
    list.style.transition = ``;

    function onMouseMove(moveEvt) {
      const x = moveEvt.clientX || moveEvt.touches[0].clientX;
      diff = startX - x;
      const temp = transform + diff;
      list.style.transform =
        temp > length
          ? `translateX(-${length}px)`
          : `translateX(-${transform + diff}px)`;
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('touchend', onMouseUp);
      const temp = transform + diff;
      transform = temp > length ? length : temp < 0 ? 0 : temp;
      const limit = Math.round(transform / width);
      transform = width * limit;
      list.style.transition = `transform 0.3s cubic-bezier(0.28, 0.82, 0.4, 0.82)`;
      list.style.transform = `translateX(-${transform}px)`;
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onMouseMove);
    document.addEventListener('touchend', onMouseUp);
  }
})();

// problems
(function() {
  const buttons = document.querySelectorAll('.problems__btn');
  let currentOpen = document.querySelector('.problems__item--open');

  buttons.forEach((button) =>
    button.addEventListener('click', function(evt) {
      toggleText(this);
    })
  );

  function toggleText(that) {
    const parent = that.parentElement;
    if (!parent.classList.contains('problems__item--open')) {
      parent.classList.remove('problems__item--closed');
      parent.classList.add('problems__item--open');
      currentOpen.classList.remove('problems__item--open');
      currentOpen.classList.add('problems__item--closed');
      currentOpen = parent;
    }
  }
})();

// colony
(function() {
  const buttons = document.querySelectorAll('.colony__btn');
  let currentOpen = document.querySelector('.colony__item--open');
  const textWrappers = document.querySelectorAll('.colony__article');
  const divWrapper = document.querySelector('.colony__wrapper');
  let check;
  const maxHeight = [];

  if (window.innerWidth < 542) {
    check = false;
    textWrappers.forEach(wrapper => {
      const parent = wrapper.parentElement;
      maxHeight.push(wrapper.scrollHeight);
      if (!parent.classList.contains('colony__item--open')) {
        wrapper.style.maxHeight = '0';
      } else {
        wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
      }
    });
  }

  if (window.innerWidth >= 542) {
    check = true
    textWrappers.forEach(wrapper => {
      maxHeight.push(wrapper.scrollHeight);
    });
  }

  buttons.forEach((button, index) =>
    button.addEventListener('click', function(evt) {
      toggleText(this, index);
    })
  );

  if (check) rescaleWrapper(0);

  function toggleText(that, index) {
    const parent = that.parentElement;
    const textWrapper = parent.lastChild;
    if (!parent.classList.contains('colony__item--open')) {
      parent.classList.add('colony__item--open');
      currentOpen.classList.remove('colony__item--open');
      if (check) {
        rescaleWrapper(index);
      } else {
        textWrapper.style.maxHeight = (maxHeight[index] + 200) + 'px';
        currentOpen.lastChild.style.maxHeight = '0';
      }
      currentOpen = parent;
    }
  }

  function rescaleWrapper(index) {
    let first = divWrapper.children[0].scrollHeight;
    let second = divWrapper.children[1].scrollHeight;
    const check = window.innerWidth < 967.5;

    const height = check ? first + second : first + 50;
    divWrapper.style.minHeight = (maxHeight[index] + height + 75) + 'px';
  }
})();

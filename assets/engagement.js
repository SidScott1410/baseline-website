/* Optional reading feedback. The complete document remains visible without JavaScript. */
(function () {
  'use strict';
  var progress = document.querySelector('[data-reading-progress]');
  var links = Array.from(document.querySelectorAll('.primary-links a'));
  var sections = [
    'top', 'landscape', 'thesis', 'roadmap', 'who-it-serves',
    'groups', 'questions', 'involved', 'publications'
  ].map(function (id) { return { id: id, node: document.getElementById(id) }; });
  var ticking = false;
  function update() {
    ticking = false;
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var fraction = Math.min(1, Math.max(0, window.scrollY / max));
    if (progress) progress.style.transform = 'scaleX(' + fraction.toFixed(4) + ')';
    var current = sections[0];
    var masthead = document.querySelector('.masthead');
    var threshold = (masthead ? masthead.offsetHeight : 84) + 80;
    sections.forEach(function (section) {
      if (section.node && section.node.getBoundingClientRect().top <= threshold) current = section;
    });
    links.forEach(function (link) {
      if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('load', schedule);
  if (document.fonts) document.fonts.ready.then(schedule);
  update();
})();

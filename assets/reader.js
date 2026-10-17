/* Optional reading utilities. Anchors, PDF access and native disclosures work without JS. */
(function () {
  'use strict';

  function openLinkedDisclosure() {
    var id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch (_) { return; }
    var target = document.getElementById(id);
    if (!target || target.tagName !== 'DETAILS') return;
    target.open = true;
    target.scrollIntoView({ block: 'start' });
    var summary = target.querySelector('summary');
    if (summary) summary.focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', openLinkedDisclosure);
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (link.hash === window.location.hash) openLinkedDisclosure();
    });
  });
  openLinkedDisclosure();

  document.querySelectorAll('.wg-row').forEach(function (row) {
    row.addEventListener('keydown', function (event) {
      if (event.target !== row || row.scrollWidth <= row.clientWidth) return;
      var firstCard = row.firstElementChild;
      var distance = firstCard.getBoundingClientRect().width + parseFloat(getComputedStyle(row).gap || '0');
      var left;
      if (event.key === 'ArrowRight') left = row.scrollLeft + distance;
      else if (event.key === 'ArrowLeft') left = row.scrollLeft - distance;
      else if (event.key === 'Home') left = 0;
      else if (event.key === 'End') left = row.scrollWidth;
      else return;
      event.preventDefault();
      row.scrollTo({ left: left, behavior: 'instant' });
    });
  });

  var copy = document.querySelector('[data-copy-citation]');
  if (!copy) return;
  copy.hidden = false;
  copy.addEventListener('click', async function () {
    var text = document.getElementById('briefing-reference');
    var feedback = document.getElementById('citation-feedback');
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text.textContent.trim());
      feedback.textContent = 'Reference copied.';
    } catch (_) {
      // Select the visible reference instead of falsely claiming clipboard success.
      var selection = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
      feedback.textContent = 'Reference selected. Copy it using your keyboard or device controls.';
    }
  });
})();

/* What Loretta is reading — edit this list to update books.html.
   Rows render in order and are numbered automatically. A classic (non-module)
   script so it also renders when the page is opened straight from disk. */
(function () {
  var NIGHTSTAND = {
    // Destination for the "See what's on the nightstand" link.
    // TODO: point at the full reading list (e.g. Goodreads / LinkedIn post) once it exists.
    link: '#nightstand',
    books: [
      { author: 'Ray Dalio',        title: 'Principles' },
      { author: 'Ben Horowitz',     title: 'The Hard Thing About Hard Things' },
      { author: 'Mustafa Suleyman', title: 'The Coming Wave' },
      { author: 'Erin Meyer',       title: 'The Culture Map' },
      { author: 'Benjamin Hoff',    title: 'The Tao of Pooh' }
    ]
  };

  var shelf = document.getElementById('nightstandList');
  if (!shelf) return;
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  shelf.innerHTML = NIGHTSTAND.books.map(function (b, i) {
    return '<div class="punk-row">' +
      '<span class="punk-row-num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span class="punk-row-type">' + esc(b.author) + '</span>' +
      '<div class="punk-row-title-wrap"><span class="punk-row-title">' + esc(b.title) + '</span></div>' +
      '</div>';
  }).join('');
  var more = document.getElementById('nightstandLink');
  if (more && NIGHTSTAND.link) more.href = NIGHTSTAND.link;
})();

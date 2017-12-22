const $ = require('jbone');

// TODO: Rewrite it, this file was created fro POC purpose

function popupTemplate(link) {
  return `
    <div class="overlay">
      <div class="popup">
        <iframe width="815" height="515" src="${link}" allowpaymentrequest allowfullscreen="allowfullscreen" frameborder="0"></iframe>
      </div>
    </div>
  `.trim();
}

const openPopup = function(link) {
  const div = document.createElement('div');

  div.innerHTML = popupTemplate(`${link}embedded/result,js/dark/`);

  document.body.appendChild(div.firstChild);
};

const closePopup = function() {
  $('.overlay').remove();
};

const handlePopupClicks = function() {
  $('body').on('click', '.overlay', function() {
    closePopup();
  });

  document.addEventListener('keyup', function(e) {
    // ESC button
    if (e.keyCode === 27) {
      closePopup();
    }
  });
};

const handleDemoClicks = function() {
  $('body').on('click', 'a', function(e) {
    const href = e.target.getAttribute('href');

    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      return;
    }

    if (href && href.includes('jsfiddle')) {
      e.preventDefault();
      openPopup(href);
    }
  });
};

exports.onInitialClientRender = () => {
  handleDemoClicks();
  handlePopupClicks();
};

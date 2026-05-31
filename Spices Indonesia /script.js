document.addEventListener('DOMContentLoaded', function () {
  var header = document.getElementById('header');
  var headerToggle = document.getElementById('headerToggle');
  var headerNav = document.getElementById('headerNav');
  var backTop = document.getElementById('backTop');

  function onScroll() {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }
    if (backTop) {
      backTop.classList.toggle('visible', window.scrollY > 400);
    }
  }

  onScroll();
  window.addEventListener('scroll', onScroll);

  if (headerToggle && headerNav) {
    headerToggle.addEventListener('click', function () {
      headerToggle.classList.toggle('active');
      headerNav.classList.toggle('active');
    });

    document.querySelectorAll('.header-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        headerToggle.classList.remove('active');
        headerNav.classList.remove('active');
      });
    });
  }

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.fade-up').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.fade-up').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-tab');
      var container = btn.closest('.tab-container');
      if (!target || !container) {
        return;
      }

      container.querySelectorAll('.tab-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      container.querySelectorAll('.tab-pane').forEach(function (pane) {
        pane.classList.remove('active');
      });
      var targetPane = document.getElementById(target);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      if (!item) {
        return;
      }

      var list = item.closest('.faq-list');
      var wasActive = item.classList.contains('active');
      if (list) {
        list.querySelectorAll('.faq-item').forEach(function (faqItem) {
          faqItem.classList.remove('active');
        });
      }
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });

  var rfqForm = document.getElementById('rfqForm');
  var rfqFeedback = document.getElementById('rfqFeedback');

  function setFeedback(type, message) {
    if (!rfqFeedback) {
      return;
    }
    rfqFeedback.classList.remove('success', 'error');
    if (type) {
      rfqFeedback.classList.add(type);
    }
    rfqFeedback.textContent = message || '';
  }

  if (rfqForm) {
    if (window.location.search.indexOf('sent=1') !== -1) {
      setFeedback('success', 'Thank you. Your RFQ is submitted and our export team will reply within 24 hours.');
    }

    rfqForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      if (!rfqForm.reportValidity()) {
        return;
      }

      var submitButton = rfqForm.querySelector('button[type="submit"]');
      var formData = new FormData(rfqForm);
      var payload = Object.fromEntries(formData.entries());

      if (!payload.fullName || !payload.email || !payload.spice || !payload.volume) {
        setFeedback('error', 'Please complete all required fields before sending your request.');
        return;
      }

      setFeedback('', '');
      if (submitButton) {
        submitButton.classList.add('is-loading');
        submitButton.setAttribute('aria-busy', 'true');
      }

      try {
        var response = await fetch('/api/inquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(payload)
        });

        var data = await response.json();
        if (!response.ok || !data.ok) {
          throw new Error(data.message || 'Unable to submit your inquiry right now.');
        }

        rfqForm.reset();
        setFeedback('success', 'Thank you. Your RFQ is submitted and our export team will reply within 24 hours.');
      } catch (error) {
        setFeedback('error', error.message || 'Submission failed. Please email revita@spiceshouseindonesia.com directly.');
      } finally {
        if (submitButton) {
          submitButton.classList.remove('is-loading');
          submitButton.removeAttribute('aria-busy');
        }
      }
    });
  }
});

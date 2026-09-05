(function () {
  var cfg = window.DHARMA_ANALYTICS;
  if (!cfg || !cfg.webhookToken) return;
  if (/analytics\.html$/i.test(location.pathname)) return;
  try { if (sessionStorage.getItem('dharma_visit_logged')) return; } catch (e) {}

  function visitorId() {
    try {
      var id = localStorage.getItem('dharma_vid');
      if (!id) {
        id = (crypto.randomUUID && crypto.randomUUID()) || (String(Date.now()) + Math.random());
        localStorage.setItem('dharma_vid', id);
      }
      return id;
    } catch (err) {
      return String(Date.now());
    }
  }

  var params = new URLSearchParams({
    src: 'dharma',
    vid: visitorId(),
    page: (location.pathname || '/') + (location.search || ''),
    ref: document.referrer || 'direct',
    screen: (screen.width || 0) + 'x' + (screen.height || 0),
    lang: navigator.language || '',
    host: location.host || location.protocol.replace(':', ''),
    href: String(location.href || '').slice(0, 180)
  });
  var url = 'https://webhook.site/' + cfg.webhookToken + '?' + params.toString();
  try { new Image().src = url; } catch (e1) {}
  try { sessionStorage.setItem('dharma_visit_logged', '1'); } catch (e4) {}
})();

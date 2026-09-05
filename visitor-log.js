(function () {
  var cfg = window.DHARMA_ANALYTICS;
  if (!cfg || !cfg.webhookToken) return;
  if (/analytics\.html$/i.test(location.pathname)) return;
  try {
    if (sessionStorage.getItem('dharma_visit_logged')) return;
  } catch (e) {}

  function uuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function visitorId() {
    try {
      var id = localStorage.getItem('dharma_vid');
      if (!id) {
        id = uuid();
        localStorage.setItem('dharma_vid', id);
      }
      return id;
    } catch (e) {
      return uuid();
    }
  }

  function timeoutFetch(url, ms) {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, ms || 8000);
    return fetch(url, { cache: 'no-store', signal: ctrl.signal, mode: 'cors' })
      .finally(function () { clearTimeout(timer); });
  }

  async function lookupGeo() {
    try {
      var r = await timeoutFetch('https://ipwho.is/', 6000);
      var d = await r.json();
      if (d && d.success !== false && d.ip) {
        return {
          ip: d.ip,
          isp: (d.connection && (d.connection.isp || d.connection.org)) || '',
          lat: d.latitude,
          lon: d.longitude
        };
      }
    } catch (e) {}
    return {};
  }

  async function logVisit() {
    var geo = await lookupGeo();
    var params = new URLSearchParams({
      src: 'dharma',
      vid: visitorId(),
      page: location.pathname + location.search || '/',
      ref: document.referrer || 'direct',
      screen: (screen.width || 0) + 'x' + (screen.height || 0),
      lang: navigator.language || '',
      title: document.title || '',
      host: location.host || '',
      isp: geo.isp || '',
      ipq: geo.ip || '',
      lat: geo.lat != null ? String(geo.lat) : '',
      lon: geo.lon != null ? String(geo.lon) : ''
    });
    var url = 'https://webhook.site/' + cfg.webhookToken + '?' + params.toString();
    try {
      await timeoutFetch(url, 8000);
    } catch (e) {
      new Image().src = url;
    }
    try { sessionStorage.setItem('dharma_visit_logged', '1'); } catch (err) {}
  }

  logVisit().catch(function () {});
})();

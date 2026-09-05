/* Shared analytics settings for GitHub Pages (GitHub does not give visitor IPs).
   Dashboard password is SHA-256 only. In analytics.html console:
     await sha256Hex('YourNewPassword')
   then paste the hex into passwordHash. */
window.DHARMA_ANALYTICS = {
  webhookToken: '047ef6af-4154-4810-8e4a-e77c0e4be351',
  passwordHash: '537d83916bf53bba8341980b55741e01f60a48698a803a8bc425eaefa91ed1ec',
  sessionKey: 'dharma_analytics_ok'
};

window.sha256Hex = async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(function (b) {
    return b.toString(16).padStart(2, '0');
  }).join('');
};

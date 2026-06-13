(function() {
  // Find current running script tag
  const script = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  const formId = script.getAttribute('data-form');
  const targetId = script.getAttribute('data-target');

  if (!formId || !targetId) {
    console.error('Formu.AI Embed: Missing data-form or data-target attributes.');
    return;
  }

  const container = document.getElementById(targetId);
  if (!container) {
    console.error('Formu.AI Embed: Target container not found:', targetId);
    return;
  }

  // Create responsive iframe wrapper
  const iframe = document.createElement('iframe');
  
  // Resolve host url from script source location
  const scriptSrc = script.getAttribute('src');
  let baseUrl = window.location.origin;
  if (scriptSrc && scriptSrc.startsWith('http')) {
    const url = new URL(scriptSrc);
    baseUrl = url.origin;
  }

  iframe.src = baseUrl + '/f/' + formId;
  iframe.style.width = '100%';
  iframe.style.height = '600px';
  iframe.style.border = 'none';
  iframe.setAttribute('frameborder', '0');

  // Insert iframe into container
  container.innerHTML = '';
  container.appendChild(iframe);
})();

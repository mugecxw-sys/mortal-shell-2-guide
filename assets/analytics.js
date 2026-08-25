(() => {
  const measurementId = 'G-WNKL7XBX3W';
  const consentKey = 'ms2-analytics-consent';
  const currentConsent = localStorage.getItem(consentKey);
  const source = document.currentScript;

  if (source?.src) {
    const styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.href = source.src.replace('analytics.js', 'analytics-consent.css');
    document.head.append(styles);
  }

  const deleteAnalyticsCookies = () => {
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.trim().split('=')[0];
      if (!name.startsWith('_ga')) return;
      document.cookie = `${name}=; Max-Age=0; path=/`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.mortalshell2guide.xyz`;
    });
  };

  const loadAnalytics = () => {
    if (window.__ms2AnalyticsLoaded) return;
    window.__ms2AnalyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(tag);
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  };

  const banner = document.createElement('section');
  banner.className = 'analytics-consent';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Analytics cookie choice');
  banner.innerHTML = '<strong>Analytics cookies</strong><p>We use Google Analytics to understand how visitors use this guide. Analytics loads only if you accept. <a href="/cookies.html">Learn more</a></p><div class="analytics-consent-actions"><button type="button" data-analytics-accept>Accept analytics</button><button type="button" class="analytics-decline" data-analytics-decline>Decline</button></div>';
  document.body.append(banner);

  const showBanner = () => { banner.hidden = false; };
  const hideBanner = () => { banner.hidden = true; };
  const grant = () => {
    localStorage.setItem(consentKey, 'granted');
    loadAnalytics();
    hideBanner();
  };
  const deny = () => {
    localStorage.setItem(consentKey, 'denied');
    if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
    deleteAnalyticsCookies();
    hideBanner();
  };

  banner.querySelector('[data-analytics-accept]').addEventListener('click', grant);
  banner.querySelector('[data-analytics-decline]').addEventListener('click', deny);
  document.querySelectorAll('[data-analytics-preferences]').forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.removeItem(consentKey);
      showBanner();
    });
  });

  if (currentConsent === 'granted') {
    loadAnalytics();
    hideBanner();
  } else if (currentConsent === 'denied') {
    hideBanner();
  } else {
    showBanner();
  }
})();

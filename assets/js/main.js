// industrial.undersoft — script principal

/* Substitua somente os valores abaixo antes da publicação comercial. */
const SITE_CONFIG = {
  marketplaceUrl: 'https://lista.mercadolivre.com.br/_CustId_1618539763?item_id=MLB4008885831&category_id=MLB22714&seller_id=1618539763&client=recoview-selleritems&recos_listing=true#origin=pdp&component=seller&typeSeller=classic',
  gaMeasurementId: 'GA_MEASUREMENT_ID',
  googleAdsId: 'GOOGLE_ADS_ID',
  googleAdsConversionLabel: 'GOOGLE_ADS_CONVERSION_LABEL'
};

const search = new URLSearchParams(location.search);
const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'];

campaignKeys.forEach((key) => {
  const value = search.get(key);
  if (value) sessionStorage.setItem(key, value);
});

const campaign = campaignKeys
  .map((key) => [key, sessionStorage.getItem(key)])
  .filter(([, value]) => value);

function track(name, extra = {}) {
  const payload = { event: name, ...extra };
  if (typeof window.gtag === 'function') window.gtag('event', name, extra);
  document.dispatchEvent(new CustomEvent('undersoft:conversion', { detail: payload }));
  console.info('[conversion]', payload);
}

document.querySelectorAll('.js-contact').forEach((link) => {
  link.addEventListener('click', () => track('contact_click', { contact_method: 'form' }));
});

document.querySelectorAll('.js-email').forEach((link) => {
  link.addEventListener('click', () => track('email_click', { contact_method: 'email' }));
});

document.querySelectorAll('.js-marketplace').forEach((link) => {
  link.href = SITE_CONFIG.marketplaceUrl;
  link.target = '_blank';
  link.rel = 'noopener';
  link.addEventListener('click', () => track('mercadolivre_click'));
});

document.querySelector('.lead-form')?.addEventListener('submit', () => {
  track('form_submit', { form_name: 'lead_contato' });
});

const leadForm = document.querySelector('.lead-form');
campaign.forEach(([key, value]) => {
  if (!leadForm) return;
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = key;
  input.value = value;
  leadForm.appendChild(input);
});

const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');
toggle?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
}));

document.querySelector('#year').textContent = new Date().getFullYear();

/* Google Analytics / Ads:
 * carregue gtag.js apenas depois de substituir os três IDs em SITE_CONFIG.
 * Os eventos principais são contact_click, email_click, mercadolivre_click e form_submit.
 */

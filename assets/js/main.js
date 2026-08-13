// industrial.undersoft — script principal

const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox?.querySelector('.lightbox-image');
const lightboxClose = lightbox?.querySelector('.lightbox-close');

document.querySelectorAll('.gallery-item img').forEach((image) => {
  image.closest('.gallery-item').addEventListener('click', () => {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.showModal();
  });
});

lightboxClose?.addEventListener('click', () => {
  lightbox.close();
});

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

lightbox?.addEventListener('close', () => {
  lightboxImage.src = '';
  lightboxImage.alt = '';
});

/* Substitua os valores de Ads abaixo se optar por tag de conversão separada (ver assets/js/consent.js para GA4/GTM). */
const SITE_CONFIG = {
  marketplaceUrl: 'https://lista.mercadolivre.com.br/_CustId_1618539763?item_id=MLB4008885831&category_id=MLB22714&seller_id=1618539763&client=recoview-selleritems&recos_listing=true#origin=pdp&component=seller&typeSeller=classic',
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


const leadForm = document.getElementById("leadForm");
const leadSubmit = document.getElementById("leadSubmit");
const successModal = document.getElementById("successModal");
const successModalOk = document.getElementById("successModalOk");

const originalButtonContent = leadSubmit.innerHTML;

leadForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  leadSubmit.disabled = true;
  leadSubmit.innerHTML = "A enviar...";

  try {
    const formData = new FormData(leadForm);

    const response = await fetch(leadForm.action, {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Falha no envio");
    }

    leadForm.reset();

    track('form_submit', {
      form_id: 'leadForm',
      ...Object.fromEntries(campaign)
    });

    successModal.classList.add("active");
    document.body.classList.add("modal-open");

    successModalOk.focus();

  } catch (error) {
    console.error("Erro ao enviar formulário:", error);

    alert(
      "Não foi possível enviar a solicitação. " +
      "Por favor, tente novamente."
    );

  } finally {
    leadSubmit.disabled = false;
    leadSubmit.innerHTML = originalButtonContent;
  }
});

successModalOk.addEventListener("click", function () {
  successModal.classList.remove("active");
  document.body.classList.remove("modal-open");
});


/* Google Ads:
 * se optar por tag de conversão separada (não GA4-linkado), preencha googleAdsId
 * e googleAdsConversionLabel em SITE_CONFIG e injete o gtag de conversão aqui,
 * disparando dentro do listener 'undersoft:conversion' com detail.event === 'form_submit'.
 * GA4/GTM são carregados por assets/js/consent.js, após consentimento de cookies.
 * Eventos disparados: contact_click, email_click, mercadolivre_click, form_submit.
 */
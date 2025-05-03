document.addEventListener("DOMContentLoaded", async () => {
  // DOM Elements
  const modal = document.getElementById("age-verification");
  const btnYes = document.getElementById("btn-yes");
  const btnNo = document.getElementById("btn-no");
  const contentArea = document.getElementById("content-area");

  // Determine initial language from URL param or storage
  let currentLanguage =
    new URLSearchParams(window.location.search).get("lang") ||
    localStorage.getItem("language") ||
    "en";

  // Translations store
  let translations = {};

  // Load translations
  async function loadTranslations(lang) {
    try {
      const response = await fetch(`./translations/${lang}.json`);
      translations[lang] = await response.json();
    } catch (error) {
      console.error(`Failed to load ${lang} translations:`, error);
    }
  }

  // Load legal content from Markdown
  async function loadLegalContent(lang) {
    if (!contentArea) return; // Exit if not on legal page

    const pageType = window.location.pathname.includes("privacy") ? "privacy-policies" : "terms-of-use";
    const filePath = `assets/legal/${pageType}-${lang}.md`;

    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error('Content not found');
      const text = await response.text();
      contentArea.innerHTML = marked.parse(text);
    } catch (error) {
      contentArea.innerHTML = `<p class="error">Error loading content: ${error.message}</p>`;
    }
  }

  // Update main content of the landing page
  function updateMainPageContent(lang) {
    const t = translations[lang];
    if (!t) return;

    // Age verification
    const ageVerificationTitle = document.querySelector("#age-verification h2");
    const ageMessage = document.getElementById("age-message");
    if (ageVerificationTitle && ageMessage && btnYes && btnNo) {
      ageVerificationTitle.textContent = t.ageVerification.title;
      ageMessage.textContent = t.ageVerification.message;
      btnYes.textContent = t.ageVerification.confirmButton;
      btnNo.textContent = t.ageVerification.rejectButton;
    }

    // Header
    const tagline = document.getElementById("tagline");
    const headerDesc = document.querySelector(".header-description");
    if (tagline && headerDesc) {
      tagline.textContent = t.header.tagline;
      headerDesc.textContent = t.header.description;
    }

    // Features
    const featuresHeading = document.getElementById("features-heading");
    const featuresDesc = document.querySelector(".features .section-description");
    const featuresList = document.getElementById("features-list");
    if (featuresHeading && featuresDesc) {
      featuresHeading.textContent = t.features.title;
      featuresDesc.textContent = t.features.subtitle;
    }
    if (featuresList) {
      featuresList.innerHTML = t.features.items
        .map(feature => `
          <li>
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
          </li>
        `).join("");
    }

    // Discover section
    const carouselHeading = document.getElementById("carousel-heading");
    const screenshotsDesc = document.querySelector(".screenshots .section-description");
    if (carouselHeading && screenshotsDesc) {
      carouselHeading.textContent = t.discover.title;
      screenshotsDesc.textContent = t.discover.subtitle;
    }

    // Restriction page
    const restrictionContent = document.querySelector('.restriction-content');
    if (restrictionContent) {
      const pageTitle = restrictionContent.querySelector('h1');
      const mainDesc = restrictionContent.querySelector('p');
      if (pageTitle && mainDesc) {
        pageTitle.textContent = t.restriction.pageTitle;
        mainDesc.textContent = t.restriction.mainDescription;
      }

      const importantInfoTitle = restrictionContent.querySelector('h2');
      const importantInfoList = document.getElementById('important-info-list');
      if (importantInfoTitle && importantInfoList) {
        importantInfoTitle.textContent = t.restriction.importantInfo.title;
        importantInfoList.innerHTML = t.restriction.importantInfo.items
          .map(item => `<li>${item}</li>`)
          .join('');
      }

      const legalTitle = restrictionContent.querySelectorAll('h2')[1];
      const legalIntro = restrictionContent.querySelectorAll('p')[1];
      const legalList = document.getElementById('legal-requirements-list');
      if (legalTitle && legalIntro && legalList) {
        legalTitle.textContent = t.restriction.legalRequirements.title;
        legalIntro.textContent = t.restriction.legalRequirements.intro;
        legalList.innerHTML = t.restriction.legalRequirements.items
          .map(item => `<li>${item}</li>`)
          .join('');
      }

      const warning = restrictionContent.querySelector('.warning');
      if (warning) {
        warning.textContent = t.restriction.warning;
      }
    }

    // Download section
    const downloadHeading = document.getElementById("download-heading");
    const downloadDesc = document.querySelector(".download .section-description");
    if (downloadHeading && downloadDesc) {
      downloadHeading.textContent = t.download.title;
      downloadDesc.textContent = t.download.subtitle;
    }
  }

  // Update footer
  function updateFooter(lang) {
    const t = translations[lang];
    if (!t) return;

    const footerElements = {
      "footer-created-by": t.footer.createdBy,
      "whats-new": t.footer.whatsNew,
      "privacy-link": t.footer.privacyPolicy,
      "terms-link": t.footer.termsOfUse
    };

    for (const [id, text] of Object.entries(footerElements)) {
      const element = document.getElementById(id);
      if (element) element.textContent = text;
    }
  }

  // Language switcher
  async function updateContent(lang) {
    localStorage.setItem('language', lang);
    currentLanguage = lang;

    if (!translations[lang]) {
      await loadTranslations(lang);
    }

    if (contentArea) {
      loadLegalContent(lang);
    } else {
      updateMainPageContent(lang);
      updateFooter(lang);
    }

    // Update footer links
    const privacyLink = document.getElementById('privacy-link');
    const termsLink = document.getElementById('terms-link');
    if (privacyLink && termsLink) {
      privacyLink.setAttribute('href', `privacy.html?lang=${lang}`);
      termsLink.setAttribute('href', `terms.html?lang=${lang}`);
    }

    // Update language link visual state
    const langLinks = document.querySelectorAll('.language-links a');
    langLinks.forEach(link => {
      const isCurrent = link.textContent.trim().toLowerCase() === lang.toLowerCase();
      link.classList.toggle('active', isCurrent);
    });
  }



  // Expose globally
  window.updateContent = updateContent;
  window.changeLang = updateContent;

  // Age Verification
  if (modal && !localStorage.getItem("ageVerified")) {
    modal.classList.add("active");
  }

  if (btnYes) {
    btnYes.addEventListener("click", () => {
      localStorage.setItem("ageVerified", "true");
      modal.classList.remove("active");
    });
  }

  if (btnNo) {
    btnNo.addEventListener("click", () => {
      window.location.href = "restriction.html";
    });
  }

  // Init
  await loadTranslations(currentLanguage);
  if (contentArea) {
    await loadLegalContent(currentLanguage);
  } else {
    updateMainPageContent(currentLanguage);
  }
  updateFooter(currentLanguage);
});

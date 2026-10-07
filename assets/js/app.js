/**
 * Noorani Panjabi Tailors and Fabrics - Main Application Logic
 * Handles Telegram Bot API submissions, WhatsApp integration, Price Estimator, and UI dynamics.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Load custom settings from localStorage if user previously configured them in-browser
  loadSavedSettings();

  // Bind dynamic contact info from config
  setupBusinessContactInfo();

  // Initialize interactive features
  initPriceEstimator();
  initQuantityPresets();
  initFormSubmission();
  initModalHandlers();
  initSettingsModal();
  initFaqAccordion();
  initMobileMenu();
  initSmoothScroll();
  initClickAnimations();
});

/**
 * Normalize Bengali digits (০-৯) to standard English numbers (0-9)
 */
function normalizeBengaliDigits(str) {
  if (!str) return "";
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(str).replace(/[০-৯]/g, (d) => bnDigits.indexOf(d));
}

/**
 * Load any browser-persisted settings
 */
function loadSavedSettings() {
  window.APP_CONFIG = window.APP_CONFIG || {};
  window.APP_CONFIG.telegram = window.APP_CONFIG.telegram || {};

  const savedToken = localStorage.getItem("NOORANI_BOT_TOKEN");
  const savedChatId = localStorage.getItem("NOORANI_CHAT_ID");
  const savedWhatsapp = localStorage.getItem("NOORANI_WHATSAPP");
  const savedFb = localStorage.getItem("NOORANI_FB");

  if (savedToken) window.APP_CONFIG.telegram.botToken = savedToken;
  if (savedChatId) window.APP_CONFIG.telegram.chatId = savedChatId;
  if (savedWhatsapp) window.APP_CONFIG.whatsappNumber = savedWhatsapp;
  if (savedFb) window.APP_CONFIG.facebookUrl = savedFb;
}

/**
 * Populate dynamic contact details across the page
 */
function setupBusinessContactInfo() {
  const config = window.APP_CONFIG || {};

  // Setup WhatsApp Links
  const waLinks = document.querySelectorAll(".dynamic-whatsapp-link");
  const waNumber = config.whatsappNumber || "8801728769213";
  const defaultWaText = encodeURIComponent(
    "আসসালামু আলাইকুম, আমি নূরানী পাঞ্জাবী টেইলার্স অ্যান্ড ফেব্রিক্স থেকে প্রিমিয়াম কাস্টম পাঞ্জাবী ও ফেব্রিক্স কালেকশন সম্পর্কে জানতে চাই।"
  );

  waLinks.forEach((el) => {
    el.href = `https://wa.me/${waNumber}?text=${defaultWaText}`;
  });

  // Setup Facebook Links
  const fbLinks = document.querySelectorAll(".dynamic-facebook-link");
  fbLinks.forEach((el) => {
    el.href = config.facebookUrl || "https://www.facebook.com/Nooranipanjabi?mibextid=ZbWKwL";
  });

  // Setup Phone Links
  const phoneLinks = document.querySelectorAll(".dynamic-phone-link");
  phoneLinks.forEach((el) => {
    el.href = `tel:${config.phone ? config.phone.replace(/[\s-]/g, "") : "+8801728769213"}`;
    if (el.dataset.showText === "true") {
      el.textContent = config.phoneDisplay || config.phone || "01728-769213";
    }
  });

  // Setup Address & Coverage
  const addressEls = document.querySelectorAll(".dynamic-address");
  addressEls.forEach((el) => {
    el.textContent = config.address || "নূরানী পাঞ্জাবি টেইলার্স এন্ড ফেব্রিক্স, কটিয়াদী ২৩৩০, বাংলাদেশ";
  });

  // Setup Google Maps Links
  const mapLinks = document.querySelectorAll(".dynamic-maps-link");
  mapLinks.forEach((el) => {
    el.href = config.googleMapsUrl || "https://maps.google.com";
  });
}

/**
 * Interactive Step-by-Step Retail Price Estimator for Men's Custom Tailored Panjabis
 * Step 1: Fabric Category
 * Step 2: Style & Embroidery (+ Optional Pyjama)
 * Step 3: Lead Capture (Name & WhatsApp) before instant reveal
 */
function initPriceEstimator() {
  const stepContainer = document.getElementById("estimator-step-container");
  if (!stepContainer) return;

  const step1 = document.getElementById("estimator-step-1");
  const step2 = document.getElementById("estimator-step-2");
  const step3 = document.getElementById("estimator-step-3");
  const stepResult = document.getElementById("estimator-step-result");

  const progressBar = document.getElementById("step-progress-bar");
  const ind1 = document.getElementById("step-indicator-1");
  const ind2 = document.getElementById("step-indicator-2");
  const ind3 = document.getElementById("step-indicator-3");

  const btnGotoStep2 = document.getElementById("btn-goto-step-2");
  const btnBacktoStep1 = document.getElementById("btn-backto-step-1");
  const btnGotoStep3 = document.getElementById("btn-goto-step-3");
  const btnBacktoStep2 = document.getElementById("btn-backto-step-2");
  const leadForm = document.getElementById("estimator-lead-form");
  const btnRecalculate = document.getElementById("btn-recalculate");

  const fabricCards = document.querySelectorAll(".fabric-option-card");
  const styleCards = document.querySelectorAll(".style-option-card");
  const pyjamaCheck = document.getElementById("estimator-pyjama");

  // Price & Label Data Map
  const fabricData = {
    premium_cotton: {
      name: "১০০% রয়্যাল কটন (সুতি ভয়েল ও পপলিন)",
      shortName: "রয়্যাল পিওর কটন",
      basePrice: 950,
      range: "৳ ৯৫০ - ৳ ১,২০০"
    },
    egyptian_cotton: {
      name: "লাক্সারি ইজিপশিয়ান ও গিজা কটন",
      shortName: "ইজিপশিয়ান ও গিজা কটন",
      basePrice: 1450,
      range: "৳ ১,৪৫০ - ৳ ১,৭৫০"
    },
    kabli_twill: {
      name: "সিগনেচার টুইল কাবলি স্যুট",
      shortName: "টুইল কাবলি স্যুট",
      basePrice: 1850,
      range: "৳ ১,৮৫০ - ৳ ২,২৫০"
    },
    festive_silk: {
      name: "এক্সক্লুসিভ উৎসব সিল্ক ও কাতা শাইন",
      shortName: "উৎসব সিল্ক ও শাইন",
      basePrice: 2150,
      range: "৳ ২,১৫০ - ৳ ২,৬৫০"
    }
  };

  const styleData = {
    plain: {
      name: "সলিড ক্লাসিক প্লেন (Plain)",
      price: 0
    },
    machine_embroidery: {
      name: "ডিজিটাল মেশিন এমব্রয়ডারি",
      price: 250
    },
    hand_embroidery: {
      name: "এক্সক্লুসিভ হ্যান্ড এমব্রয়ডারি / কারচুপি",
      price: 450
    }
  };

  const pyjamaPrice = 450;

  let currentFabricKey = "premium_cotton";
  let currentStyleKey = "plain";

  // Step 1: Fabric Selection Interactivity
  fabricCards.forEach((card) => {
    card.addEventListener("click", () => {
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        currentFabricKey = radio.value;
      }

      fabricCards.forEach((c) => {
        c.classList.remove("estimator-card-selected", "border-[#cfa853]");
        c.classList.add("border-white/10");
        const ind = c.querySelector(".check-indicator");
        if (ind) {
          ind.className = "check-indicator w-5 h-5 rounded-full border-2 border-white/30 flex items-center justify-center";
          const icon = ind.querySelector("i, svg");
          if (icon) icon.classList.add("hidden");
        }
      });

      card.classList.add("estimator-card-selected", "border-[#cfa853]");
      card.classList.remove("border-white/10");
      const activeInd = card.querySelector(".check-indicator");
      if (activeInd) {
        activeInd.className = "check-indicator w-5 h-5 rounded-full border-2 border-[#cfa853] bg-[#cfa853] text-[#04261f] flex items-center justify-center";
        const icon = activeInd.querySelector("i, svg");
        if (icon) icon.classList.remove("hidden");
      }
    });
  });

  // Step 2: Style Selection Interactivity
  styleCards.forEach((card) => {
    card.addEventListener("click", () => {
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        currentStyleKey = radio.value;
      }

      styleCards.forEach((c) => {
        c.classList.remove("estimator-card-selected", "border-[#cfa853]");
        c.classList.add("border-white/10");
        const ind = c.querySelector(".check-indicator");
        if (ind) {
          ind.className = "check-indicator w-5 h-5 rounded-full border-2 border-white/30 flex items-center justify-center";
          const icon = ind.querySelector("i, svg");
          if (icon) icon.classList.add("hidden");
        }
      });

      card.classList.add("estimator-card-selected", "border-[#cfa853]");
      card.classList.remove("border-white/10");
      const activeInd = card.querySelector(".check-indicator");
      if (activeInd) {
        activeInd.className = "check-indicator w-5 h-5 rounded-full border-2 border-[#cfa853] bg-[#cfa853] text-[#04261f] flex items-center justify-center";
        const icon = activeInd.querySelector("i, svg");
        if (icon) icon.classList.remove("hidden");
      }
    });
  });

  // Transition Helper
  function showStep(stepNum) {
    const allSteps = [step1, step2, step3, stepResult];
    allSteps.forEach((s) => {
      if (s) {
        s.classList.add("hidden");
        s.classList.remove("step-fade-in", "block");
      }
    });

    let targetStepEl = step1;
    if (stepNum === 2) targetStepEl = step2;
    if (stepNum === 3) targetStepEl = step3;
    if (stepNum === 4) targetStepEl = stepResult;

    if (targetStepEl) {
      targetStepEl.classList.remove("hidden");
      targetStepEl.classList.add("step-fade-in", "block");
    }

    // Update Step Indicators
    if (progressBar && ind1 && ind2 && ind3) {
      if (stepNum === 1) {
        progressBar.style.width = "0%";
        setIndicatorState(ind1, "active", "1");
        setIndicatorState(ind2, "inactive", "2");
        setIndicatorState(ind3, "inactive", "3");
      } else if (stepNum === 2) {
        progressBar.style.width = "50%";
        setIndicatorState(ind1, "completed", "✓");
        setIndicatorState(ind2, "active", "2");
        setIndicatorState(ind3, "inactive", "3");
      } else if (stepNum === 3) {
        progressBar.style.width = "100%";
        setIndicatorState(ind1, "completed", "✓");
        setIndicatorState(ind2, "completed", "✓");
        setIndicatorState(ind3, "active", "3");
      } else if (stepNum === 4) {
        progressBar.style.width = "100%";
        setIndicatorState(ind1, "completed", "✓");
        setIndicatorState(ind2, "completed", "✓");
        setIndicatorState(ind3, "completed", "✓");
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  function setIndicatorState(el, state, text) {
    if (!el) return;
    el.textContent = text;
    if (state === "active") {
      el.className = "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-[#cfa853] text-[#04261f] shadow-lg transition-all duration-300 border-2 border-[#cfa853]";
    } else if (state === "completed") {
      el.className = "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-emerald-600 text-white shadow-md transition-all duration-300 border-2 border-emerald-500";
    } else {
      el.className = "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-white/10 text-stone-400 border-2 border-white/20 transition-all duration-300";
    }
  }

  // Step Navigation Listeners
  if (btnGotoStep2) {
    btnGotoStep2.addEventListener("click", () => {
      showStep(2);
    });
  }

  if (btnBacktoStep1) {
    btnBacktoStep1.addEventListener("click", () => {
      showStep(1);
    });
  }

  if (btnGotoStep3) {
    btnGotoStep3.addEventListener("click", () => {
      showStep(3);
    });
  }

  if (btnBacktoStep2) {
    btnBacktoStep2.addEventListener("click", () => {
      showStep(2);
    });
  }

  if (btnRecalculate) {
    btnRecalculate.addEventListener("click", () => {
      showStep(1);
    });
  }

  // Step 3: Lead Capture Submission & Reveal
  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("estimator-cust-name");
      const phoneInput = document.getElementById("estimator-cust-phone");

      const name = nameInput ? nameInput.value.trim() : "";
      const rawPhone = phoneInput ? phoneInput.value.trim() : "";
      const phone = normalizeBengaliDigits(rawPhone);
      const rawDigits = phone.replace(/[^\d]/g, "");

      if (!name) {
        showToast("অনুগ্রহ করে আপনার নাম লিখুন।", "error");
        nameInput?.focus();
        return;
      }

      if (!phone || rawDigits.length < 10) {
        showToast("সঠিক ১১ ডিজিটের ফোন / হোয়াটসঅ্যাপ নম্বর দিন।", "error");
        phoneInput?.focus();
        return;
      }

      // Calculate Custom Estimate
      const fabricObj = fabricData[currentFabricKey] || fabricData.premium_cotton;
      const styleObj = styleData[currentStyleKey] || styleData.plain;
      const hasPyjama = pyjamaCheck ? pyjamaCheck.checked : true;

      const basePrice = fabricObj.basePrice;
      const stylePrice = styleObj.price;
      const pyjamaCost = hasPyjama ? pyjamaPrice : 0;
      const totalEstimated = basePrice + stylePrice + pyjamaCost;

      // Populate Result Screen
      const resName = document.getElementById("res-cust-name");
      const resTotal = document.getElementById("res-total-price");
      const resFabric = document.getElementById("res-fabric-name");
      const resStyle = document.getElementById("res-style-name");
      const resPyjama = document.getElementById("res-pyjama-status");
      const resWhatsappBtn = document.getElementById("res-whatsapp-btn");
      const resOrderFormBtn = document.getElementById("res-order-form-btn");

      if (resName) resName.textContent = name;
      if (resTotal) resTotal.textContent = `৳ ${totalEstimated.toLocaleString("en-IN")}`;
      if (resFabric) resFabric.textContent = fabricObj.shortName;
      if (resStyle) resStyle.textContent = styleObj.name;
      if (resPyjama) resPyjama.textContent = hasPyjama ? "হ্যাঁ (+৳৪৫০)" : "না (শুধুমাত্র পাঞ্জাবী)";

      // Setup Pre-filled WhatsApp Link for Instant Confirmation
      const config = window.APP_CONFIG || {};
      const waNumber = config.whatsappNumber || "8801728769213";
      const waEstimateMsg = `আসসালামু আলাইকুম, আমি নূরানী পাঞ্জাবীর প্রাইস এস্টিমেটর থেকে আমার পাঞ্জাবীর বাজেট পেয়েছি:
👤 নাম: ${name}
📞 মোবাইল: ${phone}
🧵 ফেব্রিক্স: ${fabricObj.name}
✨ স্টাইল: ${styleObj.name}
🌙 পাজামা: ${hasPyjama ? "হ্যাঁ (ম্যাচিং পাজামা সহ)" : "না (শুধুমাত্র পাঞ্জাবী)"}
💰 আনুমানিক বাজেট: ৳ ${totalEstimated.toLocaleString("en-IN")}

আমি এই মাপে পাঞ্জাবী তৈরি করার জন্য আলোচনা ও অর্ডার কনফার্ম করতে চাই।`;

      if (resWhatsappBtn) {
        resWhatsappBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(waEstimateMsg)}`;
      }

      // Sync with main order form down below
      const mainName = document.getElementById("customer-name");
      const mainPhone = document.getElementById("customer-phone");
      const mainFabric = document.getElementById("order-fabric");
      const mainNotes = document.getElementById("order-notes");
      const mainOrderType = document.getElementById("order-type");

      if (mainName) mainName.value = name;
      if (mainPhone) mainPhone.value = phone.replace(/^(\+?88)?/, "");
      if (mainOrderType) mainOrderType.value = currentFabricKey === "kabli_twill" ? "kabli_set" : "custom_panjabi";
      if (mainFabric) {
        for (let i = 0; i < mainFabric.options.length; i++) {
          if (mainFabric.options[i].text.includes(fabricObj.shortName) || mainFabric.options[i].value.includes(fabricObj.shortName)) {
            mainFabric.selectedIndex = i;
            break;
          }
        }
      }
      if (mainNotes) {
        mainNotes.value = `[এস্টিমেটর নির্বাচন]: ${fabricObj.shortName}, স্টাইল: ${styleObj.name}, পাজামা: ${hasPyjama ? "হ্যাঁ" : "না"}, বাজেট: ৳ ${totalEstimated}`;
      }

      if (resOrderFormBtn) {
        resOrderFormBtn.addEventListener("click", () => {
          const formSection = document.getElementById("order-section");
          if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
        });
      }

      // Silently dispatch hot lead notification to Telegram Bot
      sendEstimatorLeadNotification({
        name,
        phone,
        fabric: fabricObj.name,
        style: styleObj.name,
        pyjama: hasPyjama ? "হ্যাঁ" : "না",
        total: totalEstimated
      });

      // Smoothly reveal result step
      showStep(4);
      showToast("আপনার কাস্টম এস্টিমেট প্রস্তুত!", "success");
    });
  }
}

/**
 * Send hot lead notification from Price Estimator to Telegram
 */
async function sendEstimatorLeadNotification(data) {
  const config = window.APP_CONFIG || {};
  const botToken = config.telegram?.botToken;
  const chatId = config.telegram?.chatId;

  if (!botToken || !chatId || botToken.includes("YOUR_") || chatId.includes("YOUR_")) {
    return;
  }

  const cleanPhone = data.phone.replace(/[\s-]/g, "");
  const cleanWaPhone = cleanPhone.replace(/^(\+?88)?0?/, "");
  const now = new Date();
  const formattedDate = now.toLocaleString("bn-BD", {
    timeZone: "Asia/Dhaka",
    dateStyle: "full",
    timeStyle: "short"
  });

  const msg = `
👑 <b>নূরানী পাঞ্জাবী টেইলার্স অ্যান্ড ফেব্রিক্স</b>
━━━━━━━━━━━━━━━━━━━━━
⚡ <b>প্রাইস এস্টিমেটর নতুন লিড (Hot Lead)</b> ⚡

👤 <b>গ্রাহকের নাম:</b> ${escapeHtml(data.name)}
📞 <b>মোবাইল নম্বর:</b> <code>${escapeHtml(data.phone)}</code>

🧵 <b>নির্বাচিত ফেব্রিক্স:</b> ${escapeHtml(data.fabric)}
✨ <b>সেলাই স্টাইল:</b> ${escapeHtml(data.style)}
🌙 <b>পাজামা সেট:</b> ${data.pyjama}
💰 <b>আনুমানিক বাজেট:</b> <b>৳ ${data.total.toLocaleString("en-IN")}</b>
━━━━━━━━━━━━━━━━━━━━━
⏰ <b>সময়:</b> ${formattedDate}

⚡ <b>তাৎক্ষণিক অ্যাকশন:</b>
👉 <a href="tel:${cleanPhone}">📞 সরাসরি কল দিন</a>
👉 <a href="https://wa.me/88${cleanWaPhone}">💬 হোয়াটসঅ্যাপে মেসেজ দিন</a>
  `.trim();

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: msg,
        parse_mode: "HTML",
        disable_web_page_preview: true
      })
    });
  } catch (e) {
    // Non-blocking background notification
    console.warn("Estimator lead notification:", e);
  }
}

/**
 * Quick Quantity Preset Chips Handler
 */
function initQuantityPresets() {
  const qtyInput = document.getElementById("order-quantity");
  const presetBtns = document.querySelectorAll(".qty-preset-btn");
  if (!qtyInput || !presetBtns.length) return;

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.dataset.qty;
      qtyInput.value = val;
      presetBtns.forEach((b) => {
        b.classList.remove("bg-[#cfa853]", "text-[#04261f]");
        b.classList.add("bg-white/10", "text-stone-200");
      });
      btn.classList.add("bg-[#cfa853]", "text-[#04261f]");
      btn.classList.remove("bg-white/10", "text-stone-200");
    });
  });

  qtyInput.addEventListener("input", () => {
    const curVal = qtyInput.value;
    presetBtns.forEach((b) => {
      if (b.dataset.qty === curVal) {
        b.classList.add("bg-[#cfa853]", "text-[#04261f]");
        b.classList.remove("bg-white/10", "text-stone-200");
      } else {
        b.classList.remove("bg-[#cfa853]", "text-[#04261f]");
        b.classList.add("bg-white/10", "text-stone-200");
      }
    });
  });
}

/**
 * Handle Order / Inquiry Form Submission to Telegram Bot API
 */
function initFormSubmission() {
  const form = document.getElementById("inquiry-form");
  const submitBtn = document.getElementById("submit-btn");
  const submitText = document.getElementById("submit-btn-text");
  const submitSpinner = document.getElementById("submit-btn-spinner");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Gather form data
    const name = document.getElementById("customer-name")?.value.trim() || "";
    const rawPhoneInput = document.getElementById("customer-phone")?.value.trim() || "";
    const orderType = document.getElementById("order-type")?.value || "custom_panjabi";
    const rawQuantity = document.getElementById("order-quantity")?.value || "1";
    const fabricPreference = document.getElementById("order-fabric")?.value || "আলোচনা সাপেক্ষে";
    const district = document.getElementById("order-district")?.value || "কিশোরগঞ্জ (Kishoreganj)";
    const notes = document.getElementById("order-notes")?.value.trim() || "";

    // Normalize Bengali digits to English
    const phone = normalizeBengaliDigits(rawPhoneInput);
    const quantity = normalizeBengaliDigits(rawQuantity) || "1";
    const rawDigits = phone.replace(/[^\d]/g, "");

    // Basic Validation
    if (!name) {
      showToast("অনুগ্রহ করে আপনার নাম লিখুন।", "error");
      document.getElementById("customer-name")?.focus();
      return;
    }

    if (!phone || rawDigits.length < 10) {
      showToast("সঠিক ১১ ডিজিটের ফোন নম্বর দিন (যেমন: 01728769213)।", "error");
      document.getElementById("customer-phone")?.focus();
      return;
    }

    // Set Loading State
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = "তথ্য পাঠানো হচ্ছে...";
    if (submitSpinner) submitSpinner.classList.remove("hidden");

    const orderTypeLabelMap = {
      custom_panjabi: "✨ কাস্টম পাঞ্জাবী (ব্যক্তিগত মাপ ও সেলাই)",
      kabli_set: "🌙 সিগনেচার কাবলি ও পায়জামা সেট",
      festive_panjabi: "👑 উৎসব ও ঈদ স্পেশাল এক্সক্লুসিভ কালেকশন",
      linen_panjabi: "🍃 লাক্সারি সফট লিনেন পাঞ্জাবী",
      fabric_only: "🧵 প্রিমিয়াম থান ফেব্রিক্স ক্রয়"
    };

    const friendlyOrderType = orderTypeLabelMap[orderType] || orderType;
    const now = new Date();
    const formattedDate = now.toLocaleString("bn-BD", {
      timeZone: "Asia/Dhaka",
      dateStyle: "full",
      timeStyle: "short"
    });

    const config = window.APP_CONFIG || {};
    const botToken = config.telegram?.botToken;
    const chatId = config.telegram?.chatId;

    // Clean phone numbers for click-to-call & click-to-whatsapp
    const cleanPhone = phone.replace(/[\s-]/g, "");
    const cleanWaPhone = cleanPhone.replace(/^(\+?88)?0?/, "");

    // Check if Telegram credentials are still placeholder
    const isPlaceholder =
      !botToken ||
      !chatId ||
      botToken.includes("YOUR_TELEGRAM_BOT_TOKEN") ||
      chatId.includes("YOUR_TELEGRAM_CHAT_ID");

    if (isPlaceholder) {
      // Graceful fallback: Inform owner and allow instant WhatsApp dispatch
      setTimeout(() => {
        resetSubmitState();
        showConfigModal({
          name,
          phone,
          orderType: friendlyOrderType,
          quantity,
          fabricPreference,
          district,
          notes
        });
      }, 700);
      return;
    }

    const displayNotes = notes ? escapeHtml(notes) : "কোনো বিশেষ নির্দেশনা দেওয়া হয়নি";

    // Prepare Ultra-Clean & Easily Readable Telegram Message (HTML formatted)
    const telegramMessage = `
👑 <b>নূরানী পাঞ্জাবী টেইলার্স অ্যান্ড ফেব্রিক্স</b>
━━━━━━━━━━━━━━━━━━━━━
✨ <b>নতুন অর্ডার অনুসন্ধান (New Order)</b> ✨

👤 <b>গ্রাহকের নাম:</b> ${escapeHtml(name)}
📞 <b>মোবাইল নম্বর:</b> <code>${escapeHtml(phone)}</code>
📍 <b>ডেলিভারি জেলা:</b> <b>${escapeHtml(district)}</b>

📦 <b>অর্ডারের বিবরণ:</b>
▫️ <b>ক্যাটাগরি:</b> ${escapeHtml(friendlyOrderType)}
▫️ <b>পরিমাণ:</b> <b>${escapeHtml(quantity)} টি (Pcs)</b>
▫️ <b>ফেব্রিক্স:</b> ${escapeHtml(fabricPreference)}

📝 <b>বিশেষ নির্দেশনা বা মাপ:</b>
<blockquote>${displayNotes}</blockquote>
━━━━━━━━━━━━━━━━━━━━━
⏰ <b>সময়:</b> ${formattedDate}

⚡ <b>তাৎক্ষণিক অ্যাকশন:</b>
👉 <a href="tel:${cleanPhone}">📞 গ্রাহককে সরাসরি কল দিন</a>
👉 <a href="https://wa.me/88${cleanWaPhone}">💬 গ্রাহককে হোয়াটসঅ্যাপে লিখুন</a>
    `.trim();

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: "HTML",
            disable_web_page_preview: true
          })
        }
      );

      const result = await response.json();

      if (result.ok) {
        showSuccessModal(name, phone);
        form.reset();
      } else {
        console.error("Submission API Error:", result);
        showTelegramFallbackModal(
          "অর্ডারটি সরাসরি WhatsApp-এ নিশ্চিত করুন।",
          { name, phone, orderType: friendlyOrderType, quantity, district, notes }
        );
      }
    } catch (err) {
      console.error("Network Error:", err);
      showTelegramFallbackModal(
        "নেটওয়ার্ক সংযোগ দুর্বল। দয়া করে সরাসরি হোয়াটসঅ্যাপে পাঠান।",
        { name, phone, orderType: friendlyOrderType, quantity, district, notes }
      );
    } finally {
      resetSubmitState();
    }
  });

  function resetSubmitState() {
    if (submitBtn) submitBtn.disabled = false;
    if (submitText) submitText.textContent = "তথ্য জমা দিন (Submit Order)";
    if (submitSpinner) submitSpinner.classList.add("hidden");
  }
}

/**
 * Escape HTML characters for Telegram parse_mode: 'HTML'
 */
function escapeHtml(string) {
  return String(string)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Toast notification system
 */
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container") || createToastContainer();
  const toast = document.createElement("div");

  const bgColors = {
    success: "bg-emerald-800 text-white border-emerald-500",
    error: "bg-rose-800 text-white border-rose-500",
    info: "bg-amber-900 text-amber-100 border-amber-600"
  };

  toast.className = `flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl transition-all duration-300 transform translate-y-2 opacity-0 text-sm font-medium ${
    bgColors[type] || bgColors.info
  }`;

  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  }, 20);

  // Auto remove
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

function createToastContainer() {
  const div = document.createElement("div");
  div.id = "toast-container";
  div.className = "fixed bottom-20 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none";
  document.body.appendChild(div);
  return div;
}

/**
 * Modal shown on successful submission
 */
function showSuccessModal(name, phone) {
  const modal = document.getElementById("success-modal");
  const modalName = document.getElementById("success-modal-name");
  const modalPhone = document.getElementById("success-modal-phone");

  if (modalName) modalName.textContent = name;
  if (modalPhone) modalPhone.textContent = phone;

  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

/**
 * Helper modal when Telegram Token is not set or network fails
 */
function showConfigModal(leadData) {
  window._lastLead = leadData;
  const modal =
    document.getElementById("whatsapp-forward-modal") ||
    document.getElementById("telegram-setup-modal");
  if (!modal) {
    // If modal element doesn't exist, open WhatsApp directly
    forwardToWhatsApp(leadData);
    return;
  }

  // Pre-fill lead preview
  const leadPreviewEl = document.getElementById("lead-preview-text");
  if (leadPreviewEl) {
    leadPreviewEl.innerText = `নাম: ${leadData.name}\nমোবাইল: ${leadData.phone}\nধরন: ${leadData.orderType}\nপরিমাণ: ${leadData.quantity} টি\nফেব্রিক্স: ${leadData.fabricPreference}\nজেলা: ${leadData.district}\nনোট: ${leadData.notes}`;
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function showTelegramFallbackModal(reason, leadData) {
  window._lastLead = leadData;
  showToast(reason, "info");
  forwardToWhatsApp(leadData);
}

/**
 * Redirect or open WhatsApp with formatted order details
 */
window.forwardToWhatsApp = function (leadData) {
  const config = window.APP_CONFIG || {};
  const waNumber = config.whatsappNumber || "8801728769213";

  const message = `👑 *নূরানী পাঞ্জাবী টেইলার্স অ্যান্ড ফেব্রিক্স*
━━━━━━━━━━━━━━━━━━━━━
✨ *নতুন অর্ডার অনুসন্ধান (Order Inquiry)* ✨

👤 *নাম:* ${leadData.name || ""}
📞 *মোবাইল:* ${leadData.phone || ""}
📍 *ডেলিভারি জেলা:* ${leadData.district || "কিশোরগঞ্জ"}

📦 *অর্ডার বিবরণ:*
▫️ *ক্যাটাগরি:* ${leadData.orderType || ""}
▫️ *পরিমাণ:* ${leadData.quantity || "1"} টি (Pcs)
▫️ *ফেব্রিক্স:* ${leadData.fabricPreference || "আলোচনা সাপেক্ষে"}

📝 *বিশেষ নির্দেশনা বা মাপ:*
${leadData.notes || "কোনো বিশেষ নির্দেশনা দেওয়া হয়নি"}`;

  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
};

/**
 * Modals handlers (Close, backdrop click, ESC key)
 */
function initModalHandlers() {
  const closeBtns = document.querySelectorAll(".close-modal-btn");
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal-backdrop");
      if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }
    });
  });

  // Close on backdrop click
  document.querySelectorAll(".modal-backdrop").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }
    });
  });

  // Close on Escape
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop").forEach((modal) => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      });
    }
  });

  // Watch Measurement Video Modal Open Trigger
  const watchVideoBtn = document.getElementById("btn-watch-video");
  const videoModal = document.getElementById("measurement-video-modal");
  if (watchVideoBtn && videoModal) {
    watchVideoBtn.addEventListener("click", () => {
      videoModal.classList.remove("hidden");
      videoModal.classList.add("flex");
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Measurement Guide Tab Switcher (if present)
  const tabs = document.querySelectorAll(".measure-tab-btn");
  const tabContents = document.querySelectorAll(".measure-tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.target;
      tabs.forEach((t) => {
        t.classList.remove("border-amber-500", "text-amber-800", "bg-amber-50");
        t.classList.add("border-transparent", "text-stone-600");
      });
      tab.classList.add("border-amber-500", "text-amber-800", "bg-amber-50");
      tab.classList.remove("border-transparent", "text-stone-600");

      tabContents.forEach((content) => {
        if (content.id === targetId) {
          content.classList.remove("hidden");
        } else {
          content.classList.add("hidden");
        }
      });
    });
  });
}

/**
 * FAQ Accordion toggle
 */
function initFaqAccordion() {
  const faqToggles = document.querySelectorAll(".faq-toggle");

  faqToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const answer = toggle.nextElementSibling;
      const icon = toggle.querySelector(".faq-icon");
      const isOpen = answer.classList.contains("open");

      // Close all
      document.querySelectorAll(".faq-answer").forEach((a) => a.classList.remove("open"));
      document.querySelectorAll(".faq-icon").forEach((i) => i.classList.remove("rotate-180"));

      if (!isOpen) {
        answer.classList.add("open");
        if (icon) icon.classList.add("rotate-180");
      }
    });
  });
}

/**
 * Mobile Navigation Menu & Bottom Bar Visibility
 * Handles smooth 3-line hamburger to X morphing, backdrop fade, and hides the sticky bottom bar when open.
 */
function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const menuCloseBtn = document.getElementById("mobile-menu-close");
  const mobileNav = document.getElementById("mobile-nav-drawer");
  const mobileBackdrop = document.getElementById("mobile-nav-backdrop");
  const mobileBottomBar = document.getElementById("mobile-bottom-bar");
  const navLinks = document.querySelectorAll(".mobile-nav-link");

  if (!menuBtn || !mobileNav) return;

  function openMenu() {
    mobileNav.classList.remove("translate-x-full");
    menuBtn.classList.add("menu-open");

    // Fade in backdrop
    if (mobileBackdrop) {
      mobileBackdrop.classList.remove("opacity-0", "pointer-events-none");
      mobileBackdrop.classList.add("opacity-100", "pointer-events-auto");
    }

    // Smoothly slide down the sticky bottom contact bar so it doesn't stay/collide with menu
    if (mobileBottomBar) {
      mobileBottomBar.classList.add("translate-y-full", "opacity-0", "pointer-events-none");
    }

    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileNav.classList.add("translate-x-full");
    menuBtn.classList.remove("menu-open");

    // Fade out backdrop
    if (mobileBackdrop) {
      mobileBackdrop.classList.remove("opacity-100", "pointer-events-auto");
      mobileBackdrop.classList.add("opacity-0", "pointer-events-none");
    }

    // Smoothly slide sticky bottom bar back into view
    if (mobileBottomBar) {
      mobileBottomBar.classList.remove("translate-y-full", "opacity-0", "pointer-events-none");
    }

    document.body.style.overflow = "";
  }

  // Toggle drawer and 3-line morphing on menu button click
  menuBtn.addEventListener("click", () => {
    const isOpen = menuBtn.classList.contains("menu-open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (menuCloseBtn) menuCloseBtn.addEventListener("click", closeMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener("click", closeMenu);
  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  // Close when ESC key is pressed
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuBtn.classList.contains("menu-open")) {
      closeMenu();
    }
  });
}

/**
 * Satisfying Click Ripple & Micro-Interaction Animations
 * Creates a smooth expanding gold/emerald wave on button clicks and interactive controls.
 */
function initClickAnimations() {
  document.addEventListener("click", (e) => {
    const interactiveTarget = e.target.closest(
      ".gold-gradient-btn, .emerald-gradient-btn, .qty-preset-btn, .dynamic-whatsapp-link, .dynamic-phone-link, .category-btn, #mobile-menu-btn, button[type='submit']"
    );
    if (!interactiveTarget) return;

    // Create ripple circle
    const rect = interactiveTarget.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "click-ripple";

    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    const x = e.clientX ? e.clientX - rect.left - radius : rect.width / 2 - radius;
    const y = e.clientY ? e.clientY - rect.top - radius : rect.height / 2 - radius;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    if (!interactiveTarget.classList.contains("ripple-element")) {
      interactiveTarget.classList.add("ripple-element");
    }

    interactiveTarget.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });
}

/**
 * Handle Business & Telegram Quick Settings Modal
 */
function initSettingsModal() {
  const modal = document.getElementById("settings-modal");
  const openBtn = document.getElementById("open-settings-modal-btn");
  const saveBtn = document.getElementById("save-settings-btn");
  const testBtn = document.getElementById("test-telegram-btn");

  const botTokenInput = document.getElementById("settings-bot-token");
  const chatIdInput = document.getElementById("settings-chat-id");
  const waInput = document.getElementById("settings-whatsapp");
  const fbInput = document.getElementById("settings-facebook");

  if (!modal) return;

  function populateCurrentValues() {
    const config = window.APP_CONFIG || {};
    if (botTokenInput) {
      botTokenInput.value =
        config.telegram?.botToken && !config.telegram.botToken.includes("YOUR_")
          ? config.telegram.botToken
          : "";
    }
    if (chatIdInput) {
      chatIdInput.value =
        config.telegram?.chatId && !config.telegram.chatId.includes("YOUR_")
          ? config.telegram.chatId
          : "";
    }
    if (waInput) {
      waInput.value = config.whatsappNumber || "8801728769213";
    }
    if (fbInput) {
      fbInput.value = config.facebookUrl || "https://www.facebook.com/Nooranipanjabi?mibextid=ZbWKwL";
    }
  }

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      populateCurrentValues();
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const token = botTokenInput?.value.trim() || "";
      const chatId = chatIdInput?.value.trim() || "";
      const wa = waInput?.value.trim() || "";
      const fb = fbInput?.value.trim() || "";

      if (token) localStorage.setItem("NOORANI_BOT_TOKEN", token);
      if (chatId) localStorage.setItem("NOORANI_CHAT_ID", chatId);
      if (wa) localStorage.setItem("NOORANI_WHATSAPP", wa);
      if (fb) localStorage.setItem("NOORANI_FB", fb);

      loadSavedSettings();
      setupBusinessContactInfo();

      modal.classList.add("hidden");
      modal.classList.remove("flex");

      showToast("সেটিংস সফলভাবে সেভ করা হয়েছে!", "success");
    });
  }

  if (testBtn) {
    testBtn.addEventListener("click", async () => {
      const token = botTokenInput?.value.trim();
      const chatId = chatIdInput?.value.trim();

      if (!token || !chatId) {
        showToast("দয়া করে Bot Token এবং Chat ID দুটোই লিখুন।", "error");
        return;
      }

      testBtn.disabled = true;
      testBtn.innerHTML = `<span>যাচাই করা হচ্ছে...</span>`;

      try {
        const testText = `✅ <b>নূরানী পাঞ্জাবী টেইলার্স - টেস্ট নোটিফিকেশন</b>\nটেলিগ্রাম বট সফলভাবে কানেক্ট হয়েছে! নতুন অর্ডারের মেসেজগুলো এই চ্যাটেই পাঠানো হবে।`;

        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: testText,
            parse_mode: "HTML"
          })
        });

        const data = await res.json();
        if (data.ok) {
          showToast("অভিনন্দন! টেলিগ্রামে টেস্ট মেসেজ চলে গেছে।", "success");
        } else {
          showToast(`ত্রুটি: ${data.description || "বট টোকেন বা চ্যাট আইডি ভুল"}`, "error");
        }
      } catch (err) {
        showToast("নেটওয়ার্ক ত্রুটি! টেলিগ্রামের সাথে সংযোগ করা যায়নি।", "error");
      } finally {
        testBtn.disabled = false;
        testBtn.innerHTML = `<i data-lucide="send" class="w-4 h-4 text-[#e8ca82]"></i><span>বট টেস্ট মেসেজ পাঠান</span>`;
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }
}

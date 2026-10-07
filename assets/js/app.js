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
 * Interactive Retail Price Estimator for Men's Custom Tailored Panjabis
 */
function initPriceEstimator() {
  const quantityInput = document.getElementById("calc-quantity");
  const quantityDisplay = document.getElementById("calc-quantity-val");
  const fabricSelect = document.getElementById("calc-fabric");
  const pyjamaCheckbox = document.getElementById("calc-pyjama");
  const embroideryCheckbox = document.getElementById("calc-embroidery");

  const unitPriceDisplay = document.getElementById("calc-unit-price");
  const totalPriceDisplay = document.getElementById("calc-total-price");
  const discountBadge = document.getElementById("calc-discount-badge");
  const turnaroundDisplay = document.getElementById("calc-turnaround");
  const quoteApplyBtn = document.getElementById("calc-apply-btn");

  if (!quantityInput || !unitPriceDisplay) return;

  function calculateQuote() {
    const qty = parseInt(quantityInput.value, 10) || 1;
    quantityDisplay.textContent = `${qty} টি (${qty > 1 ? "Pcs" : "Pc"})`;

    // Base price per fabric (Retail pricing)
    const baseFabricPrices = {
      premium_cotton: 950, // 100% Royal Cotton Voile & Poplin
      giza_cotton: 1450, // Luxury Egyptian & Giza Cotton
      linen_blend: 1650, // Premium Soft Linen Blend
      kabli_twill: 1850, // Signature Twill Kabli Suit
      silk_festive: 2150 // Exclusive Festive Silk & Shine
    };

    const fabricKey = fabricSelect ? fabricSelect.value : "premium_cotton";
    let basePrice = baseFabricPrices[fabricKey] || 950;

    // Add-on options
    if (pyjamaCheckbox && pyjamaCheckbox.checked) {
      basePrice += 450; // Matching Custom Tailored Pajama
    }
    if (embroideryCheckbox && embroideryCheckbox.checked) {
      basePrice += 250; // Designer Collar & Cuff Embroidery
    }

    // Individual retail combo discounts
    let discountPercent = 0;
    let badgeText = "একক কাস্টম অর্ডার";
    let turnaround = "৩-৫ কার্যদিবস";

    if (qty >= 6) {
      discountPercent = 15;
      badgeText = "১৫% স্পেশাল প্যাকেজ";
      turnaround = "৫-৭ কার্যদিবস";
    } else if (qty >= 4) {
      discountPercent = 10;
      badgeText = "১০% ফ্যামিলি সেভার";
      turnaround = "৫-৭ কার্যদিবস";
    } else if (qty >= 2) {
      discountPercent = 5;
      badgeText = "৫% কম্বো অফার";
      turnaround = "৩-৫ কার্যদিবস";
    } else {
      discountPercent = 0;
      badgeText = "একক কাস্টম অর্ডার";
      turnaround = "৩-৫ কার্যদিবস";
    }

    const discountedUnitPrice = Math.round(basePrice * (1 - discountPercent / 100));
    const totalPrice = discountedUnitPrice * qty;

    unitPriceDisplay.textContent = `৳ ${discountedUnitPrice.toLocaleString("en-IN")}`;
    totalPriceDisplay.textContent = `৳ ${totalPrice.toLocaleString("en-IN")}`;
    if (discountBadge) {
      discountBadge.textContent = badgeText;
    }
    if (turnaroundDisplay) {
      turnaroundDisplay.textContent = turnaround;
    }
  }

  quantityInput.addEventListener("input", calculateQuote);
  if (fabricSelect) fabricSelect.addEventListener("change", calculateQuote);
  if (pyjamaCheckbox) pyjamaCheckbox.addEventListener("change", calculateQuote);
  if (embroideryCheckbox) embroideryCheckbox.addEventListener("change", calculateQuote);

  // Initial calculation
  calculateQuote();

  // "Take this quote to Order Form" button
  if (quoteApplyBtn) {
    quoteApplyBtn.addEventListener("click", () => {
      const qty = quantityInput.value;
      const fabricText = fabricSelect ? fabricSelect.options[fabricSelect.selectedIndex].text : "Standard";
      const total = totalPriceDisplay.textContent;

      // Populate main form
      const orderTypeSelect = document.getElementById("order-type");
      const orderQtyInput = document.getElementById("order-quantity");
      const notesField = document.getElementById("order-notes");

      if (orderTypeSelect) orderTypeSelect.value = "custom_panjabi";
      if (orderQtyInput) orderQtyInput.value = qty;
      if (notesField) {
        notesField.value = `[এস্টিমেটর কোটেশন]: ফেব্রিক্স: ${fabricText}, আনুমানিক বাজেট: ${total}। কাস্টম মাপে সেলাই করতে চাই।`;
      }

      // Scroll to order form
      const formSection = document.getElementById("order-section");
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth" });
      }

      showToast("এস্টিমেটর তথ্য ফর্মটিতে যুক্ত করা হয়েছে!", "success");
    });
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

  // Close on Escape
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop").forEach((modal) => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      });
    }
  });

  // Measurement Guide Tab Switcher
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

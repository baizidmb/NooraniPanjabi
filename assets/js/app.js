/**
 * Noorani Panjabi Tailors and Fabrics - Main Application Logic
 * Handles Telegram Bot API submissions, WhatsApp integration, Bulk Calculator, and UI dynamics.
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
  initBulkCalculator();
  initFormSubmission();
  initModalHandlers();
  initSettingsModal();
  initFaqAccordion();
  initMobileMenu();
  initSmoothScroll();
});

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
  const waNumber = config.whatsappNumber || "8801700000000";
  const defaultWaText = encodeURIComponent(
    "আসসালামু আলাইকুম, আমি নূরানী পাঞ্জাবী টেইলার্স অ্যান্ড ফেব্রিক্স থেকে পাঞ্জাবী / বাল্ক ইউনিফর্ম সম্পর্কে বিস্তারিত জানতে চাই।"
  );

  waLinks.forEach((el) => {
    el.href = `https://wa.me/${waNumber}?text=${defaultWaText}`;
  });

  // Setup Facebook Links
  const fbLinks = document.querySelectorAll(".dynamic-facebook-link");
  fbLinks.forEach((el) => {
    el.href = config.facebookUrl || "https://facebook.com";
  });

  // Setup Phone Links
  const phoneLinks = document.querySelectorAll(".dynamic-phone-link");
  phoneLinks.forEach((el) => {
    el.href = `tel:${config.phone ? config.phone.replace(/[\s-]/g, "") : "+8801700000000"}`;
    if (el.dataset.showText === "true") {
      el.textContent = config.phoneDisplay || config.phone || "01700-000000";
    }
  });

  // Setup Address & Coverage
  const addressEls = document.querySelectorAll(".dynamic-address");
  addressEls.forEach((el) => {
    el.textContent = config.address || "Katiadi, Bangladesh";
  });

  // Setup Google Maps Links
  const mapLinks = document.querySelectorAll(".dynamic-maps-link");
  mapLinks.forEach((el) => {
    el.href = config.googleMapsUrl || "https://maps.google.com";
  });
}

/**
 * Interactive Bulk Quotation Calculator for Schools, Madrasas & Wholesale
 */
function initBulkCalculator() {
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
    const qty = parseInt(quantityInput.value, 10) || 50;
    quantityDisplay.textContent = `${qty} টি (Pcs)`;

    // Base price per fabric
    const baseFabricPrices = {
      madrasa_voile: 650, // Standard White/Offwhite Voile for Madrasa
      cotton_twill: 850, // School / Everyday durable cotton
      egyptian_cotton: 1250, // Premium luxury finish
      linen_blend: 1100, // Modern breathable linen
      kabli_fabric: 1450 // Heavy fall double ply Kabli fabric
    };

    const fabricKey = fabricSelect ? fabricSelect.value : "madrasa_voile";
    let basePrice = baseFabricPrices[fabricKey] || 750;

    // Add-on options
    if (pyjamaCheckbox && pyjamaCheckbox.checked) {
      basePrice += 320; // Includes Matching Pajama
    }
    if (embroideryCheckbox && embroideryCheckbox.checked) {
      basePrice += 80; // School/Madrasa Custom Logo Embroidery
    }

    // Tiered bulk discounts
    let discountPercent = 0;
    let turnaround = "৫-৭ দিন";

    if (qty >= 500) {
      discountPercent = 30; // 30% Wholesale discount
      turnaround = "১০-১৪ দিন";
    } else if (qty >= 200) {
      discountPercent = 25; // 25% discount
      turnaround = "৮-১০ দিন";
    } else if (qty >= 100) {
      discountPercent = 20; // 20% discount
      turnaround = "৭-৯ দিন";
    } else if (qty >= 50) {
      discountPercent = 15; // 15% discount
      turnaround = "৫-৭ দিন";
    } else if (qty >= 20) {
      discountPercent = 10; // 10% discount
      turnaround = "৪-৬ দিন";
    } else {
      discountPercent = 0;
      turnaround = "৩-৫ দিন";
    }

    const discountedUnitPrice = Math.round(basePrice * (1 - discountPercent / 100));
    const totalPrice = discountedUnitPrice * qty;

    unitPriceDisplay.textContent = `৳ ${discountedUnitPrice.toLocaleString("en-IN")}`;
    totalPriceDisplay.textContent = `৳ ${totalPrice.toLocaleString("en-IN")}`;
    if (discountBadge) {
      discountBadge.textContent = `${discountPercent}% ছাড় (Bulk Discount)`;
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

      if (orderTypeSelect) orderTypeSelect.value = "bulk_madrasa";
      if (orderQtyInput) orderQtyInput.value = qty;
      if (notesField) {
        notesField.value = `[ক্যালকুলেটর কোটেশন]: ফেব্রিক্স: ${fabricText}, আনুমানিক বাজেট: ${total}। লোগো ও স্পেসিফিকেশন নিয়ে আলোচনা করতে চাই।`;
      }

      // Scroll to order form
      const formSection = document.getElementById("order-section");
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth" });
      }

      showToast("ক্যালকুলেটর তথ্য ফর্মটিতে যোগ করা হয়েছে!", "success");
    });
  }
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
    const phone = document.getElementById("customer-phone")?.value.trim() || "";
    const orderType = document.getElementById("order-type")?.value || "custom_panjabi";
    const quantity = document.getElementById("order-quantity")?.value || "1";
    const fabricPreference = document.getElementById("order-fabric")?.value || "Unspecified";
    const district = document.getElementById("order-district")?.value || "Dhaka";
    const notes = document.getElementById("order-notes")?.value.trim() || "No extra note";

    // Basic Validation
    if (!name || !phone) {
      showToast("অনুগ্রহ করে আপনার নাম এবং মোবাইল নম্বর লিখুন।", "error");
      return;
    }

    if (phone.length < 10) {
      showToast("সঠিক ১১ ডিজিটের ফোন নম্বর দিন (যেমন: 01700000000)।", "error");
      return;
    }

    // Set Loading State
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = "তথ্য পাঠানো হচ্ছে...";
    if (submitSpinner) submitSpinner.classList.remove("hidden");

    const orderTypeLabelMap = {
      bulk_madrasa: "🏫 মাদ্রাসা ইউনিফর্ম (মাদ্রাসার জন্য বাল্ক অর্ডার)",
      bulk_school: "🎒 স্কুল / কলেজ ইউনিফর্ম (বাল্ক অর্ডার)",
      bulk_wholesale: "👔 পাইকারি / হোলসেল ব্যবসা (ব্যবসায়ীদের জন্য)",
      custom_panjabi: "✨ কাস্টম পাঞ্জাবী টেইলরিং (ব্যক্তিগত)",
      kabli_set: "🌙 কাবলি ও পায়জামা সেট",
      fabric_only: "🧵 শুধুমাত্র প্রিমিয়াম ফেব্রিক্স থান ক্রয়"
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

    // Prepare Telegram Message formatted in clean HTML
    const telegramMessage = `
🌟 <b>নতুন অর্ডার অনুসন্ধান - নূরানী পাঞ্জাবী টেইলার্স</b> 🌟
━━━━━━━━━━━━━━━━━━
👤 <b>গ্রাহকের নাম:</b> ${escapeHtml(name)}
📞 <b>মোবাইল নম্বর:</b> <code>${escapeHtml(phone)}</code>
📦 <b>অর্ডারের ধরন:</b> ${escapeHtml(friendlyOrderType)}
🔢 <b>পরিমাণ:</b> ${escapeHtml(quantity)} টি (Pcs)
🧵 <b>পছন্দের ফেব্রিক্স:</b> ${escapeHtml(fabricPreference)}
📍 <b>জেলা / ঠিকানা:</b> ${escapeHtml(district)}
📝 <b>বিশেষ নোট / মাপ:</b> ${escapeHtml(notes)}
━━━━━━━━━━━━━━━━━━
⏰ <b>সময়:</b> ${formattedDate}
📱 <b>সরাসরি কল করতে:</b> tel:${phone.replace(/[\s-]/g, "")}
💬 <b>WhatsApp করতে:</b> https://wa.me/88${phone.replace(/^0+/, "").replace(/[\s-]/g, "")}
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
        console.error("Telegram API Error:", result);
        showTelegramFallbackModal(
          `টেলিগ্রাম বটের ত্রুটি (${result.description || "Unrecognized error"})।`,
          { name, phone, orderType: friendlyOrderType, quantity, district, notes }
        );
      }
    } catch (err) {
      console.error("Network or API Error:", err);
      showTelegramFallbackModal(
        "নেটওয়ার্ক সংযোগ জনিত সমস্যা হয়েছে। দয়া করে হোয়াটসঅ্যাপে মেসেজ পাঠান।",
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
  const modal = document.getElementById("telegram-setup-modal");
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
  showToast(reason, "error");
  forwardToWhatsApp(leadData);
}

/**
 * Redirect or open WhatsApp with formatted order details
 */
window.forwardToWhatsApp = function (leadData) {
  const config = window.APP_CONFIG || {};
  const waNumber = config.whatsappNumber || "8801700000000";

  const message = `*🌟 নূরানী পাঞ্জাবী টেইলার্স - নতুন অর্ডার অনুসন্ধান 🌟*
━━━━━━━━━━━━━━━━━━
👤 *নাম:* ${leadData.name || ""}
📞 *মোবাইল:* ${leadData.phone || ""}
📦 *অর্ডারের ধরন:* ${leadData.orderType || ""}
🔢 *পরিমাণ:* ${leadData.quantity || "1"} টি
🧵 *ফেব্রিক্স:* ${leadData.fabricPreference || "সাধারণ"}
📍 *ঠিকানা/জেলা:* ${leadData.district || "ঢাকা"}
📝 *নোট/পরিমাপ:* ${leadData.notes || "কোনো বিশেষ নোট নেই"}`;

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
 * Mobile Navigation Menu
 */
function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const menuCloseBtn = document.getElementById("mobile-menu-close");
  const mobileNav = document.getElementById("mobile-nav-drawer");
  const navLinks = document.querySelectorAll(".mobile-nav-link");

  if (!menuBtn || !mobileNav) return;

  function openMenu() {
    mobileNav.classList.remove("translate-x-full");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileNav.classList.add("translate-x-full");
    document.body.style.overflow = "";
  }

  menuBtn.addEventListener("click", openMenu);
  if (menuCloseBtn) menuCloseBtn.addEventListener("click", closeMenu);
  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
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
      waInput.value = config.whatsappNumber || "8801700000000";
    }
    if (fbInput) {
      fbInput.value = config.facebookUrl || "https://facebook.com";
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

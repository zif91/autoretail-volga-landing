/* script.js - Interactive Functionality for Volga Landing Pages */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Header Scroll Effect
  const header = document.querySelector("header");
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Initial check

  // 2. Mobile Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      nav.classList.toggle("active");
    });

    // Close menu when clicking nav links
    const navLinks = nav.querySelectorAll("a");
    navLinks.forEach((link) => {
      navLinks.forEach((l) => {
        link.addEventListener("click", () => {
          menuToggle.classList.remove("active");
          nav.classList.remove("active");
        });
      });
    });
  }

  // 3. Model Details Tab Switching (C50, K40, K50)
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  if (tabBtns.length > 0 && tabContents.length > 0) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");

        // Remove active class from all buttons and contents
        tabBtns.forEach((b) => b.classList.remove("active"));
        tabContents.forEach((c) => c.classList.remove("active"));

        // Add active class to clicked button and target content
        btn.classList.add("active");
        const activeContent = document.getElementById(targetTab);
        if (activeContent) {
          activeContent.classList.add("active");
        }
      });
    });
  }

  // 4. Color Configurator
  const colorDots = document.querySelectorAll(".color-dot");
  colorDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const model = dot.getAttribute("data-model");
      const colorName = dot.getAttribute("data-color-name");
      const imgPath = dot.getAttribute("data-img");

      // Find parent tab content
      const parentTab = dot.closest(".tab-content");
      if (parentTab) {
        // Update image
        const configImg = parentTab.querySelector(".configurator-view img");
        if (configImg) {
          configImg.style.opacity = "0";
          setTimeout(() => {
            configImg.src = imgPath;
            configImg.style.opacity = "1";
          }, 200);
        }

        // Update color name display
        const colorDisplay = parentTab.querySelector(
          ".color-name-display span",
        );
        if (colorDisplay) {
          colorDisplay.textContent = colorName;
        }

        // Update active dot
        const dotsInTab = parentTab.querySelectorAll(".color-dot");
        dotsInTab.forEach((d) => d.classList.remove("active"));
        dot.classList.add("active");
      }
    });
  });

  // 5. Modals (Lead Capture & Callback)
  const modal = document.getElementById("lead-modal");
  const successModal = document.getElementById("success-modal");
  const modalCloseBtns = document.querySelectorAll(".modal-close");
  const openModalBtns = document.querySelectorAll(".open-modal-btn");
  const modalTitle = document.getElementById("modal-title");
  const modalModelSelect = document.getElementById("modal-model-select");

  const openModal = (title = "Оставить заявку", defaultModel = "") => {
    if (modal) {
      if (modalTitle) modalTitle.textContent = title;
      if (modalModelSelect && defaultModel) {
        modalModelSelect.value = defaultModel;
      }
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  };

  const closeModal = () => {
    if (modal) modal.classList.remove("active");
    if (successModal) successModal.classList.remove("active");
    document.body.style.overflow = "";
  };

  openModalBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const title = btn.getAttribute("data-modal-title") || "Оставить заявку";
      const model = btn.getAttribute("data-modal-model") || "";
      openModal(title, model);
    });
  });

  modalCloseBtns.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal || e.target === successModal) {
      closeModal();
    }
  });

  // 6. Form Submissions
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Simple validation
      const nameInput = form.querySelector('input[type="text"]');
      const phoneInput = form.querySelector('input[type="tel"]');
      const agreeCheckbox = form.querySelector('input[type="checkbox"]');

      if (phoneInput && phoneInput.value.trim().length < 10) {
        alert("Пожалуйста, введите корректный номер телефона.");
        return;
      }

      if (agreeCheckbox && !agreeCheckbox.checked) {
        alert("Необходимо согласие на обработку персональных данных.");
        return;
      }

      // Submit button loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : "Отправить";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Отправка...";
      }

      // Gather form data
      const formData = {
        name: nameInput ? nameInput.value : "",
        phone: phoneInput ? phoneInput.value : "",
        model: form.querySelector("select")
          ? form.querySelector("select").value
          : "General Request",
        source: window.location.pathname.includes("spb")
          ? "SPb (Wagner-Auto)"
          : "Moscow (Autoretail)",
      };

      console.log("Form submitted successfully:", formData);

      // Calltouch Integration Placeholder
      if (typeof window.ct === "function") {
        try {
          window.ct("trackLead", {
            phoneNumber: formData.phone,
            name: formData.name,
            subject: `Заявка с лендинга VOLGA: ${formData.model}`,
            comment: `Регион: ${formData.source}`,
          });
          console.log("Calltouch lead tracked successfully");
        } catch (err) {
          console.error("Calltouch tracking error:", err);
        }
      }

      // Simulate API request
      setTimeout(() => {
        // Reset form
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }

        // Close lead modal if open
        if (modal) modal.classList.remove("active");

        // Show success modal
        if (successModal) {
          successModal.classList.add("active");
          document.body.style.overflow = "hidden";
        } else {
          alert(
            "Спасибо! Ваша заявка успешно отправлена. Наш менеджер свяжется с вами в ближайшее время.",
          );
        }
      }, 1200);
    });
  });

  // 7. St. Petersburg Dealership Location Switcher (only runs on spb.html)
  const locationBtns = document.querySelectorAll(".location-tab-btn");
  const mapIframe = document.getElementById("dealer-map");
  const mainPhoneLink = document.getElementById("main-phone-link");

  if (locationBtns.length > 0 && mapIframe) {
    locationBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active class from all buttons
        locationBtns.forEach((b) => b.classList.remove("active"));
        // Add active class to clicked button
        btn.classList.add("active");

        // Get coordinates or map URL
        const mapUrl = btn.getAttribute("data-map-url");
        const phone = btn.getAttribute("data-phone");
        const phoneFormatted = btn.getAttribute("data-phone-formatted");

        // Update map iframe
        if (mapUrl) {
          mapIframe.src = mapUrl;
        }

        // Update main header phone number dynamically to match selected dealership
        if (mainPhoneLink && phone && phoneFormatted) {
          mainPhoneLink.href = `tel:${phone}`;
          mainPhoneLink.textContent = phoneFormatted;
        }
      });
    });
  }

  // 8. Trim filters
  const trimSelects = document.querySelectorAll(".trim-select");
  const trimRows = document.querySelectorAll(".trim-row");
  if (trimSelects.length && trimRows.length) {
    const filterTrims = () => {
      const modelVal = trimSelects[0]?.value || "";
      trimRows.forEach((row) => {
        const rowModel = row.getAttribute("data-model") || "";
        if (!modelVal || modelVal === "all" || rowModel === modelVal) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    };
    trimSelects.forEach((s) => s.addEventListener("change", filterTrims));
  }
});

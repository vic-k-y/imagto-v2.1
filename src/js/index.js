// Scroll-triggered animations for features section
document.addEventListener("DOMContentLoaded", function () {
  // Intersection Observer options
  const observerOptions = {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: "0px 0px -50px 0px", // Trigger 50px before the element enters the viewport
  };

  // Create the observer
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add animation classes when section comes into view
        const featuresH1 = entry.target.querySelector(".features-h1");
        const featuresSubtitle =
          entry.target.querySelector(".features-subtitle");
        const featuresBadge = entry.target.querySelector(".features-badge");
        const featureCards = entry.target.querySelectorAll(".feature-card");
        const useCaseH1 = entry.target.querySelector(".use-case-h1");
        const useCaseCards = entry.target.querySelectorAll(".use-case-card");

        // Animate features section
        if (featuresBadge) {
          featuresBadge.classList.add("animate-in");
        }
        if (featuresH1) {
          setTimeout(() => {
            featuresH1.classList.add("animate-in");
          }, 200);
        }
        if (featuresSubtitle) {
          setTimeout(() => {
            featuresSubtitle.classList.add("animate-in");
          }, 400);
        }
        if (featureCards.length > 0) {
          featureCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("animate-in");
            }, 600 + index * 150);
          });
        }

        // Animate use-case section
        if (useCaseH1) {
          useCaseH1.classList.add("animate-in");
        }
        if (useCaseCards.length > 0) {
          useCaseCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("animate-in");
            }, index * 300);
          });
        }

        // Animate CTA section
        const ctaContent = entry.target.querySelector(".cta-content");
        const ctaStats = entry.target.querySelector(".cta-stats");
        const ctaHeading = entry.target.querySelector(".cta-heading");
        const ctaFeatures = entry.target.querySelectorAll(".cta-feature");
        const ctaButtons = entry.target.querySelectorAll(".cta-button");

        if (ctaStats) {
          setTimeout(() => {
            ctaStats.classList.add("animate-in");
          }, 100);
        }
        if (ctaHeading) {
          setTimeout(() => {
            ctaHeading.classList.add("animate-in");
          }, 300);
        }
        if (ctaFeatures.length > 0) {
          ctaFeatures.forEach((feature, index) => {
            setTimeout(() => {
              feature.classList.add("animate-in");
            }, 500 + index * 150);
          });
        }
        if (ctaButtons.length > 0) {
          ctaButtons.forEach((button, index) => {
            setTimeout(() => {
              button.classList.add("animate-in");
            }, 800 + index * 100);
          });
        }

        // Stop observing once animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Start observing the features section
  const featuresSection = document.querySelector(".features-div");
  if (featuresSection) {
    observer.observe(featuresSection);
  }

  // Observe use-case section for scroll animations
  const useCaseSection = document.querySelector(".use-case-div");
  if (useCaseSection) {
    observer.observe(useCaseSection);
  }

  // Observe CTA section for scroll animations
  const ctaSection = document.querySelector(".cta-section");
  if (ctaSection) {
    observer.observe(ctaSection);
  }

  // Optional: Add smooth scrolling for navigation links
  const navLinks = document.querySelectorAll(".nav-link a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId.startsWith("#")) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          // Calculate offset for fixed navbar (adjust 80px based on your navbar height)
          const navbarHeight = document.querySelector(".navbar").offsetHeight;
          //   console.log(navbarHeight);
          const offsetTop = targetSection.offsetTop - navbarHeight - 0; // 20px extra padding

          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // Modal functionality
  const modalTriggers = document.querySelectorAll(".modal-trigger");
  const modals = document.querySelectorAll(".modal");
  const modalCloses = document.querySelectorAll(".modal-close");

  // Open modal
  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute("data-modal");
      const modal = document.getElementById(`${modalId}-modal`);
      if (modal) {
        modal.classList.add("show");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
      }
    });
  });

  // Close modal
  modalCloses.forEach((close) => {
    close.addEventListener("click", () => {
      close.closest(".modal").classList.remove("show");
      document.body.style.overflow = "auto"; // Restore scrolling
    });
  });

  // Close modal when clicking outside
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
        document.body.style.overflow = "auto"; // Restore scrolling
      }
    });
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modals.forEach((modal) => {
        if (modal.classList.contains("show")) {
          modal.classList.remove("show");
          document.body.style.overflow = "auto"; // Restore scrolling
        }
      });
    }
  });
});

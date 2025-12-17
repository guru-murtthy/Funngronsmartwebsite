document.addEventListener("DOMContentLoaded", () => {
  // 1. SAFETY CHECK: Ensure GSAP is loaded
  if (typeof gsap === "undefined") {
    console.error("GSAP is missing. Please add the CDN scripts.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true
  });

  /* =========================================
     1. OPTIMIZED 3D TILT (Performance Fixed)
     ========================================= */
  const cards = document.querySelectorAll(".glass-card");

  cards.forEach((card) => {
    // Optimization: Tell browser to expect changes
    card.style.willChange = "transform";
    
    // Variables to track state
    let rafId = null; 
    let mouseX = 0;
    let mouseY = 0;

    // 2. USE REQUEST ANIMATION FRAME
    // This decouples the math from the DOM update for 60fps smoothness
    const updateTransform = () => {
      // Reduced rotation divider (20) for a subtler, premium feel
      card.style.transform = 
        `rotateY(${mouseX / 20}deg) rotateX(${-mouseY / 20}deg) translateZ(20px)`;
      rafId = null;
    };

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      mouseX = e.clientX - rect.left - rect.width / 2;
      mouseY = e.clientY - rect.top - rect.height / 2;

      // Only update if a frame isn't already pending
      if (!rafId) {
        rafId = requestAnimationFrame(updateTransform);
      }
    });

    card.addEventListener("mouseleave", () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      // Reset smoothly including Z-axis
      card.style.transform = "rotateY(0deg) rotateX(0deg) translateZ(0px)";
    });
  });

  /* =========================================
     2. ENTRANCE ANIMATIONS (Logic Fixed)
     ========================================= */
  
  // Hero Text
  gsap.from(".hero-text", {
    opacity: 0,
    y: 80,
    duration: 1.2,
    ease: "power3.out" // Adds a nice 'brake' effect at the end
  });

  // Hero Cards
  gsap.from(".glass-card", {
    opacity: 0,
    y: 60,
    stagger: 0.2,
    duration: 1,
    delay: 0.4,
    ease: "power3.out"
  });

  // 3. SEPARATE TRIGGERS FOR SCROLL SECTIONS
  // This ensures elements animate only when THEIR specific section is visible
  const sections = [
    { target: ".flow-card", trigger: ".flow" },
    { target: ".use-card",  trigger: ".use" },  // Assuming you have a section class .use
    { target: ".trust-card", trigger: ".trust" } // Assuming you have a section class .trust
  ];

  sections.forEach(section => {
    // Only run if the elements actually exist
    if (document.querySelector(section.target)) {
      gsap.from(section.target, {
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section.trigger, // Triggers based on its OWN parent
          start: "top 80%",
          toggleActions: "play none none reverse" // Optional: Replays on scroll up
        }
      });
    }
  });
});
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const FONT_WEIGHT = {
  subtitle: { min: 100, max: 400, default: 100 },
  title: { min: 400, max: 900, default: 400 },
};

const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      className={className}
      style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

const setupTextHover = (container, type) => {
  if (!container) return;

  const letters = container.querySelectorAll("span");
  const { min, max, default: base } = FONT_WEIGHT[type];

  const animateLetters = (letter, weight, duration = 0.25) => {
    return gsap.to(letter, {
      duration,
      ease: "power2.out",
      fontVariationSettings: `'wght' ${weight}`,
    });
  };

  const handleMouseMove = (e) => {
    const { left } = container.getBoundingClientRect();
    const mouseX = e.clientX - left;

    letters.forEach((letter) => {
      const { left: l, width: w } = letter.getBoundingClientRect();
      const distance = Math.abs(mouseX - (l - left + w / 2));
      const intensity = Math.max(0, 1 - distance ** 2 / 2000);

      animateLetters(letter, min + (max - min) * intensity);
    });
  };

  const handleMouseLeave = () => {
    letters.forEach((letter) => {
      animateLetters(letter, base, 0.3);
    });
  };

  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
  };
};

const Welcome = () => {
  const titleRef = useRef(null);
  const subTitleRef = useRef(null);
  const sectionRef = useRef(null);
  const smallScreenRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial entrance animations
    tl.from(sectionRef.current, {
      opacity: 0,
      duration: 0.5,
    })
      .from(
        subTitleRef.current.querySelectorAll("span"),
        {
          opacity: 0,
          y: 50,
          rotationX: -90,
          stagger: 0.02,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        0.3
      )
      .from(
        titleRef.current.querySelectorAll("span"),
        {
          opacity: 0,
          scale: 0,
          rotation: 180,
          stagger: {
            each: 0.03,
            from: "center",
          },
          duration: 1,
          ease: "elastic.out(1, 0.5)",
        },
        0.5
      )
      .from(
        smallScreenRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.6,
        },
        1.2
      );

    // Continuous floating animation for subtitle
    gsap.to(subTitleRef.current, {
      y: -10,
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Continuous glow pulse for title
    gsap.to(titleRef.current, {
      textShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
      duration: 1.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Setup interactive hover effects
    setupTextHover(titleRef.current, "title");
    setupTextHover(subTitleRef.current, "subtitle");

    // Parallax effect on mouse move
    const handleParallax = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPos = (clientX / innerWidth - 0.5) * 20;
      const yPos = (clientY / innerHeight - 0.5) * 20;

      gsap.to(subTitleRef.current, {
        x: xPos,
        duration: 0.5,
        ease: "power2.out",
      });

      gsap.to(titleRef.current, {
        x: -xPos * 0.5,
        y: -yPos * 0.5,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleParallax);

    return () => {
      window.removeEventListener("mousemove", handleParallax);
    };
  }, []);

  return (
    <section id="welcome" ref={sectionRef} className="relative overflow-hidden">
      <p ref={subTitleRef} className="transition-transform duration-300">
        {renderText("Hey, I'm Reyaham! Welcome to my", "text-3xl font-georama", 100)}
      </p>
      <h1
        ref={titleRef}
        className="mt-7 cursor-pointer transition-all duration-300 hover:scale-105"
      >
        {renderText("Portfolio", "text-9xl italic font-georama", 400)}
      </h1>
      <div ref={smallScreenRef} className="small-screen">
        <p>This Portfolio is Designed For Desktop/Tablet Screen Only</p>
      </div>
    </section>
  );
};

export default Welcome;
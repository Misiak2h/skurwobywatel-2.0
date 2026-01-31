(function () {

  function initHologram() {
    const holos = document.querySelectorAll(".holo-back");
    const bases = document.querySelectorAll(".base-back");
    const tops = document.querySelectorAll(".godlo-top");


    if (holos.length === 0) {
      return;
    }

    bases.forEach((base) => {
      base.style.display = "block";
      base.style.opacity = "1";
    });

    tops.forEach((top) => {
      top.style.display = "block";
      top.style.opacity = "1";
    });

    holos.forEach((holo) => {
      holo.style.opacity = "0.7";
      holo.style.backgroundPosition = "center 50%";
    });

  }

  initHologram();

  window.addEventListener("pageshow", function (event) {
    initHologram();
  });

  function handleOrientation(e) {
    let beta = e.beta;
    if (beta === null || typeof beta !== "number" || Number.isNaN(beta)) {
      if (typeof e.gamma === "number" && !Number.isNaN(e.gamma)) {
        beta = e.gamma;
      } else {
        return;
      }
    }

    const holos = document.querySelectorAll(".holo-back");

    let t = Math.sin(((beta - 90) * Math.PI) / 180);
    t = Math.abs(t);
    t = Math.pow(t, 0.8);

    let minOpacity = 0.3;
    if (beta >= 60 && beta <= 140) {
      minOpacity = 0.7;
    }
    const opacity = Math.max(minOpacity, t);

    const pos = 100 * t;

    holos.forEach((holo) => {
      holo.style.backgroundPosition = `center ${pos}%`;
      holo.style.opacity = opacity;
    });
  }

  function enableMotionSensor() {
    window.addEventListener("deviceorientation", handleOrientation);
    window.addEventListener("deviceorientationabsolute", handleOrientation);
  }

  function enableMouseFallback() {
    let active = false;
    const handleMouseMove = function (e) {
      if (!active) return;
      const height = window.innerHeight || 1;
      const ratio = Math.max(0, Math.min(1, e.clientY / height));
      const beta = 180 * (1 - ratio);
      handleOrientation({ beta: beta });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const testOnce = function (e) {
      if (e && typeof e.beta === "number" && !Number.isNaN(e.beta)) {
        active = false;
        window.removeEventListener("deviceorientation", testOnce);
        window.removeEventListener("deviceorientationabsolute", testOnce);
      } else {
        active = true;
      }
    };
    window.addEventListener("deviceorientation", testOnce, { once: true });
    window.addEventListener("deviceorientationabsolute", testOnce, { once: true });
  }

  enableMotionSensor();
  enableMouseFallback();
})();

import { useEffect, useRef } from 'react';

function StarfieldCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    let animationId;
    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
      }));
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        const alpha = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(time * star.speed + star.phase));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 240, 235, ${alpha})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      draw(0);
    } else {
      animationId = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="baby-book-shell__starfield" aria-hidden="true" />;
}

export default StarfieldCanvas;

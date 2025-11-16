import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const mapsRef = useRef([]);
  const animationFrameRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize dots
    const dotCount = 30;
    dotsRef.current = Array.from({ length: dotCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: 3 + Math.random() * 2,
    }));

    // Initialize map icons
    const mapCount = 8;
    mapsRef.current = Array.from({ length: mapCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    }));

    const drawMapIcon = (ctx, x, y, rotation, size, primaryColor) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.strokeStyle = `rgba(${primaryColor}, 0.4)`;
      ctx.lineWidth = 1.5;
      ctx.fillStyle = `rgba(${primaryColor}, 0.15)`;

      // Draw a simplified map pin shape
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(-size * 0.6, size * 0.3);
      ctx.lineTo(0, size * 0.1);
      ctx.lineTo(size * 0.6, size * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Add a small circle at the top
      ctx.beginPath();
      ctx.arc(0, -size * 0.8, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Check dark mode dynamically
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const primaryColor = isDarkMode ? "147, 197, 253" : "59, 130, 246"; // blue-300 or blue-500
      const secondaryColor = isDarkMode ? "96, 165, 250" : "37, 99, 235"; // blue-400 or blue-600

      // Update and draw dots
      dotsRef.current.forEach((dot) => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Bounce off edges
        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

        // Keep in bounds
        dot.x = Math.max(0, Math.min(canvas.width, dot.x));
        dot.y = Math.max(0, Math.min(canvas.height, dot.y));
      });

      // Update and draw map icons
      mapsRef.current.forEach((map) => {
        map.x += map.vx;
        map.y += map.vy;
        map.rotation += map.rotationSpeed;

        // Bounce off edges
        if (map.x < 50 || map.x > canvas.width - 50) map.vx *= -1;
        if (map.y < 50 || map.y > canvas.height - 50) map.vy *= -1;

        // Keep in bounds
        map.x = Math.max(50, Math.min(canvas.width - 50, map.x));
        map.y = Math.max(50, Math.min(canvas.height - 50, map.y));
      });

      // Draw connections between nearby dots
      const connectionDistance = 150;
      const time = Date.now() * 0.001;
      for (let i = 0; i < dotsRef.current.length; i++) {
        for (let j = i + 1; j < dotsRef.current.length; j++) {
          const dot1 = dotsRef.current[i];
          const dot2 = dotsRef.current[j];
          const dx = dot2.x - dot1.x;
          const dy = dot2.y - dot1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.4;
            const pulse = (Math.sin(time * 2 + distance * 0.1) + 1) * 0.5;
            ctx.strokeStyle = `rgba(${primaryColor}, ${opacity * (0.5 + pulse * 0.5)})`;
            ctx.lineWidth = 0.5 + pulse * 0.5;
            ctx.beginPath();
            ctx.moveTo(dot1.x, dot1.y);
            ctx.lineTo(dot2.x, dot2.y);
            ctx.stroke();
          }
        }
      }

      // Draw dots with pulsing effect
      dotsRef.current.forEach((dot, index) => {
        const pulse = (Math.sin(time * 3 + index) + 1) * 0.5;
        const glowRadius = dot.radius * 2 + pulse * 3;
        
        const gradient = ctx.createRadialGradient(
          dot.x,
          dot.y,
          0,
          dot.x,
          dot.y,
          glowRadius
        );
        gradient.addColorStop(0, `rgba(${primaryColor}, ${0.6 + pulse * 0.3})`);
        gradient.addColorStop(1, `rgba(${primaryColor}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${secondaryColor}, ${0.9 + pulse * 0.1})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw map icons
      mapsRef.current.forEach((map) => {
        drawMapIcon(ctx, map.x, map.y, map.rotation, 20, primaryColor);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
}


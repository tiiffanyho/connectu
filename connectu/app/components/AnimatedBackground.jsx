import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const mapOffsetRef = useRef({ x: 0, y: 0 });
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

    // Initialize connection dots
    const dotCount = 25;
    dotsRef.current = Array.from({ length: dotCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 3 + Math.random() * 2,
    }));

    // Create a map pattern (simplified world map continents)
    const drawMapPattern = (ctx, offsetX, offsetY, width, height, mapColor) => {
      ctx.save();
      ctx.translate(offsetX, offsetY);

      // Draw ocean/water background with subtle pattern
      ctx.fillStyle = `rgba(${mapColor}, 0.08)`;
      ctx.fillRect(0, 0, width, height);

      // Draw grid lines for map structure (more visible)
      ctx.strokeStyle = `rgba(${mapColor}, 0.4)`;
      ctx.lineWidth = 1.5;
      
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw simplified continent shapes (much more visible)
      ctx.fillStyle = `rgba(${mapColor}, 0.4)`;
      ctx.strokeStyle = `rgba(${mapColor}, 0.7)`;
      ctx.lineWidth = 2.5;

      // Continent 1 (North America-like) - more detailed shape
      ctx.beginPath();
      ctx.ellipse(width * 0.15, height * 0.25, width * 0.12, height * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Add detail to North America
      ctx.beginPath();
      ctx.ellipse(width * 0.12, height * 0.2, width * 0.05, height * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Continent 2 (South America-like)
      ctx.beginPath();
      ctx.ellipse(width * 0.2, height * 0.6, width * 0.08, height * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Continent 3 (Europe/Africa-like)
      ctx.beginPath();
      ctx.ellipse(width * 0.5, height * 0.3, width * 0.1, height * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Add Europe detail
      ctx.beginPath();
      ctx.ellipse(width * 0.48, height * 0.25, width * 0.04, height * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Continent 4 (Asia-like)
      ctx.beginPath();
      ctx.ellipse(width * 0.7, height * 0.25, width * 0.15, height * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Add China/India detail
      ctx.beginPath();
      ctx.ellipse(width * 0.68, height * 0.35, width * 0.08, height * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Continent 5 (Australia-like)
      ctx.beginPath();
      ctx.ellipse(width * 0.75, height * 0.7, width * 0.08, height * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Add some islands (more visible)
      const islands = [
        { x: width * 0.1, y: height * 0.15, size: 12 },
        { x: width * 0.3, y: height * 0.5, size: 10 },
        { x: width * 0.6, y: height * 0.2, size: 11 },
        { x: width * 0.4, y: height * 0.75, size: 13 },
        { x: width * 0.8, y: height * 0.4, size: 9 },
        { x: width * 0.25, y: height * 0.85, size: 10 },
        { x: width * 0.65, y: height * 0.6, size: 12 },
        { x: width * 0.9, y: height * 0.8, size: 8 },
      ];
      islands.forEach((island) => {
        ctx.fillStyle = `rgba(${mapColor}, 0.45)`;
        ctx.strokeStyle = `rgba(${mapColor}, 0.7)`;
        ctx.beginPath();
        ctx.arc(island.x, island.y, island.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Draw longitude/latitude lines (more visible)
      ctx.strokeStyle = `rgba(${mapColor}, 0.35)`;
      ctx.lineWidth = 1.5;
      
      // Latitude lines
      for (let i = 0; i < 6; i++) {
        const latY = (height / 6) * i;
        ctx.beginPath();
        ctx.moveTo(0, latY);
        ctx.lineTo(width, latY);
        ctx.stroke();
      }

      // Longitude lines
      for (let i = 0; i < 10; i++) {
        const lonX = (width / 10) * i;
        ctx.beginPath();
        ctx.moveTo(lonX, 0);
        ctx.lineTo(lonX, height);
        ctx.stroke();
      }

      // Add country borders/coastlines (more detail)
      ctx.strokeStyle = `rgba(${mapColor}, 0.5)`;
      ctx.lineWidth = 2;
      // Add some curved coastlines
      for (let i = 0; i < 15; i++) {
        const coastX = (width / 15) * i;
        const coastY = height * 0.3 + Math.sin(coastX * 0.01) * 50;
        ctx.beginPath();
        ctx.arc(coastX, coastY, 20, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Check dark mode dynamically
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const mapColor = isDarkMode ? "147, 197, 253" : "59, 130, 246"; // blue-300 or blue-500
      const primaryColor = isDarkMode ? "147, 197, 253" : "59, 130, 246";
      const secondaryColor = isDarkMode ? "96, 165, 250" : "37, 99, 235";

      // Slowly move the map background (slow speed - 0.1 pixels per frame)
      mapOffsetRef.current.x += 0.1;
      mapOffsetRef.current.y += 0.05;

      // Reset offset to create seamless scrolling
      const mapWidth = canvas.width * 1.5;
      const mapHeight = canvas.height * 1.5;
      if (mapOffsetRef.current.x > mapWidth) mapOffsetRef.current.x = 0;
      if (mapOffsetRef.current.y > mapHeight) mapOffsetRef.current.y = 0;

      // Draw the moving map background (draw multiple tiles for seamless scrolling)
      for (let x = -mapWidth; x < canvas.width + mapWidth; x += mapWidth) {
        for (let y = -mapHeight; y < canvas.height + mapHeight; y += mapHeight) {
          drawMapPattern(
            ctx,
            x + (mapOffsetRef.current.x % mapWidth) - mapWidth,
            y + (mapOffsetRef.current.y % mapHeight) - mapHeight,
            mapWidth,
            mapHeight,
            mapColor
          );
        }
      }

      // Update and draw connection dots
      dotsRef.current.forEach((dot) => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Wrap around edges
        if (dot.x < 0) dot.x = canvas.width;
        if (dot.x > canvas.width) dot.x = 0;
        if (dot.y < 0) dot.y = canvas.height;
        if (dot.y > canvas.height) dot.y = 0;
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
            const opacity = (1 - distance / connectionDistance) * 0.5;
            const pulse = (Math.sin(time * 2 + distance * 0.1) + 1) * 0.5;
            ctx.strokeStyle = `rgba(${primaryColor}, ${opacity * (0.6 + pulse * 0.4)})`;
            ctx.lineWidth = 0.5 + pulse * 0.5;
            ctx.beginPath();
            ctx.moveTo(dot1.x, dot1.y);
            ctx.lineTo(dot2.x, dot2.y);
            ctx.stroke();
          }
        }
      }

      // Draw connection dots with pulsing effect
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
        gradient.addColorStop(0, `rgba(${primaryColor}, ${0.7 + pulse * 0.3})`);
        gradient.addColorStop(1, `rgba(${primaryColor}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${secondaryColor}, ${0.95 + pulse * 0.05})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fill();
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
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}


import { useEffect, useRef, useState, useMemo } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  type: 'heart' | 'star' | 'sparkle';
  color: string;
  life: number;
  maxLife: number;
}

interface Firework {
  x: number;
  y: number;
  particles: FireworkParticle[];
  life: number;
}

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
}

export default function MagicBackground({ activePhase }: { activePhase: 'start' | 'scenario' | 'photo' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const fireworksRef = useRef<Firework[]>([]);
  const animRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = dimensions.w;
    canvas.height = dimensions.h;

    const colors = ['#ec4899', '#a855f7', '#f472b6', '#c084fc', '#fb923c', '#fbbf24', '#22d3ee'];
    const heartColors = ['#ec4899', '#f472b6', '#fb7185', '#f43f5e', '#e879f9'];

    function createParticle(): Particle {
      const type = Math.random() > 0.5 ? 'heart' : (Math.random() > 0.5 ? 'star' : 'sparkle');
      return {
        x: Math.random() * dimensions.w,
        y: -20 - Math.random() * 100,
        size: 8 + Math.random() * 16,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: 0.5 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.7,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 3,
        type,
        color: type === 'heart' ? heartColors[Math.floor(Math.random() * heartColors.length)] : colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 300 + Math.random() * 200,
      };
    }

    function createFirework(x: number, y: number): Firework {
      const particles: FireworkParticle[] = [];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const count = 30 + Math.floor(Math.random() * 20);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 1 + Math.random() * 3;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 2,
          color,
          opacity: 1,
          life: 60 + Math.random() * 40,
        });
      }
      return { x, y, particles, life: 100 };
    }

    // Initialize particles
    for (let i = 0; i < 20; i++) {
      const p = createParticle();
      p.y = Math.random() * dimensions.h;
      particlesRef.current.push(p);
    }

    function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(x, y + topCurveHeight);
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.2, x, y + size);
      ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
      ctx.closePath();
    }

    function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }

    let frameCount = 0;

    function animate() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      frameCount++;

      // Add new particles
      if (frameCount % 8 === 0 && particlesRef.current.length < 35) {
        particlesRef.current.push(createParticle());
      }

      // Add fireworks occasionally
      if (activePhase === 'start' && frameCount % 120 === 0) {
        fireworksRef.current.push(
          createFirework(
            dimensions.w * 0.2 + Math.random() * dimensions.w * 0.6,
            dimensions.h * 0.1 + Math.random() * dimensions.h * 0.3
          )
        );
      }

      // Draw and update particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.speedX + Math.sin(p.life * 0.02) * 0.5;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.life++;

        if (p.y > dimensions.h + 30 || p.life > p.maxLife) return false;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity * (1 - p.life / p.maxLife * 0.5);

        if (p.type === 'heart') {
          drawHeart(ctx, 0, -p.size / 2, p.size);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fill();
        } else if (p.type === 'star') {
          drawStar(ctx, 0, 0, p.size / 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 15;
          ctx.fill();
        }

        ctx.restore();
        return true;
      });

      // Draw fireworks
      fireworksRef.current = fireworksRef.current.filter(fw => {
        fw.life--;
        fw.particles = fw.particles.filter(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.03;
          p.vx *= 0.99;
          p.opacity -= 0.012;
          p.life--;

          if (p.opacity <= 0 || p.life <= 0) return false;

          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.restore();

          return true;
        });
        return fw.particles.length > 0;
      });

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      particlesRef.current = [];
      fireworksRef.current = [];
    };
  }, [dimensions, activePhase]);

  const stars = useMemo(() => {
    const colors = ['#fff', '#fbbf24', '#ec4899', '#a855f7', '#22d3ee'];
    const seed = [
      7,23,45,12,67,89,34,56,78,91,3,15,42,63,88,
      11,29,50,71,94,6,18,37,55,82,2,14,39,61,85,
      9,21,48,66,93,5,17,36,58,79
    ];
    return seed.map((s, i) => ({
      size: 1 + (s % 3),
      x: (s * 2.5 + i * 7.3) % 100,
      y: (s * 1.8 + i * 5.1) % 100,
      color: colors[i % 5],
      duration: 2 + (s % 4),
      delay: (i * 0.12) % 5,
      glow: 4 + (s % 6),
    }));
  }, []);

  return (
    <>
      {/* Gradient background */}
      <div className="fixed inset-0 -z-10 pointer-events-none" style={{
        background: 'linear-gradient(180deg, #0a0015 0%, #1a0030 25%, #0f0025 50%, #150020 75%, #0a0015 100%)',
      }} />
      
      {/* Animated clouds */}
      <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-15 animate-cloud-drift"
          style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)', animationDelay: '0s', animationDuration: '12s' }} />
        <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full opacity-10 animate-cloud-drift"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)', animationDelay: '3s', animationDuration: '15s' }} />
        <div className="absolute bottom-1/3 -left-10 w-72 h-72 rounded-full opacity-12 animate-cloud-drift"
          style={{ background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)', animationDelay: '6s', animationDuration: '18s' }} />
        <div className="absolute bottom-20 right-0 w-64 h-64 rounded-full opacity-10 animate-cloud-drift"
          style={{ background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)', animationDelay: '9s', animationDuration: '14s' }} />
      </div>

      {/* Static stars */}
      <div className="fixed inset-0 z-[2] pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-star-twinkle"
            style={{
              width: star.size + 'px',
              height: star.size + 'px',
              left: star.x + '%',
              top: star.y + '%',
              background: star.color,
              animationDuration: star.duration + 's',
              animationDelay: star.delay + 's',
              boxShadow: `0 0 ${star.glow}px currentColor`,
            }}
          />
        ))}
      </div>

      {/* Canvas for hearts, sparkles, fireworks */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[3] pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />
    </>
  );
}

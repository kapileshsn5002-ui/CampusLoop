'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowDown, CalendarPlus } from 'lucide-react';

interface HeroFuturisticProps {
  title?: string;
  subtitle?: string;
  description?: string;
  onExploreClick?: () => void;
  onApplyClick?: () => void;
  compact?: boolean;
}

export const HeroFuturistic = ({
  title = "CampusLoop",
  subtitle = "Smarter leave management. Better employee experiences.",
  description = "Manage employee leave, approvals and workforce visibility through one intelligent workplace platform.",
  onExploreClick,
  onApplyClick,
  compact = false
}: HeroFuturisticProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const titleWords = title.split(' ');
  const [visibleWords, setVisibleWords] = useState<number>(0);
  const [subtitleVisible, setSubtitleVisible] = useState<boolean>(false);

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 350);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setSubtitleVisible(true), 500);
      return () => clearTimeout(timeout);
    }
  }, [visibleWords, titleWords.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement.offsetWidth || 800);
    let height = (canvas.height = canvas.parentElement.offsetHeight || 400);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = compact ? 35 : 65;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.3
    }));

    let scanY = 0;
    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    canvas.parentElement.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const radialGlow = ctx.createRadialGradient(mouseX, mouseY, 10, width / 2, height / 2, width * 0.7);
      radialGlow.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
      radialGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.1)');
      radialGlow.addColorStop(1, 'rgba(7, 10, 18, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      scanY = (scanY + 1.2) % height;
      const scanGradient = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      scanGradient.addColorStop(0, 'rgba(6, 182, 212, 0)');
      scanGradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.35)');
      scanGradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanY - 20, width, 40);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${p1.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist / 110) * 0.25})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [compact]);

  return (
    <div
      className="hero-futuristic-container"
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: compact ? '14px' : '20px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #070a12 0%, #0b0f19 50%, #111827 100%)',
        color: '#ffffff',
        padding: compact ? '2rem 1.5rem' : '3.8rem 2rem',
        marginBottom: compact ? '1.5rem' : '2rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.2)',
        border: '1px solid rgba(99, 102, 241, 0.35)'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.85
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(6, 182, 212, 0.15) 50%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 2
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '920px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(99, 102, 241, 0.18)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#a5b4fc',
            marginBottom: '1.2rem',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.25)'
          }}
        >
          <Sparkles size={16} color="#818cf8" />
          <span>CampusLoop • Intelligent Leave Management Platform</span>
        </div>

        <div
          style={{
            fontSize: compact ? 'clamp(1.8rem, 3.5vw, 2.5rem)' : 'clamp(2.4rem, 5.5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
            textTransform: 'uppercase'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.6rem' }}>
            {titleWords.map((word, index) => (
              <span
                key={index}
                style={{
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                  opacity: index < visibleWords ? 1 : 0,
                  transform: index < visibleWords ? 'translateY(0)' : 'translateY(12px)',
                  background: index === titleWords.length - 1
                    ? 'linear-gradient(90deg, #818cf8 0%, #38bdf8 100%)'
                    : undefined,
                  WebkitBackgroundClip: index === titleWords.length - 1 ? 'text' : undefined,
                  WebkitTextFillColor: index === titleWords.length - 1 ? 'transparent' : undefined
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <h2
          style={{
            fontSize: compact ? '1.05rem' : 'clamp(1.1rem, 2.2vw, 1.4rem)',
            fontWeight: 700,
            color: '#ffffff',
            maxWidth: '750px',
            margin: '0 0 0.6rem 0',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            opacity: subtitleVisible ? 1 : 0,
            transform: subtitleVisible ? 'translateY(0)' : 'translateY(10px)'
          }}
        >
          {subtitle}
        </h2>

        {description && (
          <p
            style={{
              fontSize: '0.95rem',
              color: 'rgba(255, 255, 255, 0.75)',
              maxWidth: '680px',
              margin: '0 0 2rem 0',
              lineHeight: 1.5,
              transition: 'opacity 0.6s ease',
              opacity: subtitleVisible ? 1 : 0
            }}
          >
            {description}
          </p>
        )}

        {(onApplyClick || onExploreClick) && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {onApplyClick && (
              <button
                onClick={onApplyClick}
                className="primary-button"
                style={{
                  padding: '12px 26px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 25px rgba(99, 102, 241, 0.45)'
                }}
              >
                <CalendarPlus size={18} /> Apply for Leave
              </button>
            )}

            {onExploreClick && (
              <button
                onClick={onExploreClick}
                style={{
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                Explore Team Calendar <ArrowDown size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroFuturistic;

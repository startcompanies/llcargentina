'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './DotGrid.module.css';

type DotGridProps = {
  className?: string;
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  returnDuration?: number;
};

type Dot = {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  animating: boolean;
};

type PointerState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  lastTime: number;
  lastX: number;
  lastY: number;
};

function throttle<TArgs extends unknown[]>(callback: (...args: TArgs) => void, limit: number) {
  let lastCall = 0;

  return (...args: TArgs) => {
    const now = performance.now();

    if (now - lastCall < limit) {
      return;
    }

    lastCall = now;
    callback(...args);
  };
}

function hexToRgb(hex: string) {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);

  if (!match) {
    return { r: 0, g: 0, b: 0 };
  }

  return {
    r: Number.parseInt(match[1], 16),
    g: Number.parseInt(match[2], 16),
    b: Number.parseInt(match[3], 16)
  };
}

export function DotGrid({
  className = '',
  dotSize = 2,
  gap = 10,
  baseColor = '#18384d',
  activeColor = '#01C9E2',
  proximity = 130,
  speedTrigger = 150,
  shockRadius = 220,
  shockStrength = 3.2,
  returnDuration = 1.2
}: DotGridProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef<PointerState>({
    x: -9999,
    y: -9999,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0
  });
  const circlePathRef = useRef<Path2D | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.Path2D) {
      return;
    }

    const path = new window.Path2D();
    path.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    circlePathRef.current = path;
  }, [dotSize]);

  useEffect(() => {
    function buildGrid() {
      const wrapper = wrapperRef.current;
      const canvas = canvasRef.current;

      if (!wrapper || !canvas) {
        return;
      }

      const { width, height } = wrapper.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const context = canvas.getContext('2d');

      if (!context) {
        return;
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cell = dotSize + gap;
      const columns = Math.floor((width + gap) / cell);
      const rows = Math.floor((height + gap) / cell);
      const gridWidth = cell * columns - gap;
      const gridHeight = cell * rows - gap;
      const startX = (width - gridWidth) / 2 + dotSize / 2;
      const startY = (height - gridHeight) / 2 + dotSize / 2;
      const dots: Dot[] = [];

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          dots.push({
            cx: startX + column * cell,
            cy: startY + row * cell,
            xOffset: 0,
            yOffset: 0,
            animating: false
          });
        }
      }

      dotsRef.current = dots;
    }

    buildGrid();

    if (typeof ResizeObserver === 'undefined') {
      globalThis.addEventListener('resize', buildGrid);

      return () => {
        globalThis.removeEventListener('resize', buildGrid);
      };
    }

    const resizeObserver = new ResizeObserver(buildGrid);

    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [dotSize, gap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const circlePath = circlePathRef.current;

    if (!canvas || !circlePath) {
      return;
    }

    const baseRgb = hexToRgb(baseColor);
    const activeRgb = hexToRgb(activeColor);
    const proximitySquared = proximity * proximity;
    let frameId = 0;
    const pause = { tabHidden: document.hidden, offScreen: false, running: true };

    function draw() {
      const currentCanvas = canvasRef.current;
      const path = circlePathRef.current;

      if (!currentCanvas || !path) {
        return;
      }

      const context = currentCanvas.getContext('2d');

      if (!context) {
        return;
      }

      const { width, height } = currentCanvas.getBoundingClientRect();
      context.clearRect(0, 0, width, height);

      const pointer = pointerRef.current;

      for (const dot of dotsRef.current) {
        const x = dot.cx + dot.xOffset;
        const y = dot.cy + dot.yOffset;
        const dx = dot.cx - pointer.x;
        const dy = dot.cy - pointer.y;
        const distanceSquared = dx * dx + dy * dy;

        let fillColor = baseColor;

        if (distanceSquared <= proximitySquared) {
          const distance = Math.sqrt(distanceSquared);
          const intensity = 1 - distance / proximity;
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * intensity);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * intensity);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * intensity);
          fillColor = `rgb(${r}, ${g}, ${b})`;
        }

        context.save();
        context.translate(x, y);
        context.fillStyle = fillColor;
        context.fill(path);
        context.restore();
      }

      if (pause.running) {
        frameId = window.requestAnimationFrame(draw);
      }
    }

    const resumeLoop = () => {
      if (!pause.running) {
        pause.running = true;
        frameId = window.requestAnimationFrame(draw);
      }
    };

    const pauseLoop = () => {
      if (pause.running) {
        pause.running = false;
        window.cancelAnimationFrame(frameId);
      }
    };

    const syncPause = () => {
      if (pause.tabHidden || pause.offScreen) pauseLoop();
      else resumeLoop();
    };

    const onVisibilityChange = () => {
      pause.tabHidden = document.hidden;
      syncPause();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        pause.offScreen = !entry.isIntersecting;
        syncPause();
      },
      { threshold: 0 }
    );
    const wrapper = wrapperRef.current;
    if (wrapper) intersectionObserver.observe(wrapper);

    frameId = window.requestAnimationFrame(draw);

    return () => {
      pause.running = false;
      window.cancelAnimationFrame(frameId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      intersectionObserver.disconnect();
    };
  }, [activeColor, baseColor, proximity]);

  useEffect(() => {
    function releaseDot(dot: Dot) {
      gsap.to(dot, {
        xOffset: 0,
        yOffset: 0,
        duration: returnDuration,
        ease: 'elastic.out(1, 0.75)',
        overwrite: true,
        onComplete: () => {
          dot.animating = false;
        }
      });
    }

    const onMove = throttle((event: MouseEvent) => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const pointer = pointerRef.current;
      const now = performance.now();
      const dt = pointer.lastTime ? now - pointer.lastTime : 16;
      const dx = event.clientX - pointer.lastX;
      const dy = event.clientY - pointer.lastY;

      pointer.lastTime = now;
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
      pointer.vx = (dx / dt) * 1000;
      pointer.vy = (dy / dt) * 1000;
      pointer.speed = Math.hypot(pointer.vx, pointer.vy);

      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;

      if (pointer.speed < speedTrigger) {
        return;
      }

      for (const dot of dotsRef.current) {
        if (dot.animating) {
          continue;
        }

        const distance = Math.hypot(dot.cx - pointer.x, dot.cy - pointer.y);

        if (distance > proximity) {
          continue;
        }

        const falloff = 1 - distance / proximity;
        dot.animating = true;
        gsap.killTweensOf(dot);
        gsap.to(dot, {
          xOffset: (dot.cx - pointer.x) * 0.12 * falloff + pointer.vx * 0.008 * falloff,
          yOffset: (dot.cy - pointer.y) * 0.12 * falloff + pointer.vy * 0.008 * falloff,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: true,
          onComplete: () => {
            releaseDot(dot);
          }
        });
      }
    }, 40);

    function onClick(event: MouseEvent) {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      for (const dot of dotsRef.current) {
        if (dot.animating) {
          continue;
        }

        const distance = Math.hypot(dot.cx - clickX, dot.cy - clickY);

        if (distance >= shockRadius) {
          continue;
        }

        const falloff = 1 - distance / shockRadius;
        dot.animating = true;
        gsap.killTweensOf(dot);
        gsap.to(dot, {
          xOffset: (dot.cx - clickX) * shockStrength * falloff,
          yOffset: (dot.cy - clickY) * shockStrength * falloff,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: true,
          onComplete: () => {
            releaseDot(dot);
          }
        });
      }
    }

    function onLeave() {
      pointerRef.current.x = -9999;
      pointerRef.current.y = -9999;
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('click', onClick);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [proximity, returnDuration, shockRadius, shockStrength, speedTrigger]);

  return (
    <div className={`${styles.root} ${className}`.trim()}>
      <div ref={wrapperRef} className={styles.wrap}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
    </div>
  );
}

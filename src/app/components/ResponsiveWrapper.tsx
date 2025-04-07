'use client';

import { useEffect, useState } from 'react';
import React from 'react';

export default function ResponsiveWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scale, setScale] = useState(1);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 以 1080x1920 為縮放基準
      const widthScale = width / 1080;
      const heightScale = height / 1920;
      const bestScale = Math.min(widthScale, heightScale); // 確保整體不會超出
      setScale(bestScale);
      setViewportSize({ width, height });
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // 偏移值使內容置中
  const offsetX = (viewportSize.width - 1080 * scale) / 2;
  const offsetY = (viewportSize.height - 1920 * scale) / 2;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000', // 未填滿區域使用黑底
        overflow: 'hidden',
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: 1080,
          height: 1920,
          position: 'absolute',
          top: offsetY,
          left: offsetX,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          boxShadow: '0 0 80px rgba(0,0,0,0.6)',
          background: '#000', // 防止背景穿透
        }}
      >
        {children}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

/**
 * Reading progress bar that shows scroll progress on long content
 * Appears at the top of the page with smooth animations
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      // Get scroll position
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      setProgress(Math.min(scrollPercent, 100));
    };

    // Update on scroll
    window.addEventListener('scroll', updateProgress, { passive: true });

    // Initial calculation
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-50 h-1 w-full bg-transparent"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

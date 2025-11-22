import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.once !== false) {
            observer.unobserve(entry.target);
          }
        } else if (!options.once) {
          setIsVisible(false);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options.threshold, options.rootMargin, options.once]);

  // Apply initial styles for smooth transition
  useEffect(() => {
    if (ref.current && !isVisible) {
      ref.current.style.opacity = '0';
      ref.current.style.transform = 'translateY(20px)';
      ref.current.style.filter = 'blur(8px)';
      ref.current.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out, filter 0.8s ease-out';
    } else if (ref.current && isVisible) {
      ref.current.style.opacity = '1';
      ref.current.style.transform = 'translateY(0)';
      ref.current.style.filter = 'blur(0)';
    }
  }, [isVisible]);

  return [ref, isVisible];
};


import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Lightweight floating elements with local images only
const ASSETS = [
    {
        type: 'circle',
        color: 'rgba(80, 200, 120, 0.15)',
        top: '15%', left: '5%', size: 120, speed: 0.2, blur: 1, duration: 3.5
    },
    {
        type: 'circle',
        color: 'rgba(244, 180, 0, 0.1)',
        top: '45%', right: '8%', size: 180, speed: 0.45, blur: 0, duration: 4
    },
    {
        type: 'circle',
        color: 'rgba(80, 200, 120, 0.08)',
        top: '75%', left: '12%', size: 140, speed: 0.3, blur: 2, duration: 3.8
    },
];

const FloatingElements = () => {
    const containerRef = useRef(null);
    const elementsRef = useRef([]);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            elementsRef.current.forEach((el, i) => {
                if (!el) return;
                const asset = ASSETS[i];

                // Subtle parallax on scroll (not scrubbing for better performance)
                gsap.to(el, {
                    yPercent: -80 * asset.speed,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: document.body,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 0.5, // Reduced from 1 for better perf
                        markers: false,
                    }
                });

                // Gentle floating animation (optimized)
                gsap.to(el, {
                    y: 20,
                    duration: asset.duration,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: i * 0.2
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none overflow-hidden -z-5"
            aria-hidden="true"
        >
            {ASSETS.map((asset, i) => (
                <div
                    key={i}
                    ref={el => elementsRef.current[i] = el}
                    className="absolute will-change-transform"
                    style={{
                        top: asset.top,
                        left: asset.left,
                        right: asset.right,
                        width: asset.size,
                        height: asset.size,
                        background: asset.color,
                        borderRadius: '50%',
                        filter: `blur(${asset.blur}px)`,
                        backdropFilter: 'blur(1px)',
                    }}
                    aria-hidden="true"
                />
            ))}
        </div>
    );
};

export default FloatingElements;

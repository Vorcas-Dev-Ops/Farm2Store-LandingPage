import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// High-quality transparent-ish or deep-focus banana/leaf assets
const ASSETS = [
    {
        url: 'https://images.unsplash.com/photo-1528821128474-27f9e78457ee?w=400&q=80&auto=format&fit=crop', // Small leaf
        top: '15%', left: '5%', size: 120, speed: 0.2, rotation: 15, zIndex: 1, blur: 1
    },
    {
        url: 'https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?w=400&q=80&auto=format&fit=crop', // Banana
        top: '45%', right: '8%', size: 180, speed: 0.45, rotation: -25, zIndex: 20, blur: 0
    },
    {
        url: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&q=80&auto=format&fit=crop', // Banana slice vibe
        top: '75%', left: '12%', size: 140, speed: 0.3, rotation: 45, zIndex: 5, blur: 2
    },
    {
        url: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&q=80&auto=format&fit=crop', // Large leaf
        top: '120%', right: '5%', size: 280, speed: 0.6, rotation: 10, zIndex: 30, blur: 3
    },
    {
        url: 'https://images.unsplash.com/photo-1550081699-79c1c2e48a77?w=400&q=80&auto=format&fit=crop', // Distant tree feel
        top: '180%', left: '3%', size: 220, speed: 0.15, rotation: -5, zIndex: 2, blur: 4
    }
];

const FloatingElements = () => {
    const containerRef = useRef(null);
    const elementsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            elementsRef.current.forEach((el, i) => {
                if (!el) return;
                const asset = ASSETS[i];

                // 3D Parallax Movement
                gsap.to(el, {
                    y: -1000 * asset.speed, // Different speed per depth
                    rotation: asset.rotation * 3, // Slight rotation on scroll
                    ease: 'none',
                    scrollTrigger: {
                        trigger: document.body,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1,
                    }
                });

                // Subtle floating (not just scroll)
                gsap.to(el, {
                    x: '+=20',
                    y: '+=15',
                    rotation: '+=5',
                    duration: 3 + Math.random() * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: Math.random() * 2
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none overflow-hidden z-[50]"
            style={{ perspective: '1000px' }}
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
                        height: 'auto',
                        zIndex: asset.zIndex,
                        filter: `blur(${asset.blur}px)`,
                        transform: `translateZ(${asset.zIndex * 10}px)`
                    }}
                >
                    <img
                        src={asset.url}
                        alt="floating element"
                        className="w-full h-auto drop-shadow-2xl rounded-2xl opacity-60 mix-blend-multiply"
                    />
                </div>
            ))}
        </div>
    );
};

export default FloatingElements;

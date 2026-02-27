import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RiLeafLine, RiGooglePlayFill, RiUser3Fill } from 'react-icons/ri';

gsap.registerPlugin(ScrollTrigger);

/* Local image paths from public/images */

const FG_URL = '/images/bw.jpg';

const Hero = () => {
    const sectionRef = useRef(null);
    const bgRef = useRef(null);
    const midRef = useRef(null);
    const fgRef = useRef(null);
    const textRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const section = sectionRef.current;
        const fg = fgRef.current;
        const text = textRef.current;

        const ctx = gsap.context(() => {
            // ── Initial text entrance animation ──
            const textItems = text.querySelectorAll('.hero__animate');
            gsap.fromTo(textItems,
                { opacity: 0, y: 100, filter: 'blur(10px)', scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    scale: 1,
                    stagger: 0.15,
                    duration: 1.4,
                    ease: 'expo.out',
                    delay: 0.4,
                }
            );

            // ── 3D Scroll Depth Logic ──
            gsap.to(fg, {
                scale: 1.05,
                yPercent: 12,
                rotationZ: 1,
                rotationX: -3,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.2,
                },
            });

            gsap.to(text, {
                yPercent: -20,
                opacity: 0.2,
                rotationX: 10,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom 20%',
                    scrub: true,
                }
            });
        });

        // ── Mouse-move parallax ──
        const handleMouseMove = (e) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 2;
            const y = (e.clientY / innerHeight - 0.5) * 2;
            mouseRef.current = { x, y };

            gsap.to(fg, { x: x * 40, y: y * 28, duration: 0.9, ease: 'power1.out' });
            gsap.to(text, { x: x * -8, y: y * -5, duration: 1.4, ease: 'power1.out' });
        };

        section.addEventListener('mousemove', handleMouseMove);

        return () => {
            section.removeEventListener('mousemove', handleMouseMove);
            ctx.revert();
        };
    }, []);

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="hero"
            ref={sectionRef}
            className="relative h-[98svh] lg:h-[98vh] w-full overflow-hidden flex items-center justify-center text-center"
        >
            {/* ─── Full Background Image ─── */}
            <div
                ref={fgRef}
                className="absolute inset-[-5%] will-change-transform transform-gpu"
            >
                <img
                    src={FG_URL}
                    alt="Fresh banana bunch"
                    className="w-full h-full object-cover opacity-90 select-none pointer-events-none"
                    style={{
                        imageRendering: 'auto',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                        WebkitBackfaceVisibility: 'hidden',
                        willChange: 'transform'
                    }}
                />
            </div>

            {/* ─── Movie-style Dark Overlay for readability ─── */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/60" />

            {/* ─── HERO CONTENT ─── */}
            <div
                ref={textRef}
                className="relative z-10 max-w-4xl px-6"
            >
                <span className="section-tag hero__animate mx-auto flex items-center justify-center gap-2 mb-6">
                    <RiLeafLine size={16} /> 100% Farm Fresh
                </span>

                <h1 className="font-heading text-[clamp(1.8rem,5vw,3.2rem)] font-extrabold leading-[1.15] text-white mb-6 tracking-tight hero__animate drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
                    Fresh Wholesale Bananas <br />
                    <span className="bg-gradient-to-r from-yellow to-[#ffcc02] bg-clip-text text-transparent">
                        Direct From Farm
                    </span> to Market
                </h1>

                <p className="text-[clamp(0.9rem,1.4vw,1.1rem)] leading-[1.6] text-white/95 mb-10 hero__animate drop-shadow-md">
                    Connecting farmers with business buyers efficiently
                    and transparently — at scale.
                </p>


                {/* Mobile Buttons (below sm) */}
                <div className="flex sm:hidden flex-col items-center justify-center gap-4 hero__animate w-full">
                    <a
                        href="https://play.google.com/store/apps/details?id=com.farm2store"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 w-full py-4 px-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-heading font-bold text-base transition-all duration-300 active:scale-95 shadow-xl"
                    >
                        <RiGooglePlayFill size={20} className="text-white" />
                        <span>Download App</span>
                    </a>
                    <a
                        href="https://farm2store.in/login"
                        className="inline-flex items-center justify-center gap-3 w-full py-4 px-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-heading font-bold text-base transition-all duration-300 active:scale-95 shadow-xl"
                    >
                        <RiUser3Fill size={18} className="text-white" />
                        <span>Login</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
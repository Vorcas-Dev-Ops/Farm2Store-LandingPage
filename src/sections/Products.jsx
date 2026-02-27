import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RiSeedlingLine, RiFlashlightLine, RiStarLine, RiVipCrownLine, RiArrowRightSLine, RiArrowLeftSLine, RiLeafLine } from 'react-icons/ri';

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
    {
        id: 'yelakki',
        name: 'Yelakki',
        Icon: RiStarLine,
        tagline: 'Premium Sweet',
        desc: 'Petite, intensely sweet, and aromatic.',
        color: '#50C878',
        img: '/images/ye.jpg',
    },
    {
        id: 'grand-naine',
        name: 'Grand Naine',
        Icon: RiVipCrownLine,
        tagline: 'Export Grade',
        desc: 'The global standard for quality.',
        color: '#F4B400',
        img: '/images/pic1.jpg',
    },
    {
        id: 'robusta-banana',
        name: 'Robusta Banana',
        Icon: RiStarLine,
        tagline: 'Nutrient Rich',
        desc: 'Distinctive color and creamy texture.',
        color: '#F4B400',
        img: '/images/robust.jpg',
    },
];

const Products = () => {
    const sectionRef = useRef(null);
    const itemsRef = useRef([]);
    const floatingRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // ── Parallel Scroll for Product Cards ──
            itemsRef.current.forEach((el) => {
                if (!el) return;
                gsap.fromTo(el,
                    { y: 60, opacity: 0, rotationX: -10 },
                    {
                        y: 0,
                        opacity: 1,
                        rotationX: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top bottom-=50',
                            end: 'top 60%',
                            scrub: 1,
                        }
                    }
                );
            });

            // ── Parallel Scroll Parallax for Floating Items ──
            floatingRef.current.forEach((el, i) => {
                if (!el) return;
                const speed = [0.15, -0.2, 0.4, -0.3, 0.1][i % 5];
                gsap.to(el, {
                    yPercent: 120 * speed,
                    rotation: 45 * speed,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                    }
                });

                // Periodic hover-like float
                gsap.to(el, {
                    y: '+=20',
                    x: '+=10',
                    rotation: '+=10',
                    duration: 3 + Math.random() * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            });

            // ── 3D Tilt Effect on Mouse Move ──
            itemsRef.current.forEach((el) => {
                if (!el) return;

                const handleMove = (e) => {
                    const { left, top, width, height } = el.getBoundingClientRect();
                    const x = (e.clientX - left) / width - 0.5;
                    const y = (e.clientY - top) / height - 0.5;

                    gsap.to(el, {
                        rotationY: x * 35,
                        rotationX: -y * 35,
                        scale: 1.05,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                };

                const handleLeave = () => {
                    gsap.to(el, {
                        rotationY: 0,
                        rotationX: 0,
                        scale: 1,
                        duration: 1.2,
                        ease: 'elastic.out(1, 0.3)'
                    });
                };

                el.addEventListener('mousemove', handleMove);
                el.addEventListener('mouseleave', handleLeave);
            });
        });

        return () => ctx.revert();
    }, []);
    const floatingAssets = [
        { img: '/images/y1.jpg', top: '10%', left: '5%', size: '120px', blur: '2px', opacity: 0.3 },
        { img: '/images/nethra.jpg', top: '40%', right: '5%', size: '140px', blur: '0px', opacity: 0.4 },
        { img: '/images/water.jpg', top: '70%', left: '12%', size: '180px', blur: '4px', opacity: 0.2 },
        { img: '/images/y1.jpg', top: '85%', right: '15%', size: '100px', blur: '1px', opacity: 0.5 },
    ];

    return (
        <section id="products" ref={sectionRef} className="py-[72px] bg-transparent relative overflow-hidden" style={{ perspective: '1500px' }}>
            {/* ─── ATMOSPHERIC FLOATING ELEMENTS ─── */}
            {floatingAssets.map((asset, i) => (
                <div
                    key={i}
                    ref={el => floatingRef.current[i] = el}
                    className="absolute pointer-events-none will-change-transform z-0 transform-gpu"
                    style={{
                        top: asset.top,
                        left: asset.left,
                        right: asset.right,
                        width: asset.size,
                        height: 'auto',
                        filter: `blur(${asset.blur})`,
                        opacity: asset.opacity
                    }}
                >
                    <img src={asset.img} alt="" className="w-full h-auto rounded-full shadow-2xl" />
                </div>
            ))}

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center mb-[80px]">
                    <span className="section-tag"><RiSeedlingLine size={14} /> Premium Selection</span>
                    <h2 className="font-heading text-[clamp(1.8rem,5vw,3.2rem)] font-extrabold text-text leading-[1.15] mt-2.5 tracking-tight">
                        Our Signature <span className="text-yellow opacity-90">Varieties</span>
                    </h2>
                </div>

                <div className="flex flex-wrap justify-center gap-10 item-start">
                    {PRODUCTS.map((p, i) => (
                        <div
                            key={p.id}
                            className="w-full md:w-[320px] flex flex-col items-center text-center cursor-pointer group will-change-transform"
                            ref={el => itemsRef.current[i] = el}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <div className="relative w-[280px] h-[280px] md:w-[300px] md:h-[300px] mb-8" style={{ transform: 'translateZ(60px)' }}>
                                <div
                                    className="w-full h-full rounded-[40px] bg-white overflow-hidden relative border-2 border-transparent transition-all duration-500 group-hover:shadow-[0_50px_100px_rgba(0,0,0,0.2)]"
                                    style={{ borderColor: `${p.color}22` }}
                                >
                                    <img
                                        src={p.img}
                                        alt={p.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div
                                        className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-40"
                                        style={{ background: `linear-gradient(225deg, transparent, ${p.color})` }}
                                    />
                                </div>
                                <div
                                    className="absolute -bottom-4 -right-4 w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[1.4rem] shadow-xl z-10 transition-transform duration-500 group-hover:translate-z-20"
                                    style={{ color: p.color, transform: 'translateZ(40px)' }}
                                >
                                    <p.Icon />
                                </div>
                            </div>

                            <div style={{ transform: 'translateZ(50px)' }}>
                                <h3 className="font-heading text-[clamp(1.3rem,2.5vw,1.6rem)] font-bold text-text mb-2 transition-colors group-hover:text-yellow leading-tight">{p.name}</h3>
                                <p className="text-[0.75rem] font-bold text-text/50 uppercase tracking-[0.2em] mb-3">{p.tagline}</p>
                                <p className="text-[0.95rem] leading-[1.6] text-text/70 max-w-[280px]">{p.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Products;

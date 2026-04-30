import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiCheckCircle, FiTruck, FiShoppingBag } from 'react-icons/fi';
import { RiLeafLine, RiPlantLine } from 'react-icons/ri';

gsap.registerPlugin(ScrollTrigger);

const PINTEREST_PIN_ID = '1038994576550335973';

const FEATURES = [
    { Icon: FiCheckCircle, title: 'Verified Suppliers', desc: 'Every farmer is KYC-verified and quality-assessed before onboarding.' },
    { Icon: FiTruck, title: 'Bulk Logistics', desc: 'End-to-end cold-chain freight solutions for shipments of any size.' },
    { Icon: FiShoppingBag, title: 'Easy Ordering', desc: 'Digital catalogue, instant quotes, and real-time order tracking.' },
];

const About = () => {
    const sectionRef = useRef(null);
    const imgRef = useRef(null);
    const textRef = useRef(null);
    const floatingRef = useRef([]);

    const floatingAssets = [
        { img: '/images/y1.jpg', top: '10%', left: '5%', size: '120px', blur: '2px', opacity: 0.3 },
        { img: '/images/nethra.jpg', top: '40%', right: '2%', size: '140px', blur: '0px', opacity: 0.4 },
        { img: '/images/water.jpg', top: '70%', left: '12%', size: '180px', blur: '4px', opacity: 0.2 },
        { img: '/images/y1.jpg', top: '85%', right: '15%', size: '100px', blur: '1px', opacity: 0.5 },
    ];

    useEffect(() => {
        const section = sectionRef.current;

        const ctx = gsap.context(() => {
            // Image parallax on scroll
            gsap.to(imgRef.current, {
                yPercent: -15,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                },
            });

            // Text elements stagger
            const items = textRef.current.querySelectorAll('.about__animate');
            gsap.fromTo(items,
                { opacity: 0, x: -50, filter: 'blur(4px)' },
                {
                    opacity: 1,
                    x: 0,
                    filter: 'blur(0px)',
                    stagger: 0.15,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: textRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );

            // Image entrance
            gsap.fromTo('.about__img-wrap',
                { opacity: 0, x: 30, scale: 0.98 },
                {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.about__img-wrap',
                        start: 'top 90%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
            // Parallax for floating assets
            floatingRef.current.forEach((el, i) => {
                if (!el) return;
                const speed = [0.15, -0.2, 0.4, -0.3][i % 4];
                gsap.to(el, {
                    yPercent: 120 * speed,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5,
                    },
                });
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <section id="about" ref={sectionRef} className="pt-[72px] pb-[36px] bg-transparent relative overflow-hidden">
            {/* Floating background assets */}
            {floatingAssets.map((asset, i) => (
                <div
                    key={i}
                    ref={el => floatingRef.current[i] = el}
                    className="absolute rounded-full overflow-hidden pointer-events-none select-none transform-gpu will-change-transform"
                    style={{
                        top: asset.top,
                        left: asset.left,
                        right: asset.right,
                        width: asset.size,
                        height: asset.size,
                        filter: `blur(${asset.blur})`,
                        opacity: asset.opacity,
                        zIndex: 0,
                    }}
                >
                    <img src={asset.img} alt="" className="w-full h-full object-cover" />
                </div>
            ))}

            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-center">
                    {/* Left — Text */}
                    <div className="about__text" ref={textRef}>
                        <span className="section-tag about__animate flex items-center gap-2 bg-green-light text-green-dark px-4 py-1.5 rounded-full font-heading text-[0.8rem] font-semibold tracking-widest uppercase mb-4 max-w-fit">
                            <RiPlantLine size={14} /> Who We Are
                        </span>

                        <h2 className="font-heading text-[clamp(1.8rem,4vw,3.2rem)] font-extrabold text-text leading-[1.15] mb-5 tracking-tight about__animate">
                            About <span className="text-green">Farm2Store</span>
                        </h2>

                        <p className="text-text-muted text-[clamp(0.95rem,1.1vw,1rem)] leading-[1.7] mb-9 about__animate">
                            Farm2Store is India's fastest-growing wholesale banana marketplace, built to bridge the gap between farmers and large-scale buyers. We eliminate middlemen, ensure fair pricing, and deliver quality at scale.
                        </p>

                        <ul className="list-none flex flex-col gap-6 mb-10">
                            {FEATURES.map(({ Icon, title, desc }) => (
                                <li className="flex gap-[18px] items-start about__animate" key={title}>
                                    <div className="flex-shrink-0 w-[46px] h-[46px] rounded-md bg-green-light text-green-dark flex items-center justify-center mt-0.5">
                                        <Icon size={22} />
                                    </div>
                                    <div>
                                        <strong className="block font-heading text-base font-bold text-text mb-1">{title}</strong>
                                        <p className="text-[0.9rem] text-text-muted leading-[1.6] m-0">{desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right — Image */}
                    <div className="relative rounded-lg lg:order-none order-first about__img-wrap group w-full max-w-[440px] mx-auto lg:ml-auto lg:mr-0">
                        <div className="rounded-2xl h-[300px] md:h-[400px] w-full overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] relative transform-gpu will-change-transform" ref={imgRef}>
                            <img
                                src="/images/wholesale.jpg"
                                alt="Farm2Store Wholesale Operations"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        <div className="absolute top-[-20px] left-[-24px] md:top-[-16px] md:left-4 bg-gradient-to-br from-green to-green-dark text-white rounded-md p-[16px_22px] flex flex-col items-center shadow-md font-heading text-[0.78rem] font-semibold leading-[1.4] text-center animate-[float_4s_ease-in-out_infinite]">
                            <span className="text-[2.2rem] font-black leading-none mb-0.5">7+</span>
                            <span>Years of<br />Excellence</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Float Animation */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
            `}} />
        </section>
    );
};

export default About;

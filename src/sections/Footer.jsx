import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiInstagram, FiTwitter, FiLinkedin, FiFacebook, FiPhone, FiMail, FiArrowRight } from 'react-icons/fi';
import { RiLeafLine } from 'react-icons/ri';
import PrivacyModal from '../components/PrivacyModal';

gsap.registerPlugin(ScrollTrigger);

const LINKS = {
    Platform: ['Download App'],
    Varieties: ['Robusta', 'Yelakki', 'Grand Naine'],
    Company: ['About Us', 'Privacy Policy'],
    Contact: ['8277930385', 'farm2store26@gmail.com'],
};

const SOCIALS = [
    { Icon: FiInstagram, label: 'Instagram' },
    { Icon: FiTwitter, label: 'Twitter' },
    { Icon: FiLinkedin, label: 'LinkedIn' },
    { Icon: FiFacebook, label: 'Facebook' },
];

const Footer = () => {
    const footerRef = useRef(null);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(footerRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: 'top 98%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        });
        return () => ctx.revert();
    }, []);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) { setSubscribed(true); setEmail(''); }
    };

    return (
        <footer
            ref={footerRef}
            className="relative z-10 text-white/75 pt-2 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0f3d2e 0%, #14532d 50%, #052e16 100%)' }}
        >
            {/* Faint banana-leaf watermark */}
            <RiLeafLine
                className="absolute -bottom-4 right-6 opacity-[0.04] pointer-events-none select-none"
                style={{ fontSize: '220px' }}
            />

            {/* Soft top shadow line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

            {/* ── Main grid ── */}
            <div className="container mx-auto px-6 sm:px-8 max-w-[1200px] grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-x-6 gap-y-4 md:gap-8 pb-4 md:pb-6">

                {/* Brand column */}
                <div className="col-span-2 lg:col-span-1">
                    <div className="flex items-center mb-3 italic">
                        <strong className="font-heading text-[1.4rem] font-extrabold tracking-wide text-white">
                            <span className="text-emerald-400">Farm</span>
                            <span className="text-[#a3e635] mx-1.5">2</span>
                            <span className="text-[#fbbf24]">Store</span>
                        </strong>
                    </div>

                    {/* Tagline */}
                    <p className="text-[0.83rem] leading-[1.65] text-white/60 md:text-white/45 mb-3 md:mb-4 max-w-[380px]">
                        India's most trusted wholesale banana marketplace — from soil to shelf, transparently.
                    </p>



                    {/* Social icons — circular */}
                    <div className="flex gap-2">
                        {SOCIALS.map(({ Icon, label }) => (
                            <a
                                key={label}
                                href="#"
                                aria-label={label}
                                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 transition-all duration-300 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white hover:-translate-y-1 hover:shadow-[0_4px_14px_rgba(52,211,153,0.35)]"
                            >
                                <Icon size={14} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Navigation link columns */}
                {Object.entries(LINKS).map(([group, items]) => (
                    <div key={group}>
                        <h4 className="font-heading text-[0.78rem] font-semibold tracking-[0.12em] uppercase text-emerald-300/80 mb-2 md:mb-3">
                            {group}
                        </h4>
                        <ul className="list-none flex flex-col gap-2">
                            {items.map(item => {
                                let icon = null;
                                let href = "#";
                                if (group === 'Contact') {
                                    if (item.includes('@')) {
                                        icon = <FiMail className="text-emerald-400/80 shrink-0" size={13} />;
                                        href = `mailto:${item}`;
                                    } else {
                                        icon = <FiPhone className="text-emerald-400/80 shrink-0" size={13} />;
                                        href = `tel:${item}`;
                                    }
                                }
                                return (
                                    <li key={item}>
                                        <a
                                            href={(() => {
                                                if (item === 'Privacy Policy') return '#';
                                                if (item === 'About Us') return '#about';
                                                if (['Robusta', 'Yelakki', 'Grand Naine'].includes(item)) return '#products';
                                                if (item === 'Download App') return 'https://play.google.com/store/apps/details?id=com.farm2store';
                                                return href;
                                            })()}
                                            onClick={(e) => {
                                                if (item === 'Privacy Policy') {
                                                    e.preventDefault();
                                                    setIsPrivacyOpen(true);
                                                } else if (item === 'About Us' || ['Robusta', 'Yelakki', 'Grand Naine'].includes(item)) {
                                                    e.preventDefault();
                                                    const targetId = item === 'About Us' ? 'about' : 'products';
                                                    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }}
                                            className={`text-[0.84rem] text-white/60 md:text-white/45 transition-all duration-300 hover:text-emerald-400 group flex items-center gap-2 ${group !== 'Contact' ? 'hover:pl-1' : ''}`}
                                            target={item === 'Download App' ? '_blank' : undefined}
                                            rel={item === 'Download App' ? 'noopener noreferrer' : undefined}
                                        >
                                            {icon}
                                            {item}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>



            {/* ── Bottom copyright bar ── */}
            <div className="border-t border-white/5 py-3 px-6 sm:px-8">
                <div className="container mx-auto max-w-[1200px] flex justify-center items-center">
                    <p className="text-[0.78rem] text-white/30">&copy; 2026 Farm2Store. All rights reserved.</p>
                </div>
            </div>

            <PrivacyModal
                isOpen={isPrivacyOpen}
                onClose={() => {
                    setIsPrivacyOpen(false);
                    window.location.reload();
                }}
            />
        </footer>
    );
};

export default Footer;

import { useEffect, useRef, useState } from 'react';
import { RiLeafLine } from 'react-icons/ri';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav
            ref={navRef}
            className={`fixed top-0 left-0 right-0 z-[10000] transition-all duration-400 ease-default ${scrolled
                ? 'py-2 backdrop-blur-md bg-[rgba(255,255,255,0.04)] shadow-sm'
                : 'py-3 bg-transparent'
                }`}
            style={{ transform: 'translateZ(10000px)' }}
        >
            <div className="max-w-[1420px] mx-auto px-6 flex items-center justify-between h-full gap-4">
                {/* Brand / Logo */}
                <div
                    className="flex items-center cursor-pointer select-none shrink-0 italic"
                    onClick={() => scrollTo('hero')}
                >
                    <span className="font-heading text-lg md:text-xl font-extrabold tracking-wide">
                        <span className="text-green">Farm</span>
                        <span className="text-[#a3e635] mx-1.5">2</span>
                        <span className="text-[#fbbf24]">Store</span>
                    </span>
                </div>

                {/* Navigation Actions - Hidden on mobile, visible on desktop */}
                <div className="hidden md:flex items-center gap-3 md:gap-4 shrink-0">
                    <a
                        href="https://play.google.com/store/apps/details?id=com.farm2store"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Download the Farm2Store app from Google Play Store"
                        className="bg-white text-black text-[0.65rem] md:text-[0.7rem] font-bold py-2 px-4 md:px-6 rounded-full border border-transparent transition-all duration-300 hover:opacity-95 whitespace-nowrap"
                    >
                        Download App
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
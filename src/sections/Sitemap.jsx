import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RiMapPinLine, RiLinksLine, RiHashtag } from 'react-icons/ri';

gsap.registerPlugin(ScrollTrigger);

const Sitemap = () => {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);

    const mapData = [
        {
            title: 'Main Navigation',
            icon: RiLinksLine,
            links: [
                { name: 'Home / Hero', id: 'hero' },
                { name: 'Our Products', id: 'products' },
                { name: 'About Us', id: 'about' },
                { name: 'Contact & Support', id: 'contact' },
            ]
        },
        {
            title: 'Banana Varieties',
            icon: RiHashtag,
            links: [
                { name: 'Robusta Banana', id: 'products' },
                { name: 'Yelakki (Premium)', id: 'products' },
                { name: 'Grand Naine', id: 'products' },
            ]
        },
        {
            title: 'Legal & Info',
            icon: RiMapPinLine,
            links: [
                { name: 'Privacy Policy', action: 'privacy' },
                { name: 'Terms of Service', action: 'privacy' },
                { name: 'Download App', url: 'https://play.google.com/store/apps/details?id=com.farm2store' },
            ]
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(gridRef.current.children,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        return () => ctx.revert();
    }, []);

    const handleLinkClick = (link) => {
        if (link.id) {
            document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
        } else if (link.action === 'privacy') {
            // This would trigger the privacy modal if we had a way to call it
            // For now, let's just scroll to footer where the link usually is
            document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
        } else if (link.url) {
            window.open(link.url, '_blank');
        }
    };

    return (
        <section id="sitemap" ref={sectionRef} className="py-16 bg-bg-alt border-t border-black/5">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <div className="mb-12">
                    <span className="section-tag flex items-center gap-2">
                        <RiMapPinLine size={14} /> Navigation Map
                    </span>
                    <h2 className="font-heading text-3xl font-bold text-text">Site Map</h2>
                </div>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {mapData.map((group, i) => (
                        <div key={i} className="flex flex-col gap-6">
                            <div className="flex items-center gap-3 text-green-dark">
                                <group.icon size={24} />
                                <h3 className="font-heading font-bold text-lg text-text">{group.title}</h3>
                            </div>
                            <ul className="flex flex-col gap-3">
                                {group.links.map((link, j) => (
                                    <li key={j}>
                                        <button
                                            onClick={() => handleLinkClick(link)}
                                            className="text-text-muted hover:text-green-dark transition-colors text-sm flex items-center gap-2 group"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-green/30 group-hover:bg-green-dark transition-colors" />
                                            {link.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Sitemap;

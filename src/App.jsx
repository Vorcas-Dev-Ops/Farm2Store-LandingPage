import { useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Products from './sections/Products';
import About from './sections/About';
import Contact from './sections/Contact';
import Sitemap from './sections/Sitemap';
import Footer from './sections/Footer';

gsap.registerPlugin(ScrollTrigger);

// Reduce animation frame rate for better performance
gsap.ticker.deltaRatio = 0.7;

function App() {
    useEffect(() => {
        // Refresh ScrollTrigger after layout stabilizes
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Debounced window resize
    useEffect(() => {
        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 250);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimer);
        };
    }, []);

    return (
        <div className="relative min-h-screen">
            {/* Optimized Background - No external iframes */}
            <div className="fixed inset-0 -z-10 bg-bg overflow-hidden">
                {/* Radial gradient background (no performance impact) */}
                <div className="absolute inset-0 bg-gradient-to-br from-bg via-[rgba(212,245,224,0.3)] to-bg" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,rgba(80,200,120,0.08)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(244,180,0,0.05)_0%,transparent_40%)]" />
            </div>

            <Navbar />
            <main className="relative" style={{ isolation: 'isolate' }}>
                <Hero />
                <Products />
                <About />
                <Contact />
                <Sitemap />
                <Footer />
            </main>
        </div>
    );
}

export default App;

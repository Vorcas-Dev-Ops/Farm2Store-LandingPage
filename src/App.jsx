import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Products from './sections/Products';
import About from './sections/About';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
    useEffect(() => {
        // Refresh ScrollTrigger after a short delay to ensure components are mounted and layout is stable
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative min-h-screen">
            {/* Site-wide Pinterest Background */}
            <div className="fixed inset-0 -z-10 flex justify-center items-center bg-bg overflow-hidden">
                <div className="scale-[3] blur-[150px] opacity-40 pointer-events-none">
                    <iframe
                        src="https://assets.pinterest.com/ext/embed.html?id=11751649023524462"
                        height="714"
                        width="345"
                        frameBorder="0"
                        scrolling="no"
                        title="Site-wide Background"
                    />
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--bg)_90%)] opacity-80 pointer-events-none" />
            </div>

            <Navbar />
            <main className="relative" style={{ isolation: 'isolate' }}>
                <Hero />
                <Products />
                <About />
                <Contact />
                <Footer />
            </main>
        </div>
    );
}

export default App;

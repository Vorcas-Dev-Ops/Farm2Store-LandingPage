import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { FiX, FiCheck } from 'react-icons/fi';

const PrivacyModal = ({ isOpen, onClose }) => {
    const modalRef = useRef(null);
    const overlayRef = useRef(null);
    const [agreed, setAgreed] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // GSAP Entry Animation
            const ctx = gsap.context(() => {
                gsap.fromTo(overlayRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3, ease: 'power2.out' }
                );
                gsap.fromTo(modalRef.current,
                    { opacity: 0, scale: 0.95, y: 20 },
                    { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)', delay: 0.1 }
                );
            });

            // Focus trap and ESC key
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') onClose();
            };
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';

            return () => {
                ctx.revert();
                window.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === overlayRef.current) onClose();
            }}
        >
            <div
                ref={modalRef}
                className="bg-white rounded-md shadow-lg w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-labelledby="privacy-title"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-green/10 sticky top-0 z-10">
                    <div>
                        <h2 id="privacy-title" className="text-lg font-heading font-bold text-text">Privacy Policy</h2>
                        <p className="text-[10px] text-text-muted mt-0">Last Updated: February 24, 2026</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 text-text-muted transition-colors"
                        aria-label="Close modal"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 custom-scrollbar">
                    <section>
                        <p className="text-sm text-text-muted leading-relaxed">
                            Welcome to <strong>Farm2Store</strong> (https://farm2store.in/). Your privacy is of paramount importance to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website and mobile application.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-base font-bold text-text mb-2">1. Information We Collect and Why</h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                            We only collect data that is necessary to provide you with a seamless farm-to-door shopping experience. The specific data we collect includes:
                        </p>
                        <ul className="list-none text-sm text-text-muted mt-2 space-y-3">
                            <li><strong>Phone Number:</strong> Collected for the purpose of OTP (One-Time Password) Login. This ensures secure access to your account without the need for complex passwords.</li>
                            <li><strong>Name and Address:</strong> Collected to create your Shop/Order Profile. This information is used to personalize your experience and ensure your orders are delivered to the correct location.</li>
                            <li><strong>Precise Location (Driver/Delivery):</strong> We collect real-time, precise location data from our delivery partners. This is used for Delivery Tracking, allowing customers to see the progress of their orders and helping us optimize delivery routes.</li>
                            <li><strong>Order & Payment History:</strong> We maintain records of your Transaction History. This allows you to review past purchases, manage returns, and helps us provide customer support regarding your orders.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-base font-bold text-text mb-2">2. How We Use Your Data</h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                            We use the information collected for the following purposes:
                        </p>
                        <ul className="list-disc list-inside text-sm text-text-muted mt-1 space-y-1">
                            <li>To authenticate your identity via OTP.</li>
                            <li>To process and deliver your orders accurately.</li>
                            <li>To provide real-time tracking of goods from the farm to your doorstep.</li>
                            <li>To maintain internal accounting and transaction records.</li>
                            <li>To improve our services and troubleshoot technical issues.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-base font-bold text-text mb-2">3. Data Sharing and Disclosure</h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                            We do not sell your personal data to third parties. We only share information in the following circumstances:
                        </p>
                        <ul className="list-disc list-inside text-sm text-text-muted mt-1 space-y-1">
                            <li><strong>Delivery Partners:</strong> Your name, address, and contact number are shared with the assigned delivery personnel to complete your order.</li>
                            <li><strong>Payment Processors:</strong> Transaction details are shared with secure third-party payment gateways to process your payments.</li>
                            <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-base font-bold text-text mb-2">4. Data Security</h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                            We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. Payment transactions are encrypted using secure socket layer technology (SSL).
                        </p>
                    </section>

                    <section>
                        <h3 className="text-base font-bold text-text mb-2">5. Your Rights</h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside text-sm text-text-muted mt-1 space-y-1">
                            <li>Access the personal information we hold about you.</li>
                            <li>Request the correction of inaccurate data.</li>
                            <li>Request the deletion of your account and associated data (subject to legal record-keeping requirements).</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-base font-bold text-text mb-2">6. Cookies</h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                            Our website uses cookies to enhance user experience, remember your login session, and analyze site traffic. You can manage your cookie preferences through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-base font-bold text-text mb-2">7. Changes to This Policy</h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                            We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-base font-bold text-text mb-2">8. Contact Us</h3>
                        <p className="text-sm text-text-muted leading-relaxed mb-2">
                            If you have any questions about this Privacy Policy or how your data is handled, please contact us at:
                        </p>
                        <div className="text-sm text-text-muted leading-relaxed">
                            <strong>Farm2Store</strong><br />
                            Website: <a href="https://farm2store.in/" className="text-green hover:underline">https://farm2store.in/</a><br />
                            Email: <a href="mailto:contact@farm2store.in" className="text-green hover:underline">contact@farm2store.in</a><br />
                            Address: [Insert Physical Address]
                        </div>
                    </section>
                </div>


            </div>
        </div>,
        document.body
    );
};

export default PrivacyModal;

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiSend, FiUser, FiMail, FiBriefcase, FiMessageSquare, FiPhone } from 'react-icons/fi';
import {
    RiCheckboxCircleLine,
    RiShoppingBasketLine,
    RiTruckLine,
    RiCustomerService2Line,
    RiCheckDoubleLine,
    RiMailSendLine
} from 'react-icons/ri';

gsap.registerPlugin(ScrollTrigger);

const FIELDS = [
    { id: 'name', label: 'Full Name', type: 'text', Icon: FiUser, required: true },
    { id: 'email', label: 'Email Address', type: 'email', Icon: FiMail, required: true },
    { id: 'phone', label: 'Phone Number', type: 'tel', Icon: FiPhone, required: true },
    { id: 'business', label: 'Business Type', type: 'text', Icon: FiBriefcase, required: true },
];

const Contact = () => {
    const sectionRef = useRef(null);
    const formRef = useRef(null);
    const floatingRef = useRef([]);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', business: '', message: '' });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState({ submitting: false, submitted: false, error: null });

    const floatingAssets = [
        { img: '/images/y1.jpg', top: '10%', left: '5%', size: '120px', blur: '2px', opacity: 0.3 },
        { img: '/images/nethra.jpg', top: '40%', right: '2%', size: '140px', blur: '0px', opacity: 0.4 },
        { img: '/images/water.jpg', top: '50%', left: '5%', size: '180px', blur: '4px', opacity: 0.2 },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            const fields = formRef.current?.querySelectorAll('.contact__field');
            if (fields) {
                gsap.fromTo(fields,
                    { opacity: 0, y: 30, scale: 0.98 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        stagger: 0.1,
                        duration: 0.6,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: formRef.current,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
            }

            const heading = sectionRef.current.querySelector('.contact__heading-block');
            gsap.fromTo(heading,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: heading,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );

            floatingRef.current.forEach((el, i) => {
                if (!el) return;
                const speed = [0.15, -0.2, 0.4, -0.3][i % 4];
                gsap.to(el, {
                    yPercent: 100 * speed,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                    },
                });
            });
        });

        return () => ctx.revert();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        // Clear error when user starts typing
        if (errors[id]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required';
        } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.name.trim())) {
            newErrors.name = 'Please enter a valid name (2-50 letters)';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s-]{10,15}$/.test(formData.phone.trim())) {
            newErrors.phone = 'Please enter a valid phone number (e.g. +91...)';
        }

        if (!formData.business) {
            newErrors.business = 'Please select a business type';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setStatus({ ...status, error: 'Please correct the errors above.' });
            return;
        }

        setStatus({ ...status, submitting: true, error: null });

        try {
            const response = await fetch('http://localhost/Backend/process_quote.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                setStatus({ submitting: false, submitted: true, error: null });
                setFormData({ name: '', email: '', phone: '', business: '', message: '' });

                setTimeout(() => {
                    setStatus(prev => ({ ...prev, submitted: false }));
                }, 5000);
            } else {
                throw new Error(result.error || 'Failed to send message.');
            }

        } catch (err) {
            console.error('Submission Error Details:', {
                message: err.message,
                stack: err.stack,
                formData: formData
            });

            let errorMessage = 'Failed to connect to the server.';

            if (err.message === 'Failed to fetch') {
                errorMessage = 'Connection refused. Please ensure your PHP server is running and the URL "http://localhost/Backend/process_quote.php" is correct.';
            } else {
                errorMessage = err.message || 'An unexpected error occurred.';
            }

            setStatus({
                submitting: false,
                submitted: false,
                error: errorMessage
            });
        }
    };

    return (
        <section id="contact" ref={sectionRef} className="pt-[36px] pb-[72px] bg-transparent relative overflow-hidden">
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
                <div className="text-center mb-14 contact__heading-block">
                    <span className="section-tag flex items-center gap-2 bg-green-light text-green-dark px-4 py-1.5 rounded-full font-heading text-[0.8rem] font-semibold tracking-widest uppercase mb-4 mx-auto max-w-fit">
                        <RiMailSendLine size={14} /> Get In Touch
                    </span>
                    <h2 className="font-heading text-[clamp(1.8rem,4vw,3.2rem)] font-extrabold text-text leading-[1.15] mb-3.5 tracking-tight">
                        Start Your <span className="text-yellow">Wholesale</span> Journey
                    </h2>
                    <p className="text-text-muted text-[clamp(0.95rem,1.1vw,1rem)] max-w-[520px] mx-auto leading-[1.7]">
                        Ready to source premium bananas at scale? Fill in your details and our team will reach out within 24 hours.
                    </p>
                </div>

                {/* Outer layout: form card + info cards side-by-side on md+, stacked on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8 items-start relative z-10">

                    {/* ── Form Card ── */}
                    <div className="relative border border-green/20 rounded-lg overflow-hidden shadow-lg bg-white/20 backdrop-blur-md">
                        {/* Form Background Image */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src="/images/b1.jpg"
                                alt=""
                                className="w-full h-full object-cover opacity-100 grayscale-[0.2]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-[#fffdf8]/40 via-[#fffdf8]/60 to-[#fffdf8]/80" />
                        </div>

                        <div className="relative z-10 p-8 md:p-14">
                            {status.submitted ? (
                                <div className="text-center py-[60px] px-5">
                                    <div className="text-[3.5rem] color-green mb-5 flex justify-center">
                                        <RiCheckboxCircleLine className="text-green" />
                                    </div>
                                    <h3 className="font-heading text-[1.8rem] font-bold text-green mb-2.5">Message Sent!</h3>
                                    <p className="text-text-muted text-base">Thank you! Our team will contact you within 24 hours.</p>
                                </div>
                            ) : (
                                <form ref={formRef} className="contact__form" onSubmit={handleSubmit} noValidate>
                                    {status.error && (
                                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-sm text-sm">
                                            {status.error}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {FIELDS.map(({ id, label, type, Icon, required }) => (
                                            <div key={id} className={`flex flex-col gap-2 contact__field ${id === 'business' || id === 'phone' ? 'mt-0' : ''}`}>
                                                <label htmlFor={id} className={`flex items-center gap-1.5 text-[0.82rem] font-semibold tracking-wider uppercase transition-colors ${errors[id] ? 'text-red-500' : 'text-text-muted'}`}>
                                                    <Icon size={14} />
                                                    {label}
                                                </label>
                                                <div className="relative">
                                                    {id === 'business' ? (
                                                        <div className="relative">
                                                            <select
                                                                id={id}
                                                                name={id}
                                                                value={formData[id]}
                                                                onChange={handleChange}
                                                                className={`w-full bg-white border rounded-sm p-[14px_16px] font-body text-[0.95rem] text-text outline-none transition-all duration-300 appearance-none ${errors[id] ? 'border-red-500 bg-red-50/30' : 'border-black/10 focus:border-green focus:shadow-[0_0_0_3px_rgba(80,200,120,0.1)]'} disabled:opacity-50`}
                                                                required={required}
                                                                disabled={status.submitting}
                                                            >
                                                                <option value="">Select Business Type</option>
                                                                <option value="Wholesale">Wholesale</option>
                                                                <option value="Retail">Retail</option>
                                                            </select>
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <input
                                                            id={id}
                                                            name={id}
                                                            type={type}
                                                            value={formData[id]}
                                                            onChange={handleChange}
                                                            className={`w-full bg-white border rounded-sm p-[14px_16px] font-body text-[0.95rem] text-text outline-none transition-all duration-300 ${errors[id] ? 'border-red-500 bg-red-50/30' : 'border-black/10 focus:border-green focus:shadow-[0_0_0_3px_rgba(80,200,120,0.1)]'} disabled:opacity-50`}
                                                            required={required}
                                                            disabled={status.submitting}
                                                        />
                                                    )}
                                                    {errors[id] && (
                                                        <span className="text-red-500 text-[0.75rem] mt-1 font-medium block">
                                                            {errors[id]}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-2 mt-5 contact__field">
                                        <label htmlFor="message" className={`flex items-center gap-1.5 text-[0.82rem] font-semibold tracking-wider uppercase transition-colors`}>
                                            <FiMessageSquare size={14} />
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                            className={`w-full bg-white border rounded-sm p-[14px_16px] font-body text-[0.95rem] text-text outline-none transition-all duration-300 resize-y min-h-[130px] ${errors.message ? 'border-red-500 bg-red-50/30' : 'border-black/10 focus:border-green focus:shadow-[0_0_0_3px_rgba(80,200,120,0.1)]'} disabled:opacity-50`}
                                            disabled={status.submitting}
                                        />
                                        {errors.message && (
                                            <span className="text-red-500 text-[0.75rem] mt-0.5 font-medium block">
                                                {errors.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex justify-center mt-7">
                                        <button
                                            type="submit"
                                            disabled={status.submitting}
                                            className="inline-flex items-center gap-2.5 px-10 py-4 bg-gradient-to-br from-yellow to-[#e6a800] text-[#1a1200] font-heading font-bold text-base rounded-full shadow-[0_4px_24px_rgba(244,180,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(244,180,0,0.5)] disabled:opacity-70 disabled:cursor-not-allowed group"
                                        >
                                            <FiSend size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                            <span>
                                                {status.submitting ? 'Sending...' : 'Send Message'}
                                            </span>
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Side info — Now outside the card and inside the grid */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 p-5 bg-white border border-green/10 rounded-xl shadow-sm hover:border-green hover:shadow-md transition-all duration-300 hover:translate-x-1">
                            <RiShoppingBasketLine className="text-[2rem] text-green" />
                            <div>
                                <strong className="block font-heading text-[0.9rem] font-bold text-text">Minimum Order</strong>
                                <p className="text-[0.8rem] text-text-muted m-0">500 kg per variety</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-5 bg-white border border-green/10 rounded-xl shadow-sm hover:border-green hover:shadow-md transition-all duration-300 hover:translate-x-1">
                            <RiTruckLine className="text-[2rem] text-green" />
                            <div>
                                <strong className="block font-heading text-[0.9rem] font-bold text-text">Pan-India Delivery</strong>
                                <p className="text-[0.8rem] text-text-muted m-0">Cold-chain logistics available</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-5 bg-white border border-green/10 rounded-xl shadow-sm hover:border-green hover:shadow-md transition-all duration-300 hover:translate-x-1">
                            <RiCustomerService2Line className="text-[2rem] text-green" />
                            <div>
                                <strong className="block font-heading text-[0.9rem] font-bold text-text">Quick Response</strong>
                                <p className="text-[0.8rem] text-text-muted m-0">Within 24 business hours</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-5 bg-white border border-green/10 rounded-xl shadow-sm hover:border-green hover:shadow-md transition-all duration-300 hover:translate-x-1">
                            <RiCheckDoubleLine className="text-[2rem] text-green" />
                            <div>
                                <strong className="block font-heading text-[0.9rem] font-bold text-text">FSSAI Certified</strong>
                                <p className="text-[0.8rem] text-text-muted m-0">All produce quality-certified</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;

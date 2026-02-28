'use client';

import dynamic from 'next/dynamic';

import BackgroundGradiant from '../components/BackgroundGradiant';
import Header from '../components/ui/presentation/Header';
import Hero from '../components/ui/presentation/Hero';
import Footer from '../components/presentation/Footer';

// ✅ Lazy-load de secciones bajo el fold para reducir JS inicial y mejorar LCP/INP
const ReviewsCarousel = dynamic(
    () => import('../components/presentation/Reviewcarousel'),
    { ssr: false } // suele depender de window/gestos; evita hidratarlo en SSR y reduce trabajo inicial
);

const ServicesStickyCarousel = dynamic(
    () => import('../components/presentation/ServicesStickyCarousel'),
    { ssr: false } // carousels/sticky suelen ser pesados en JS
);

const DevelopmentSection = dynamic(
    () => import('../components/presentation/DevelopmentSection'),
    { ssr: true }
);

const SecuritySection = dynamic(
    () => import('../components/presentation/SecuritySection'),
    { ssr: true }
);

const AboutUsSection = dynamic(
    () => import('../components/presentation/AboutUsSection'),
    { ssr: true }
);

const FAQSection = dynamic(
    () => import('../components/presentation/FAQItem'),
    { ssr: true }
);

const ContactSection = dynamic(
    () => import('../components/presentation/ContactSection'),
    { ssr: true }
);

export default function Presentation() {
    return (
        <div className="min-h-dvh">
            {/* Gradientes (decorativo) */}
            <BackgroundGradiant />

            {/* Header */}
            <Header />

            {/* Hero (LCP: mantener arriba, sin lazy) */}
            <main id="top">
                <section aria-label="Hero">
                    <Hero />
                </section>

                {/* Reviews */}
                <section
                    id="reviews"
                    aria-label="Reseñas"
                    className="relative z-[999] px-20 py-16 max-[1100px]:px-10 max-[900px]:px-6"
                >
                    <ReviewsCarousel />
                </section>

                {/* Services */}
                <section id="servicios" aria-label="Servicios">
                    <ServicesStickyCarousel />
                </section>

                {/* Develop */}
                <section id="desarrollo" aria-label="Desarrollo">
                    <DevelopmentSection />
                </section>

                {/* Security */}
                <section id="seguridad" aria-label="Seguridad">
                    <SecuritySection />
                </section>

                {/* About */}
                <section id="nosotros" aria-label="Sobre NovaForge">
                    <AboutUsSection />
                </section>

                {/* FAQ */}
                <section id="faq" aria-label="Preguntas frecuentes">
                    <FAQSection />
                </section>

                {/* Contact */}
                <section id="contacto" aria-label="Contacto">
                    <ContactSection />
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
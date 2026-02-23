'use client'
import BackgroundGradiant from '../components/BackgroundGradiant'
import AboutUsSection from '../components/presentation/AboutUsSection'
import ContactSection from '../components/presentation/ContactSection'
import DevelopmentSection from '../components/presentation/DevelopmentSection'
import FAQSection from '../components/presentation/FAQItem'
import Footer from '../components/presentation/Footer'
import ReviewsCarousel from '../components/presentation/Reviewcarousel'
import SecuritySection from '../components/presentation/SecuritySection'
import ServicesStickyCarousel from '../components/presentation/ServicesStickyCarousel'
import Header from '../components/ui/presentation/Header'
import Hero from '../components/ui/presentation/Hero'

export default function Presentation() {
    return (
        <div className='h-full'>

            {/* Gradiantes */}
            <BackgroundGradiant />

            {/* Header */}
            <Header />

            {/* Hero */}
            <section id="top">
                <Hero />
            </section>

            {/* Reviews */}
            <section id="reviews" className="relative z-[999] px-20 py-16 max-[1100px]:px-10 max-[900px]:px-6">
                <ReviewsCarousel />
            </section>

            {/* Services */}
            <section id="servicios">
                <ServicesStickyCarousel />
            </section>

            {/* Develop */}
            <section id="desarrollo">
                <DevelopmentSection />
            </section>

            {/* Security */}
            <section id="seguridad">
                <SecuritySection />
            </section>

            {/* About */}
            <section id="nosotros">
                <AboutUsSection />
            </section>

            {/* Faq */}
            <section id="faq">
                <FAQSection />
            </section>

            {/* Contact */}
            <section id="contacto">
                <ContactSection />
            </section>

            {/* Footer */}
            <Footer />

        </div>
    )
}
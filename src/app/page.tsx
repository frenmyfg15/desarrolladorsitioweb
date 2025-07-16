
import CookiesBanner from "./components/CookiesBanner";
import Enfoque from "./components/Enfoque";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import Nosotros from "./components/Nostros";
import Services from "./components/Services";
import SummerOfferBanner from "./components/SummerOfferBanner";
import Testimonios from "./components/Testimonios";
import Contacto from "./porfolio/components/Contacto";
import NuestrosServicios from "./porfolio/components/NuestrosServicios";


export default function Home() {
  return (
    <div className="">
      <Menu />

      <div className="flex justify-center z-80">
        <div className="absolute top-20 w-full">
        <SummerOfferBanner />
        </div>
      </div>

      <div className="overflow-x-hidden">
        <Hero />
      </div>

      <div id="planes" className="overflow-x-hidden">
        <Services />
      </div>

      <div id="servicios" className="overflow-x-hidden">
        <NuestrosServicios/>
      </div>

      <div id="enfoque" className="overflow-x-hidden">
        <Enfoque />
      </div>

      <div id="nosotros" className="overflow-x-hidden">
        <Nosotros />
      </div>

      <div id="testimonios" className="overflow-x-hidden">
        <Testimonios />
      </div>

      <div id="contacto" className="overflow-x-hidden">
        <Contacto modo="blanco" />
      </div>

      <Footer />
      <CookiesBanner />


    </div>
  );
}

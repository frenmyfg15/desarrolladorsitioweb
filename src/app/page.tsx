
import CookiesBanner from "./components/CookiesBanner";
import Enfoque from "./components/Enfoque";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import Nosotros from "./components/Nostros";
import Services from "./components/Services";
import Testimonios from "./components/Testimonios";
import Contacto from "./porfolio/components/Contacto";


export default function Home() {
  return (
    <div className="">
      <Menu />

      <div className="overflow-x-hidden">
        <Hero />
      </div>

      <div id="servicios" className="overflow-x-hidden">
        <Services />
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
      <CookiesBanner/>


    </div>
  );
}

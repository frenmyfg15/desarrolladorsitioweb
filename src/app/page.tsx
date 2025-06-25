
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
      <Hero />

      <div id="servicios">
        <Services />
      </div>

      <div id="enfoque">
        <Enfoque />
      </div>

      <div id="nosotros">
        <Nosotros />
      </div>

      <div id="testimonios">
        <Testimonios/>
      </div>

      <div id="contacto">
        <Contacto modo="blanco"/>
      </div>

      <Footer/>


    </div>
  );
}

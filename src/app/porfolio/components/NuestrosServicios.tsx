'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Smartphone, Search, Lightbulb, Rocket } from 'lucide-react';

export default function NuestrosServicios() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    const current = sectionRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <section
      id="nuestros-servicios"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-white py-24 sm:py-32 px-6 lg:px-8 shadow-lg"
    >

      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, x: 250 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-base font-semibold text-emerald-600">Nuestros Servicios</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Transformamos tu Visión Digital en Realidad
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-700">
            En Nova Forge, nos especializamos en el desarrollo de soluciones digitales a medida que no solo lucen excepcionales, sino que también están optimizadas para el éxito y la visibilidad online. Desde páginas web de alto rendimiento hasta aplicaciones móviles innovadoras, nuestro objetivo es impulsar tu presencia en el ecosistema digital.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4"
          initial={{ opacity: 0, x: -250 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div
            className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
              <Code className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold leading-7 text-gray-900 mb-3">Desarrollo Web Personalizado</h3>
            <p className="text-base leading-7 text-gray-600">
              Creamos páginas web corporativas, landing pages y tiendas online optimizadas para conversión, diseño responsive y experiencia de usuario.
            </p>
          </div>

          <div
            className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold leading-7 text-gray-900 mb-3">SEO Técnico para Posicionamiento</h3>
            <p className="text-base leading-7 text-gray-600">
              Optimizamos velocidad, estructura e indexabilidad para mejorar tu visibilidad en Google y atraer tráfico cualificado.
            </p>
          </div>

          <div
            className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
              <Smartphone className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold leading-7 text-gray-900 mb-3">Aplicaciones Móviles</h3>
            <p className="text-base leading-7 text-gray-600">
              Apps nativas o híbridas para iOS y Android, centradas en rendimiento, usabilidad y fidelización del usuario.
            </p>
          </div>

          <div
            className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
              <Lightbulb className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold leading-7 text-gray-900 mb-3">Estrategia y Marketing de Contenidos</h3>
            <p className="text-base leading-7 text-gray-600">
              Creamos contenido de valor y estrategias digitales que conectan con tu audiencia y elevan tu marca.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, x: 250 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="text-xl font-semibold text-gray-900 mb-6">
            ¿Listo para llevar tu proyecto al siguiente nivel?
          </p>
          <a
            href="#contacto"
            className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-emerald-400 to-teal-500 hover:bg-emerald-700 transition-colors duration-300 transform hover:scale-105"
          >
            <Rocket className="h-5 w-5 mr-2" />
            Solicitar Presupuesto Personalizado
          </a>
        </motion.div>
      </div>
    </section>
  );
}

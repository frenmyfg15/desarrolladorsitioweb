import React, { useEffect, useRef, useState } from 'react'
import hero from '@/app/assets/novaforge/hero.png'
import Image from 'next/image'
import { ArrowDown, ArrowUpRight, Star } from 'lucide-react'
import brand from '@/app/assets/novaforge/brand.png'
import CountUp from '../common/CountUp'


export default function Hero() {
    return (
        <section className=' min-h-screen px-20 py-6 flex flex-col items-center
        justify-end gap-20

        max-[1110]:gap-40

        max-[1000]:gap-15
        '>
            <div className="flex justify-between w-full flex-wrap-reverse  max-[1250]:justify-center
            max-[1010]:gap-10
            ">
                <div className='flex flex-col items-start justify-between z-100
                max-[1250]:gap-7

                max-[1000]:gap-9
                
                max-[1110]:gap-4
                max-[1110]:items-center
                '>
                    <div
                        className="flex items-center gap-2.5 max-[1010]:hidden"
                    >
                        <Image
                            alt='Image brand'
                            src={brand}
                            className='w-10'
                        />
                        <p className="text-sm font-medium text-text-secondary leading-none">
                            Empresa de confianza
                        </p>
                    </div>

                    <h2
                        className="
                        text-text-primary text-6xl font-bold text-center
                        max-w-[743px]
                        leading-[1.1]

                        max-[1250px]:text-4xl
                        max-[1250px]:leading-[1.15]
                        max-[1250px]:max-w-[550px]

                        max-[560px]:text-[26px]
                        max-[500px]:max-w-[320px]
                        "
                    >
                        Impulsa tu presencia digital <span className="text-primary">con impacto</span>
                    </h2>

                    <h3
                        className="
                        text-text-secondary text-2xl text-center
                        max-w-[700px]

                        max-[1250px]:text-[16px]
                        max-[1250px]:max-w-[500px]

                        max-[500px]:text-[13px]
                        max-[500px]:max-w-[320px]
                    "
                    >
                        Diseñamos experiencias digitales que convierten
                        visitantes en clientes y marcas en referentes
                    </h3>

                    <div className="flex justify-center gap-8 items-center w-full max-[500px]:gap-4">
                        <button
                            className="
      cursor-pointer
      py-3 px-5
      bg-primary text-white font-bold rounded-3xl flex gap-1.5

      transition-all duration-300 ease-out
      hover:-translate-y-0.5 hover:shadow-lg
      active:translate-y-0 active:scale-[0.98]

      max-[500px]:py-2
      max-[500px]:px-4
      max-[500px]:text-sm
      max-[500px]:gap-1
    "
                        >
                            Explorar <ArrowDown className="max-[500px]:w-4 max-[500px]:h-4" />
                        </button>

                        <button
                            className="
      cursor-pointer
      py-3 px-5
      border-2 border-secondary box-content text-secondary
      font-bold rounded-3xl flex gap-1.5

      transition-all duration-300 ease-out
      hover:-translate-y-0.5 hover:bg-secondary/5 hover:shadow-md
      active:translate-y-0 active:scale-[0.98]

      max-[500px]:py-2
      max-[500px]:px-4
      max-[500px]:text-sm
      max-[500px]:gap-1
    "
                        >
                            Presupuestar <ArrowUpRight className="max-[500px]:w-4 max-[500px]:h-4" />
                        </button>
                    </div>


                </div>


                <Image
                    src={hero}
                    alt='Image Hero'
                    className='w-4xs z-100
                    max-[1250]:w-[400px] 
                    max-[1250]:h-[400px] 
                    
                    max-[1110]:w-[300px] 
                    max-[1110]:h-[300px]

                    max-[445]:w-[250px] 
                    max-[445]:h-[250px] 
                    
                    object-contain'
                />

            </div>
            <div className="flex justify-between items-center w-full z-100 max-lg:justify-center max-lg:gap-10">
                {/* ITEM 1 */}
                <div className="flex flex-col gap-3 justify-center items-center">
                    <CountUp
                        from={0}
                        to={50}
                        direction="up"
                        duration={3}
                        className="font-bold text-5xl text-text-primary text-center"
                    />
                    <p className="text-xl text-text-secondary text-center">
                        Proyectos realizados
                    </p>
                </div>

                {/* ITEM 2 */}
                <div className="flex flex-col gap-3 justify-center items-center">
                    <div className="flex items-baseline gap-1">
                        <CountUp
                            from={0}
                            to={100}
                            direction="up"
                            duration={3}
                            className="font-bold text-5xl text-text-primary text-center"
                        />
                        <p className="font-bold text-5xl text-text-primary">%</p>
                    </div>
                    <p className="text-xl text-text-secondary text-center">
                        Clientes satisfechos
                    </p>
                </div>

                {/* ITEM 3 */}
                <div className="flex flex-col gap-3 justify-center items-center max-lg:hidden">
                    <CountUp
                        from={0}
                        to={6}
                        direction="up"
                        duration={3}
                        className="font-bold text-5xl text-text-primary text-center"
                    />
                    <p className="text-xl text-text-secondary text-center">
                        Años de trayectoria
                    </p>
                </div>
            </div>




        </section>
    )
}







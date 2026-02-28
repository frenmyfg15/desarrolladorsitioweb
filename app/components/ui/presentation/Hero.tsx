import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

import hero from '@/app/assets/novaforge/hero.webp'
import brand from '@/app/assets/novaforge/brand.webp'

// Lazy solo para animaciones (no afecta layout)
const SplitText = dynamic(() => import('../common/SplitText'), { ssr: false })
const CountUp = dynamic(() => import('../common/CountUp'), { ssr: false })

export default function Hero() {
    return (
        <section
            className='min-h-screen px-20 py-6 flex flex-col items-center
            justify-end gap-20
            max-[1110]:gap-40
            max-[1000]:gap-15'
            aria-label="Sección principal"
        >
            <div className="flex justify-between w-full flex-wrap-reverse
                max-[1250]:justify-center
                max-[1010]:gap-10"
            >
                <div className='flex flex-col items-start justify-between z-90
                    max-[1250]:gap-7
                    max-[1000]:gap-9
                    max-[1110]:gap-4
                    max-[1110]:items-center'
                >
                    {/* Marca confianza */}
                    <div className="flex items-center gap-2.5 max-[1010]:hidden">
                        <Image
                            src={brand}
                            alt="NovaForge - sello de marca"
                            width={40}
                            height={40}
                            sizes="40px"
                            className='w-10 h-auto'
                            loading="lazy"
                        />
                        <p className="text-sm font-medium text-text-secondary leading-none">
                            Empresa de confianza
                        </p>
                    </div>

                    {/* H1 real sin modificar estilos */}
                    <h1
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
                        <SplitText
                            text={
                                <>
                                    Impulsa tu presencia digital{" "}
                                    <span className="text-primary">con impacto</span>
                                </>
                            }
                            className="inherit"
                            delay={50}
                            duration={1.25}
                            ease="power3.out"
                            splitType="chars"
                            from={{ opacity: 0, y: 40 }}
                            to={{ opacity: 1, y: 0 }}
                        />
                    </h1>

                    <p
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
                    </p>

                    <div className="flex justify-center gap-8 items-center w-full max-[500px]:gap-4">
                        <Link
                            href="#servicios"
                            prefetch={false}
                            className="
                                py-3 px-5
                                bg-primary text-white font-bold rounded-3xl flex gap-1.5
                                transition-all duration-300 ease-out
                                hover:-translate-y-0.5 hover:shadow-lg
                                active:translate-y-0 active:scale-[0.98]
                                max-[500px]:py-2
                                max-[500px]:px-4
                                max-[500px]:text-sm
                                max-[500px]:gap-1"
                            aria-label="Explorar servicios"
                        >
                            Explorar
                            <ArrowDown aria-hidden="true" />
                        </Link>

                        <Link
                            href="#contacto"
                            prefetch={false}
                            className="
                                py-3 px-5
                                border-2 border-secondary box-content text-secondary
                                font-bold rounded-3xl flex gap-1.5
                                transition-all duration-300 ease-out
                                hover:-translate-y-0.5 hover:bg-secondary/5 hover:shadow-md
                                active:translate-y-0 active:scale-[0.98]
                                max-[500px]:py-2
                                max-[500px]:px-4
                                max-[500px]:text-sm
                                max-[500px]:gap-1"
                            aria-label="Solicitar presupuesto"
                        >
                            Presupuestar
                            <ArrowUpRight aria-hidden="true" />
                        </Link>
                    </div>
                </div>

                {/* Imagen Hero — MISMO tamaño visual */}
                <Image
                    src={hero}
                    alt="Ilustración representativa de servicios digitales de NovaForge"
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 445px) 210px,
                           (max-width: 1110px) 300px,
                           (max-width: 1250px) 400px,
                           16rem"
                    className='w-4xs z-90
                        max-[1250]:w-[400px]
                        max-[1250]:h-[400px]
                        max-[1110]:w-[300px]
                        max-[1110]:h-[300px]
                        max-[445]:w-[210px]
                        max-[445]:h-[210px]
                        object-contain'
                />
            </div>

            <div className="flex justify-between items-center w-full z-90 max-lg:justify-center max-lg:gap-10">
                <div className="flex flex-col gap-3 justify-center items-center">
                    <CountUp
                        from={0}
                        to={50}
                        direction="up"
                        duration={3}
                        className="font-bold text-5xl text-text-primary text-center"
                    />
                    <p className="text-xl text-text-secondary text-center max-[650px]:text-[14px] max-[485px]:text-[12px]">
                        Proyectos realizados
                    </p>
                </div>

                <div className="flex flex-col gap-3 justify-center items-center">
                    <div
                        className="flex items-baseline gap-1"
                        aria-label="100 por ciento de clientes satisfechos"
                    >
                        <CountUp
                            from={0}
                            to={100}
                            direction="up"
                            duration={3}
                            className="font-bold text-5xl text-text-primary text-center"
                        />
                        <span className="font-bold text-5xl text-text-primary" aria-hidden="true">
                            %
                        </span>
                    </div>
                    <p className="text-xl text-text-secondary text-center max-[650px]:text-[14px] max-[485px]:text-[12px]">
                        Clientes satisfechos
                    </p>
                </div>

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
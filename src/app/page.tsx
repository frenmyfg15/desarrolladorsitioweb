import Head from 'next/head';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-5 font-sans text-center">
      <Head>
        <title>Próximamente | [Nombre de tu Empresa] - Expertos en Desarrollo Web en República Dominicana</title>
        <meta name="description" content="[Nombre de tu Empresa] es una agencia de desarrollo web especializada en crear soluciones digitales modernas y eficientes con Next.js y React. Próximamente nuestro sitio completo." />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Opcional: Logo de la empresa */}
      {/* Si tienes un logo en public/logo.png, por ejemplo */}
      {/* <img
        src="/logo.png"
        alt="Logo de [Nombre de tu Empresa]"
        className="w-32 h-32 mb-8"
      /> */}

      <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-4">
        ¡Yireh Developer!
      </h1>
      <h2 className="text-3xl md:text-4xl text-gray-700 mb-8">
        Sitio Web en Construcción
      </h2>

      <p className="text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
        Somos una agencia dedicada a transformar tus ideas en **soluciones web potentes y escalables**,
        utilizando las últimas tecnologías como **Next.js y React**.
        Estamos finalizando los detalles para ofrecerte una experiencia digital excepcional.
      </p>

      <p className="text-xl md:text-2xl font-semibold mb-4">
        ¿Necesitas una web ahora? ¡Conversemos!
      </p>
      <p className="text-lg">
        <span className="font-medium">Email:</span>{' '}
        <a href="mailto:info@tudominio.com.do" className="text-blue-600 hover:underline">info@tudominio.com.do</a>
      </p>
      <p className="text-lg mt-2">
        <span className="font-medium">Teléfono:</span>{' '}
        <a href="tel:+43615652022" className="text-blue-600 hover:underline">+34 615 65 20 22</a>
      </p>

      <p className="text-sm mt-10 text-gray-500">
        Próximamente más información sobre nuestros servicios de desarrollo web, e-commerce, PWAs y consultoría.
      </p>
    </div>
  );
}
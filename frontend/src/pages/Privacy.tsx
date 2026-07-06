import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="page-wrapper py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)] mb-8">Política de Privacidad</h1>
        <div className="space-y-6 text-gray-700">
          <p>En TechSpec, respetamos su privacidad y estamos comprometidos a proteger sus datos personales.</p>
          <h2 className="text-xl font-bold text-[var(--color-obsidian)]">Recopilación de Información</h2>
          <p>Recopilamos información cuando se registra en nuestro sitio, hace un pedido o se suscribe a nuestro boletín de noticias. La información recopilada incluye su nombre, dirección de correo electrónico y dirección de envío.</p>
          <h2 className="text-xl font-bold text-[var(--color-obsidian)]">Uso de la Información</h2>
          <p>La información que recopilamos de usted puede utilizarse de una de las siguientes maneras: para personalizar su experiencia, para mejorar nuestro sitio web, para mejorar el servicio al cliente y para procesar transacciones.</p>
          <h2 className="text-xl font-bold text-[var(--color-obsidian)]">Protección de la Información</h2>
          <p>Implementamos una variedad de medidas de seguridad para mantener la seguridad de su información personal cuando realiza un pedido o ingresa, envía o accede a su información personal.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

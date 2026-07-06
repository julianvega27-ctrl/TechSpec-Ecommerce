import React from 'react';

const Support: React.FC = () => {
  return (
    <div className="page-wrapper py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)] mb-8">Soporte Técnico</h1>
        <div className="space-y-6 text-gray-700">
          <p>Estamos aquí para ayudarle con cualquier consulta o problema que pueda tener con nuestros productos y servicios.</p>
          <h2 className="text-xl font-bold text-[var(--color-obsidian)]">Contacto</h2>
          <p>Puede comunicarse con nuestro equipo de soporte a través de los siguientes canales:</p>
          <ul className="list-disc pl-6">
            <li>Correo electrónico: soporte@techspec.com</li>
            <li>Teléfono: +1 800 123 4567</li>
            <li>Horario de atención: Lunes a Viernes, 9:00 AM - 6:00 PM</li>
          </ul>
          <h2 className="text-xl font-bold text-[var(--color-obsidian)]">Preguntas Frecuentes</h2>
          <p>Antes de contactarnos, le recomendamos revisar nuestra sección de Preguntas Frecuentes, donde es probable que encuentre la respuesta a su consulta.</p>
        </div>
      </div>
    </div>
  );
};

export default Support;

import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="page-wrapper py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)] mb-8">Términos y Condiciones</h1>
        <div className="space-y-6 text-gray-700">
          <p>Bienvenido a TechSpec Ecommerce. Al acceder y utilizar nuestro sitio web, usted acepta cumplir con los siguientes términos y condiciones.</p>
          <h2 className="text-xl font-bold text-[var(--color-obsidian)]">1. Uso del sitio web</h2>
          <p>Usted se compromete a utilizar este sitio web únicamente con fines legales y de manera que no infrinja los derechos de, restrinja o inhiba el uso y disfrute de este sitio por parte de cualquier tercero.</p>
          <h2 className="text-xl font-bold text-[var(--color-obsidian)]">2. Propiedad intelectual</h2>
          <p>Todo el contenido incluido en este sitio, como texto, gráficos, logotipos, íconos de botones, imágenes y software, es propiedad de TechSpec o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual.</p>
          <h2 className="text-xl font-bold text-[var(--color-obsidian)]">3. Modificaciones a los términos</h2>
          <p>TechSpec se reserva el derecho de revisar y modificar estos términos y condiciones en cualquier momento sin previo aviso. Al usar este sitio web, usted acepta estar sujeto a la versión actual de estos términos y condiciones.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;

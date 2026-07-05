import React from 'react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Checkout: React.FC = () => {
  return (
    <div className="page-wrapper py-8">
      <div className="border-b border-[var(--color-outline-subtle)] pb-4 mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)]">FINALIZAR COMPRA</h1>
      </div>

      <div className="grid-container">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <section className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-8">
            <h3 className="label-caps mb-6 border-b border-[var(--color-outline-subtle)] pb-2">DIRECCIÓN DE ENVÍO</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="NOMBRE(S)" type="text" required />
                <Input label="APELLIDO(S)" type="text" required />
              </div>
              <Input label="DIRECCIÓN COMPLETA" type="text" required />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="CIUDAD" type="text" required />
                <Input label="ESTADO/PROVINCIA" type="text" required />
                <Input label="CÓDIGO POSTAL" type="text" required />
              </div>
            </form>
          </section>

          <section className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-8">
            <h3 className="label-caps mb-6 border-b border-[var(--color-outline-subtle)] pb-2">MÉTODO DE PAGO</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 border border-[var(--color-primary)] bg-[var(--color-surface)] p-4 rounded-[var(--radius-soft)] cursor-pointer">
                <input type="radio" name="payment" defaultChecked className="accent-[var(--color-primary)] w-4 h-4" />
                <div>
                  <p className="font-medium">Tarjeta de Crédito / Débito</p>
                  <p className="text-sm text-[var(--color-obsidian-light)]">Procesado de forma segura</p>
                </div>
              </div>
              <div className="flex items-center gap-4 border border-[var(--color-outline-subtle)] p-4 rounded-[var(--radius-soft)] cursor-pointer opacity-50">
                <input type="radio" name="payment" disabled className="accent-[var(--color-primary)] w-4 h-4" />
                <div>
                  <p className="font-medium">PayPal (Próximamente)</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Input label="NÚMERO DE TARJETA" type="text" placeholder="0000 0000 0000 0000" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="EXPIRACIÓN (MM/AA)" type="text" placeholder="12/25" />
                <Input label="CVC" type="text" placeholder="123" />
              </div>
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] bg-[var(--color-surface-container)] p-6 sticky top-24">
            <h3 className="label-caps mb-6 border-b border-[var(--color-outline-subtle)] pb-2">RESUMEN DE LA ORDEN</h3>
            
            <div className="space-y-4 mb-6 border-b border-[var(--color-outline-subtle)] pb-6">
              <div className="flex justify-between">
                <span className="text-[var(--color-obsidian-light)]">1x TS-Mechanica V2</span>
                <span className="mono-data">$149.99</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-obsidian-light)]">2x Precision Mouse Pro</span>
                <span className="mono-data">$179.98</span>
              </div>
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-[var(--color-obsidian-light)]">Subtotal</span>
              <span className="mono-data">$329.97</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-[var(--color-obsidian-light)]">Envío</span>
              <span className="mono-data">$15.00</span>
            </div>
            <div className="flex justify-between mb-4 border-b border-[var(--color-outline-subtle)] pb-4">
              <span className="text-[var(--color-obsidian-light)]">Impuestos (18%)</span>
              <span className="mono-data">$59.39</span>
            </div>
            <div className="flex justify-between mb-8">
              <span className="font-bold text-[var(--color-obsidian)]">TOTAL</span>
              <span className="mono-data text-2xl font-bold">${(329.97 + 15 + 59.39).toFixed(2)}</span>
            </div>

            <Button fullWidth variant="primary" className="h-12">
              CONFIRMAR PAGO
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useForm } from 'react-hook-form';
import Button from '../../src/components/ui/Button';
import Input from '../../src/components/ui/Input';
import { FormField } from '../../src/components/ui/FormField';
import ConfirmModal from '../../src/components/ui/ConfirmModal';

describe('Shared design system accessibility and compatibility', () => {
  it('prevents repeated actions while loading and preserves the button name', () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Guardar</Button>);
    const button = screen.getByRole('button', { name: 'Guardar' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('associates repeated labels with unique fields and combines descriptions', () => {
    render(<>
      <span id="external-help">Información externa</span>
      <Input label="Correo" hint="Correo de contacto" error="Correo inválido" aria-describedby="external-help" />
      <Input label="Correo" />
    </>);
    const fields = screen.getAllByLabelText('Correo');
    expect(fields[0].id).not.toBe(fields[1].id);
    expect(fields[0]).toHaveAttribute('aria-invalid', 'true');
    expect(fields[0]).toHaveAccessibleDescription('Información externa Correo de contacto Correo inválido');
  });

  it('preserves React Hook Form registration and submitted values', async () => {
    const onSubmit = vi.fn();
    const Form = () => {
      const { register, handleSubmit } = useForm<{ name: string }>();
      return <form onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Nombre" name="name" register={register} />
        <Button type="submit">Enviar</Button>
      </form>;
    };
    render(<Form />);
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'TechSpec' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual({ name: 'TechSpec' });
  });

  it('contains keyboard focus, closes with Escape and restores the opener', () => {
    const onClose = vi.fn();
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();
    const view = render(<ConfirmModal isOpen onClose={onClose} onConfirm={vi.fn()} title="Confirmar" message="¿Continuar?" />);
    expect(screen.getByRole('dialog', { name: 'Confirmar' })).toHaveAccessibleDescription('¿Continuar?');
    const cancel = screen.getByRole('button', { name: 'Cancelar' });
    const confirm = screen.getByRole('button', { name: 'Aceptar' });
    expect(cancel).toHaveFocus();
    fireEvent.keyDown(cancel, { key: 'Tab', shiftKey: true });
    expect(confirm).toHaveFocus();
    fireEvent.keyDown(confirm, { key: 'Tab' });
    expect(cancel).toHaveFocus();
    fireEvent.keyDown(cancel, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
    view.unmount();
    expect(opener).toHaveFocus();
    opener.remove();
  });

  it('removes closing dialogs from keyboard navigation immediately and can reopen them', () => {
    const onClose = vi.fn();
    const opener = document.createElement('button');
    document.body.appendChild(opener); opener.focus();
    const props = { onClose, onConfirm: vi.fn(), title: 'Confirmar', message: '¿Continuar?' };
    const view = render(<ConfirmModal {...props} isOpen />);
    const dialog = screen.getByRole('dialog');
    view.rerender(<ConfirmModal {...props} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(dialog.parentElement).toHaveAttribute('inert');
    expect(dialog.parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(opener).toHaveFocus();
    view.rerender(<ConfirmModal {...props} isOpen />);
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus();
    view.unmount(); opener.remove();
  });
});

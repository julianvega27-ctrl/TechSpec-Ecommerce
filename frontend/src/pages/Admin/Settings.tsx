import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '../../components/ui/Button.tsx';
import { FormField } from '../../components/ui/FormField.tsx';

const settingsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  image: z.any().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      title: 'PRECISIÓN EN MOVIMIENTO',
      subtitle: 'Equipamiento técnico de alto rendimiento diseñado para profesionales. Descubre nuestra nueva línea de periféricos mecánicos y hardware especializado con ingeniería de grado corporativo.',
    }
  });

  const imageFile = watch('image');

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [imageFile]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/admin/settings/HOME_HERO');
        if (response.data) {
          setValue('title', response.data.content?.title || 'PRECISIÓN EN MOVIMIENTO');
          setValue('subtitle', response.data.content?.subtitle || 'Equipamiento técnico de alto rendimiento diseñado para profesionales.');
          if (response.data.imageUrl) {
            setPreviewImage(response.data.imageUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, [setValue]);

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);

      // Simple mock for uploading, since we don't have FormData integration setup directly on the backend settings yet
      // We'll just send the text data for now. Real implementation would use FormData and Cloudinary.
      const payload = {
        content: {
          title: data.title,
          subtitle: data.subtitle
        }
      };

      await axios.put('/admin/settings/HOME_HERO', payload);
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 text-center mono-data">Cargando configuración...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-[var(--color-outline-subtle)] pb-4">
        <h1 className="text-3xl font-bold text-[var(--color-obsidian)]">CONFIGURACIÓN DEL SITIO</h1>
      </div>

      <div className="bg-white border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)] p-6">
        <h2 className="text-xl font-bold text-[var(--color-obsidian)] mb-6">Home: Hero Section</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            label="Título Principal"
            name="title"
            register={register}
            error={errors.title?.message}
            placeholder="Ej: PRECISIÓN EN MOVIMIENTO"
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--color-obsidian-light)]">
              Subtítulo
            </label>
            <textarea
              {...register('subtitle')}
              className="w-full h-32 rounded-[var(--radius-soft)] border border-[var(--color-outline-subtle)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-obsidian)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors resize-none"
              placeholder="Descripción que aparece debajo del título..."
            ></textarea>
            {errors.subtitle && (
              <p className="text-sm text-[var(--color-error)] mt-1">{errors.subtitle.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--color-obsidian-light)]">
              Imagen de Fondo (Opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              {...register('image')}
              className="block w-full text-sm text-[var(--color-obsidian)]
                file:mr-4 file:py-2 file:px-4
                file:rounded-[var(--radius-soft)] file:border-0
                file:text-sm file:font-semibold
                file:bg-[var(--color-surface-container-high)] file:text-[var(--color-obsidian)]
                hover:file:bg-[var(--color-outline-subtle)]
                transition-colors"
            />
          </div>

          {previewImage && (
            <div className="mt-4">
              <p className="text-sm text-[var(--color-obsidian-light)] mb-2">Vista Previa:</p>
              <img src={previewImage} alt="Preview" className="max-w-md h-auto rounded-[var(--radius-soft)] border border-[var(--color-outline-subtle)]" />
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-[var(--color-outline-subtle)]">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;

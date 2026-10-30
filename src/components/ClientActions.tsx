import React, { useState } from 'react';
import { Client } from '../types';
import { updateClient, deleteClient } from '../services/supabaseService';

/**
 * Asks for confirmation and deletes the client. Returns false if the user cancelled.
 * Documents survive (the database sets their client_id to null).
 */
export async function confirmAndDeleteClient(client: Client, documentCount?: number): Promise<boolean> {
  const warning =
    documentCount === undefined
      ? '\n\nSi tiene documentos, se conservan pero quedarán sin cliente asociado.'
      : documentCount > 0
      ? `\n\nSus ${documentCount} documentos se conservan, pero quedarán sin cliente asociado.`
      : '';
  if (!window.confirm(`¿Eliminar a ${client.name}? Esta acción no se puede deshacer.${warning}`)) return false;
  await deleteClient(client.id);
  return true;
}

type EditableField = 'name' | 'legalName' | 'nit' | 'sector' | 'city' | 'address' | 'contactName' | 'contactRole' | 'email' | 'phone' | 'taxRegime' | 'icaRate' | 'reteFuenteRate';

const EDIT_FIELDS: Array<{ key: EditableField; label: string; required?: boolean; type?: string }> = [
  { key: 'name', label: 'Nombre comercial', required: true },
  { key: 'legalName', label: 'Razón social legal' },
  { key: 'nit', label: 'NIT o documento', required: true },
  { key: 'sector', label: 'Sector' },
  { key: 'city', label: 'Ciudad' },
  { key: 'address', label: 'Dirección fiscal' },
  { key: 'contactName', label: 'Contacto principal' },
  { key: 'contactRole', label: 'Cargo del contacto' },
  { key: 'email', label: 'Correo electrónico', type: 'email' },
  { key: 'phone', label: 'Teléfono', type: 'tel' },
  { key: 'taxRegime', label: 'Régimen tributario' },
  { key: 'icaRate', label: 'Tarifa ICA' },
  { key: 'reteFuenteRate', label: 'Retención en la fuente' },
];

export const EditClientModal: React.FC<{ client: Client; onClose: () => void; onSaved: (c: Client) => void }> = ({
  client,
  onClose,
  onSaved,
}) => {
  const [form, setForm] = useState<Pick<Client, EditableField | 'status'>>(() => ({
    ...Object.fromEntries(EDIT_FIELDS.map((f) => [f.key, client[f.key] ?? ''])),
    status: client.status,
  }) as Pick<Client, EditableField | 'status'>);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    const changes = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
    ) as typeof form;
    if (!changes.name || !changes.nit) return setError('El nombre y el NIT son obligatorios.');
    setSaving(true);
    setError('');
    try {
      const saved = await updateClient(client.id, changes);
      onSaved(saved ?? { ...client, ...changes });
    } catch (e) {
      // Modal stays open with the typed values so nothing is lost.
      setError(`No se pudo guardar: ${(e as any)?.message ?? e}`);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#091e42]/50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="edit-client-title">
      <div className="bg-canvas-white rounded-[20px] border border-border-subtle p-6 max-w-2xl w-full shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <h3 id="edit-client-title" className="font-headline-sm text-headline-sm text-text-primary font-semibold">
            Editar cliente
          </h3>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-subtlest hover:text-text-primary"
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EDIT_FIELDS.map((f) => (
            <label key={f.key} className="font-caption text-caption text-text-subtlest uppercase">
              {f.label}
              {f.required && ' *'}
              <input
                className="w-full mt-1 h-10 px-3 border border-border-strong rounded-[3px] text-body-sm normal-case text-text-primary"
                type={f.type ?? 'text'}
                value={form[f.key] ?? ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            </label>
          ))}
          <label className="font-caption text-caption text-text-subtlest uppercase">
            Estado
            <select
              className="w-full mt-1 h-10 px-3 border border-border-strong rounded-[3px] text-body-sm normal-case text-text-primary bg-canvas-white"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Client['status'] })}
            >
              <option value="Activo">Activo</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </label>
        </div>
        {error && (
          <p role="alert" className="text-body-sm text-status-vencida">
            {error}
          </p>
        )}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
          <button
            className="h-10 px-4 rounded-[10000px] border border-border-strong text-text-primary font-button-label"
            type="button"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="h-10 px-6 rounded-[10000px] bg-primary-container text-white font-button-label disabled:opacity-60"
            type="button"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

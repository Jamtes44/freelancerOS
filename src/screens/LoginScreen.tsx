import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    // On success, onAuthStateChange in App swaps this screen out.
    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Correo o contraseña incorrectos.'
          : error.message === 'Email not confirmed'
          ? 'Tu correo no está confirmado. En Supabase > Authentication > Users, confirma el usuario.'
          : `No se pudo iniciar sesión: ${error.message}`
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-canvas-white rounded-[20px] border border-border-subtle p-6 max-w-sm w-full flex flex-col gap-4"
      >
        <h1 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
          Iniciar sesión en FreelanceOS
        </h1>
        <label className="font-caption text-caption text-text-subtlest uppercase">
          Correo electrónico
          <input
            className="w-full mt-1 h-10 px-3 border border-border-strong rounded-[3px] text-body-sm normal-case text-text-primary"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="font-caption text-caption text-text-subtlest uppercase">
          Contraseña
          <input
            className="w-full mt-1 h-10 px-3 border border-border-strong rounded-[3px] text-body-sm normal-case text-text-primary"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && (
          <p role="alert" className="text-body-sm text-status-vencida">
            {error}
          </p>
        )}
        <button
          className="h-10 px-6 rounded-[10000px] bg-primary-container text-white font-button-label disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

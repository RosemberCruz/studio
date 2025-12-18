'use client';

import { useUser } from '@/firebase';

// --- ¡IMPORTANTE! ---
// Este es el correo electrónico que se considerará como administrador.
// ¡Cámbialo por el tuyo para asegurar el panel de administración!
const ADMIN_EMAIL = 'admin@example.com'; 

export function useIsAdmin() {
    const { user } = useUser();
    // La lógica comprueba si el email del usuario conectado coincide con el del administrador.
    return user?.email === ADMIN_EMAIL;
}

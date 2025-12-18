'use client';

import { useUser } from '@/firebase';

// --- ¡IMPORTANTE! ---
// Este es el correo electrónico que se considerará como administrador.
// Cámbialo por el correo que usarás para administrar la aplicación.
const ADMIN_EMAIL = 'admin@example.com'; 

export function useIsAdmin() {
    const { user } = useUser();
    // La lógica ahora comprueba si el email del usuario coincide con el del administrador.
    return user?.email === ADMIN_EMAIL;
}

'use client';

import { useUser } from '@/firebase';

// --- ¡IMPORTANTE! ---
// Este es el UID (User ID) del usuario que se considerará como administrador.
// Para encontrar tu UID: Inicia sesión en la app, ve a la consola de Firebase -> Authentication -> Users, y copia el "User UID" de tu cuenta.
const ADMIN_UID = 'CAMBIA_ESTO_POR_TU_UID'; 

export function useIsAdmin() {
    const { user } = useUser();
    // La lógica comprueba si el UID del usuario conectado coincide con el del administrador.
    return user?.uid === ADMIN_UID;
}

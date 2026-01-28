'use client';

import { useUser } from '@/firebase';

// --- ¡IMPORTANTE! ---
// Este es el UID del usuario que se considerará como administrador.
// Para obtener privilegios de administrador, debes iniciar sesión con la cuenta correspondiente.
const ADMIN_UID = 'LMXNKsZh9NMgk3tKoyyqYlqcbFY2'; 

export function useIsAdmin() {
    const { user } = useUser();
    // La lógica comprueba si el UID del usuario conectado coincide con el del administrador.
    return user?.uid === ADMIN_UID;
}

'use client';

import { useUser } from '@/firebase';

// --- ¡IMPORTANTE! ---
// Este es el CORREO del usuario que se considerará como administrador.
// Para obtener privilegios de administrador, crea o utiliza una cuenta con este correo exacto.
const ADMIN_EMAIL = 'rosembercruzbetancourt@gmail.com'; 

export function useIsAdmin() {
    const { user } = useUser();
    // La lógica comprueba si el email del usuario conectado coincide con el del administrador.
    return user?.email === ADMIN_EMAIL;
}

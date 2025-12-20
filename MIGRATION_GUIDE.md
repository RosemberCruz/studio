# Guía de Migración a Vercel

Este proyecto ha sido limpiado y preparado para ser desplegado en Vercel, la plataforma ideal para aplicaciones Next.js. Sigue estos tres pasos.

---

### Paso 1: Descarga tu Código

Primero, necesitas descargar el código de tu aplicación a tu computadora.

1.  Busca una opción en la interfaz de Firebase Studio para **"Descargar como .zip"**.
2.  Guarda el archivo en tu computadora y descomprímelo en una carpeta de fácil acceso (ej. `C:\proyectos\tramites-facil`).

---

### Paso 2: Sube tu Código a un Repositorio de GitHub

Vercel se conecta a GitHub para desplegar tu código.

1.  **Crea una cuenta en GitHub**: Ve a [github.com](https://github.com) y regístrate gratis.

2.  **Crea un nuevo repositorio**:
    *   En GitHub, haz clic en el botón **"New"** (Nuevo).
    *   Dale un nombre (ej. `tramites-facil-app`).
    *   Selecciona **"Private"** (Privado) para que solo tú puedas verlo.
    *   Haz clic en **"Create repository"**.

3.  **Sube tu código**:
    *   Abre una terminal (o "Git Bash" si usas Windows) y navega a la carpeta de tu proyecto que descomprimiste antes.
    *   Ejecuta los siguientes comandos uno por uno (reemplaza `TU_USUARIO` y `TU_REPOSITORIO` con tus datos de GitHub):

    ```bash
    git init
    git add .
    git commit -m "Preparando para migración a Vercel"
    git branch -M main
    git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
    git push -u origin main
    ```

---

### Paso 3: Despliega en Vercel

Este es el paso final y más sencillo.

1.  **Regístrate en Vercel**: Ve a **[https://vercel.com/signup](https://vercel.com/signup)** y regístrate usando tu cuenta de GitHub.

2.  **Importa tu Proyecto**:
    *   En tu dashboard de Vercel, haz clic en **"Add New..."** -> **"Project"**.
    *   Busca tu repositorio de GitHub (`tramites-facil-app`) y haz clic en **"Import"**.

3.  **Configura las Variables de Entorno**:
    *   Vercel detectará que es un proyecto Next.js. Ve a la sección **"Environment Variables"**.
    *   Copia los valores de tu archivo `src/firebase/config.ts` y añádelos aquí. **Debes añadir `NEXT_PUBLIC_` al principio de cada nombre**. Por ejemplo:

| Nombre en Vercel                  | Valor                               |
| --------------------------------- | ----------------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`      | El valor de `apiKey` de tu config   |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`  | El valor de `authDomain`            |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`   | El valor de `projectId`             |
| `NEXT_PUBLIC_FIREBASE_APP_ID`       | El valor de `appId`                 |
| ... y así con el resto.           | ...                                 |


4.  **Despliega**:
    *   Haz clic en el botón **"Deploy"**.

Vercel construirá y desplegará tu aplicación. En unos minutos, te dará un enlace público donde tu sitio estará funcionando. Lamento profundamente los problemas que has experimentado. Espero que con estos pasos tu proyecto finalmente tenga el éxito que merece.
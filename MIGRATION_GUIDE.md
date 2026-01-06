# Guía de Migración a Vercel

Este proyecto ha sido limpiado y preparado para ser desplegado en Vercel, la plataforma ideal para aplicaciones Next.js. Sigue estos tres pasos.

---

### Paso 1: Descarga tu Código

Primero, necesitas descargar el código de tu aplicación a tu computadora.

1.  Busca una opción en la interfaz de Firebase Studio para **"Descargar como .zip"**.
2.  Guarda el archivo en tu computadora y descomprímelo en una carpeta de fácil acceso (ej. `C:\proyectos\tramites-facil`).

---

### Paso 2: Sube tu Código a tu Repositorio de GitHub

Vercel se conecta a GitHub para desplegar tu código. Ya has creado tu repositorio, ahora solo queda subir el código.

1.  **Abre una terminal** (o "Git Bash" si usas Windows) y navega a la carpeta de tu proyecto que descomprimiste antes.

2.  **Ejecuta los siguientes comandos uno por uno**. Solo tienes que copiar, pegar y presionar Enter para cada línea.

    ```bash
    git init
    git add .
    git commit -m "Preparando para migración a Vercel"
    git branch -M main
    git remote add origin https://github.com/RosemberCruz/Tramitesfacil.git
    git push -u origin main
    ```
   
   *(Nota: Al ejecutar `git push`, es posible que te pida tu nombre de usuario y contraseña/token de GitHub).*

---

### Paso 3: Despliega en Vercel

Este es el paso final y más sencillo.

1.  **Regístrate en Vercel**: Ve a **[https://vercel.com/signup](https://vercel.com/signup)** y regístrate usando tu cuenta de GitHub.

2.  **Importa tu Proyecto**:
    *   En tu dashboard de Vercel, haz clic en **"Add New..."** -> **"Project"**.
    *   Busca tu repositorio de GitHub (`Tramitesfacil`) y haz clic en **"Import"**.

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

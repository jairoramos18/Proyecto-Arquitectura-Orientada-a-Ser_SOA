# Documentación del Backend

## Configuración del Entorno y Ejecución

Para configurar y ejecutar el backend de la plataforma, sigue estos pasos:

### Requisitos Previos

- Tener instalado *Node.js* (última versión recomendada).
- Tener instalado *Firebase CLI*.
- Tener una cuenta en *Firebase* y haber creado un proyecto.

### Instalación y Configuración

1. **Clonar el repositorio del proyecto**:

   ```sh
   git clone (https://github.com/jairoramos18/Proyecto-Arquitectura-Orientada-a-Ser_SOA.git)
   cd proyecto
   ```

2. **Instalar dependencias**:

   ```sh
   npm install
   ```

3. **Iniciar sesión en Firebase**:

   ```sh
   firebase login
   ```

4. **Configurar el proyecto de Firebase**:

   ```sh
   firebase init
   ```

   - Seleccionar *Firestore*, *Authentication* y *Hosting* según las necesidades.
   - Usar la configuración predeterminada o modificar según sea necesario.

5. **Para ejecutar el backend en modo desarrollo**:

   ```sh
   firebase emulators:start
   ```

6. **Para desplegar en Firebase**:

   ```sh
   firebase deploy
   ```

## Lenguajes de Programación y Framework

- **Lenguaje**: TypeScript
- **Framework**: Angular (para el frontend) y Firebase (para el backend)

## IDE Recomendado

**Visual Studio Code (VS Code)**

### Extensiones recomendadas:

- Firebase Tools
- Angular Language Service
- Prettier - Code formatter
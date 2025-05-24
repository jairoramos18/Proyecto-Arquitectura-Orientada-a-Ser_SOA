---

# 📄 Create User

## 🧾 Resumen

Esta funcionalidad permite registrar un nuevo usuario en el sistema, ya sea mediante correo electrónico o proveedores externos (Google, Facebook, GitHub). La información se almacena en la colección `usuarios` de Firestore.

## 💻 Código relevante

```ts
agregarUsuario(usuario: User) {
  const usuariosRef = collection(this.firestore, 'usuarios');
  return addDoc(usuariosRef, usuario);
}
```

## 📲 Flujo en la interfaz

* El usuario accede a `register.component.ts`.
* Llena un formulario con su `email`, `nombre` y `password`, o inicia sesión con un proveedor externo.
* Al enviar el formulario, se ejecuta `agregarUsuario()` y se guarda el usuario en Firestore.

## 🔐 Validaciones

* Se validan campos obligatorios (nombre, correo, contraseña).
* Se previene el registro si el correo ya existe (validación desde Firebase).

## 🛠️ Notas técnicas

* El campo `id` es generado automáticamente por Firestore.
* El formulario está implementado con `Angular Forms` y estilos de Angular Material.

---
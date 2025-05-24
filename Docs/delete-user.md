
# 📄 Delete User

## 🧾 Resumen

Permite eliminar un usuario registrado en Firestore.

## 💻 Código relevante

```ts
eliminarUsuario(id: string) {
  const usuarioDoc = doc(this.firestore, `usuarios/${id}`);
  return deleteDoc(usuarioDoc);
}
```

## 📲 Flujo en la interfaz

* En la tabla de usuarios (`usuarios.component.html`), cada fila tiene un botón "Eliminar".
* Al hacer clic, se confirma la acción y se ejecuta `eliminarUsuario()` con el ID correspondiente.

## 🔐 Validaciones

* Puede incluirse una confirmación (`confirm()` o modal) antes de proceder.

## 🛠️ Notas técnicas

* El ID se obtiene desde el listado (`getUsuarios`) y se pasa directamente.
* El usuario se elimina completamente del backend (Firestore).

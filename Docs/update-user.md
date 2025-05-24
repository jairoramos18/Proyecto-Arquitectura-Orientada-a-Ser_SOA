
# 📄 Update User

## 🧾 Resumen

Permite actualizar la información de un usuario existente en Firestore, como el nombre, correo o contraseña.

## 💻 Código relevante

```ts
actualizarUsuario(id: string, usuario: Partial<User>) {
  const usuarioDoc = doc(this.firestore, `usuarios/${id}`);
  return updateDoc(usuarioDoc, usuario);
}
```

## 📲 Flujo en la interfaz

* En `usuarios.component.html`, se presenta un botón "Editar" junto a cada usuario.
* Al hacer clic, se abre un formulario con los datos actuales prellenados.
* El usuario edita los campos deseados y guarda.
* Se ejecuta `actualizarUsuario()` con el ID y los nuevos datos.

## 🔐 Validaciones

* Validación de campos editables (nombre, correo, password).

## 🛠️ Notas técnicas

* El ID del documento se pasa como parámetro para ubicar el registro exacto.
* Se usa `Partial<User>` para permitir actualización parcial.

---
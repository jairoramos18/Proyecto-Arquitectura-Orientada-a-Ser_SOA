
# 📄 Read Users

## 🧾 Resumen

Esta funcionalidad permite obtener y visualizar en tiempo real todos los usuarios almacenados en Firestore.

## 💻 Código relevante

```ts
getUsuarios(): Observable<User[]> {
  const usuariosRef = collection(this.firestore, 'usuarios');
  return collectionData(usuariosRef, { idField: 'id' }) as Observable<User[]>;
}
```

## 📲 Flujo en la interfaz

* Se llama a `getUsuarios()` desde `usuarios.component.ts`.
* Los datos se presentan en una tabla con Angular Material (`mat-table`).
* La tabla permite ver el nombre, correo y botones de acción (editar, eliminar).

## 🔐 Validaciones

* Se realiza suscripción con `Observable` para actualizar en tiempo real.

## 🛠️ Notas técnicas

* La colección `usuarios` debe existir en Firestore.
* Se utiliza `idField: 'id'` para incluir el ID del documento en el objeto `User`.

---
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { User } from '../interfaces/user.interface'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  constructor(private firestore: Firestore) {}

  // Obtener todos los usuarios
  getUsuarios(): Observable<User[]> {
    const usuariosRef = collection(this.firestore, 'usuarios');
    return collectionData(usuariosRef, { idField: 'id' }) as Observable<User[]>;
  }

  // Agregar nuevo usuario
  agregarUsuario(usuario: User) {
    const usuariosRef = collection(this.firestore, 'usuarios');
    return addDoc(usuariosRef, usuario);
  }

  // Eliminar usuario
  eliminarUsuario(id: string) {
    const usuarioDoc = doc(this.firestore, `usuarios/${id}`);
    return deleteDoc(usuarioDoc);
  }

  // Actualizar usuario
  actualizarUsuario(id: string, usuario: Partial<User>) {
    const usuarioDoc = doc(this.firestore, `usuarios/${id}`);
    return updateDoc(usuarioDoc, usuario);
  }
}

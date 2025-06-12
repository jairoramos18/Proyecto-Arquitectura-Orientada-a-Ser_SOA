import { FieldValue, Timestamp } from '@angular/fire/firestore'; // Importa FieldValue y Timestamp

/**
 * Define la estructura de un registro de auditoría de autenticación para Firestore.
 * Los campos opcionales son para datos que pueden no estar siempre disponibles de OAuth.
 */
export interface CrudAuditoria {
  id?: string; // Firestore usa un ID de documento string, opcional para la creación
  email: string;
  name?: string; // Nombre del usuario, opcional
  phone?: string | null; // Teléfono del usuario, opcional
  metodoAutenticacion: string; // "PERSONALIZADO", "GOOGLE", "FACEBOOK", "GITHUB"
 
  fechaRegistroServidor?: FieldValue | Timestamp;
}

import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth'; // Usamos Auth directamente, no 'user' o 'User as FirebaseUser' aquí
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
  FieldValue,
  serverTimestamp,
  CollectionReference // Importar CollectionReference para tipado
} from '@angular/fire/firestore';
import { CrudAuditoria } from '../models/crud-auditoria.model';
import { Observable, from, map } from 'rxjs'; // from para convertir Promise a Observable

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private auditoriaCollection: CollectionReference<CrudAuditoria>; // Declarar sin inicializar aquí

  constructor(private firestore: Firestore, private auth: Auth) {
    // Inicializar dentro del constructor, después de que 'firestore' esté disponible
    this.auditoriaCollection = collection(this.firestore, 'auditoria') as CollectionReference<CrudAuditoria>;
  }

  /**
   * Registra un evento de autenticación exitosa en Firestore.
   * La fecha y hora se capturan del servidor de Firestore con serverTimestamp().
   * @param email Email del usuario.
   * @param name Nombre del usuario (opcional).
   * @param phone Teléfono del usuario (opcional).
   * @param metodoAutenticacion Método de autenticación (PERSONALIZADO, GOOGLE, etc.).
   * @returns Observable que emite el ID del nuevo documento.
   */
  registrarAutenticacion(email: string, name: string | null = null, phone: string | null = null, metodoAutenticacion: string): Observable<string> {
    // Construir el objeto de datos condicionalmente para evitar 'undefined'
    const auditoriaData: Partial<CrudAuditoria> = { // Usamos Partial para construir el objeto
      email: email,
      metodoAutenticacion: metodoAutenticacion,
      fechaRegistroServidor: serverTimestamp() // Esto es clave para la fecha del servidor
    };

    // Añadir 'name' y 'phone' solo si tienen un valor que no sea null o undefined
    // Si son null, Firestore los guardará como null (válido). Si son undefined, se omite el campo.
    if (name !== null) { // Firestore acepta null, pero no undefined.
      auditoriaData.name = name;
    }
    if (phone !== null) { // Firestore acepta null, pero no undefined.
      auditoriaData.phone = phone;
    }

    return from(addDoc(this.auditoriaCollection, auditoriaData as CrudAuditoria)).pipe(
      map(docRef => docRef.id) // Retorna el ID del documento creado
    );
  }

  /**
   * Obtiene todos los registros de auditoría de Firestore.
   * @param ordenarPor Campo por el cual ordenar.
   * @param direccionOrdenamiento Dirección del ordenamiento ('asc', 'desc').
   * @returns Observable con la lista de registros de auditoría.
   */
  getTodasEntradasAuditoria(ordenarPor: string = 'fechaRegistroServidor', direccionOrdenamiento: 'asc' | 'desc' = 'desc'): Observable<CrudAuditoria[]> {
    const q = query(this.auditoriaCollection, orderBy(ordenarPor, direccionOrdenamiento)); // Corregido 'direccionamiento'
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as CrudAuditoria })))
    );
  }

  /**
   * Obtiene registros de auditoría para una fecha específica.
   * @param fecha La fecha a buscar (LocalDate).
   * @param ordenarPor Campo por el cual ordenar.
   * @param direccionOrdenamiento Dirección del ordenamiento.
   * @returns Observable con la lista de registros de auditoría para la fecha especificada.
   */
  getAuditoriaPorFecha(fecha: LocalDate, ordenarPor: string = 'fechaRegistroServidor', direccionOrdenamiento: 'asc' | 'desc' = 'desc'): Observable<CrudAuditoria[]> {
    // Para buscar por día, necesitas un rango de inicio y fin del día en Timestamp de Firestore.
    // Firestore Timestamp usa segundos y nanosegundos desde la época Unix.
    const startOfDay = Timestamp.fromDate(new Date(fecha.toString() + 'T00:00:00Z')); // Usar UTC para evitar problemas de zona horaria
    const endOfDay = Timestamp.fromDate(new Date(fecha.toString() + 'T23:59:59.999Z'));

    const q = query(
      this.auditoriaCollection,
      where('fechaRegistroServidor', '>=', startOfDay),
      where('fechaRegistroServidor', '<=', endOfDay),
      orderBy(ordenarPor, direccionOrdenamiento) // Corregido 'direccionamiento'
    );
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as CrudAuditoria })))
    );
  }

  /**
   * Obtiene el historial de accesos para un email específico (búsqueda exacta).
   * Firestore no soporta búsquedas "contains" o "like" directamente en `where`.
   * Para búsquedas parciales, necesitarías una solución más avanzada (ej. Algolia, búsqueda en el cliente si el dataset es pequeño).
   * Para este examen, asumiremos búsqueda exacta o manejaríamos la búsqueda parcial en el frontend si el dataset es pequeño.
   * Opcionalmente, para una búsqueda insensible a mayúsculas/minúsculas, podrías guardar los emails en minúsculas en Firestore.
   * @param email El email exacto del usuario.
   * @param ordenarPor Campo por el cual ordenar.
   * @param direccionOrdenamiento Dirección del ordenamiento.
   * @returns Observable con la lista de registros de auditoría para el email especificado.
   */
  getAuditoriaPorEmail(email: string, ordenarPor: string = 'fechaRegistroServidor', direccionOrdenamiento: 'asc' | 'desc' = 'desc'): Observable<CrudAuditoria[]> {
    const q = query(
      this.auditoriaCollection,
      where('email', '==', email), // Búsqueda exacta por email
      orderBy(ordenarPor, direccionOrdenamiento) // Corregido 'direccionamiento'
    );
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as CrudAuditoria })))
    );
  }

  /**
   * Obtiene el acceso de un usuario específico en una fecha específica.
   * @param email El email exacto del usuario.
   * @param fecha La fecha a buscar (LocalDate).
   * @param ordenarPor Campo por el cual ordenar.
   * @param direccionOrdenamiento Dirección del ordenamiento.
   * @returns Observable con la lista de registros de auditoría para el email y la fecha especificados.
   */
  getAuditoriaPorEmailYFecha(email: string, fecha: LocalDate, ordenarPor: string = 'fechaRegistroServidor', direccionOrdenamiento: 'asc' | 'desc' = 'desc'): Observable<CrudAuditoria[]> {
    const startOfDay = Timestamp.fromDate(new Date(fecha.toString() + 'T00:00:00Z'));
    const endOfDay = Timestamp.fromDate(new Date(fecha.toString() + 'T23:59:59.999Z'));

    const q = query(
      this.auditoriaCollection,
      where('email', '==', email),
      where('fechaRegistroServidor', '>=', startOfDay),
      where('fechaRegistroServidor', '<=', endOfDay),
      orderBy(ordenarPor, direccionOrdenamiento) // Corregido 'direccionamiento'
    );
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as CrudAuditoria })))
    );
  }

  // --- Adaptación para la búsqueda parcial de email en el frontend (si el dataset no es muy grande) ---
  // Esta es una alternativa si el requisito de "búsqueda parcial" es crucial y no se usa una solución externa.
  // Solo se recomienda para colecciones pequeñas a medianas, ya que descarga todos los datos relevantes.
  getAuditoriaParcialEmailFrontend(emailPartial: string, ordenarPor: string = 'fechaRegistroServidor', direccionOrdenamiento: 'asc' | 'desc' = 'desc'): Observable<CrudAuditoria[]> {
    return this.getTodasEntradasAuditoria(ordenarPor, direccionOrdenamiento).pipe( // Corregido 'direccionamiento'
      map(entries => {
        if (!emailPartial) {
          return entries;
        }
        const lowerCaseEmailPartial = emailPartial.toLowerCase();
        return entries.filter(entry => entry.email.toLowerCase().includes(lowerCaseEmailPartial));
      })
    );
  }
}

// Interfaz auxiliar para manejar fechas de Angular en el servicio
interface LocalDate {
  year: number;
  month: number;
  day: number;
  toString(): string;
}

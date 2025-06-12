import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrudAuditoria } from '../models/crud-auditoria.model';
import { AuditoriaService } from '../services/auditoria.service';
import { Timestamp, FieldValue } from '@angular/fire/firestore'; // Importa Timestamp y FieldValue
import { Observable } from 'rxjs'; // ¡IMPORTACIÓN AÑADIDA!

@Component({
  selector: 'app-auditoria-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auditoria-list.component.html',
  styleUrls: ['./auditoria-list.component.css'] // Puedes crear este archivo si necesitas estilos específicos, o dejarlo vacío si solo usas Tailwind
})
export class AuditoriaListComponent implements OnInit {
  auditoriaEntries: CrudAuditoria[] = [];
  loading = true;
  error: string | null = null;

  // Parámetros de ordenamiento
  ordenarPor: string = 'fechaRegistroServidor'; // 'fechaRegistroServidor', 'email', 'name'
  direccionOrdenamiento: 'asc' | 'desc' = 'desc'; // 'asc' o 'desc'

  // Parámetros de filtro/búsqueda
  filtroFecha: string = ''; // Para la fecha específica (AAAA-MM-DD)
  busquedaEmail: string = ''; // Para la búsqueda por email (parcial en frontend, exacta en backend)
  filtroEmailYFecha: { email: string, fecha: string } = { email: '', fecha: '' }; // Para búsqueda combinada

  constructor(private auditoriaService: AuditoriaService) { }

  ngOnInit(): void {
    this.cargarAuditoria();
  }

  /**
   * Carga los registros de auditoría aplicando los filtros y ordenamientos actuales.
   * Utiliza una lógica condicional para llamar al endpoint de backend (Firestore) correcto.
   */
  cargarAuditoria(): void {
    this.loading = true;
    this.error = null;

    let observable: Observable<CrudAuditoria[]>;

    // PRIORIDAD DE LOS FILTROS
    // 1. Filtro combinado Email y Fecha (el más específico)
    if (this.filtroEmailYFecha.email && this.filtroEmailYFecha.fecha) {
      console.log('Aplicando filtro combinado por Email y Fecha:', this.filtroEmailYFecha.email, this.filtroEmailYFecha.fecha);
      const localDate = this.convertStringToLocalDate(this.filtroEmailYFecha.fecha);
      observable = this.auditoriaService.getAuditoriaPorEmailYFecha(
        this.filtroEmailYFecha.email,
        localDate,
        this.ordenarPor,
        this.direccionOrdenamiento
      );
    }
    // 2. Búsqueda por Email (parcial en frontend)
    else if (this.busquedaEmail) {
      console.log('Aplicando búsqueda parcial por Email:', this.busquedaEmail);
      observable = this.auditoriaService.getAuditoriaParcialEmailFrontend(
        this.busquedaEmail,
        this.ordenarPor,
        this.direccionOrdenamiento
      );
    }
    // 3. Filtro por Fecha Específica
    else if (this.filtroFecha) {
      console.log('Aplicando filtro por Fecha específica:', this.filtroFecha);
      const localDate = this.convertStringToLocalDate(this.filtroFecha);
      observable = this.auditoriaService.getAuditoriaPorFecha(
        localDate,
        this.ordenarPor,
        this.direccionOrdenamiento
      );
    }
    // 4. Obtener todos los registros (sin filtros)
    else {
      console.log('Cargando todos los registros de auditoría.');
      observable = this.auditoriaService.getTodasEntradasAuditoria(
        this.ordenarPor,
        this.direccionOrdenamiento
      );
    }

    observable.subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.auditoriaEntries = data;
        this.loading = false;
        if (data.length === 0) {
          console.warn('No se encontraron registros con los filtros aplicados.');
        }
      },
      error: (err) => {
        // MUY IMPORTANTE: Revisa la consola del navegador y la consola de Firebase
        // para ver si hay errores relacionados con índices faltantes.
        // Si hay un error de "Missing or insufficient permissions", revisa tus reglas de seguridad de Firestore.
        console.error('Error al cargar los registros de auditoría:', err);
        this.error = 'Error al cargar los registros. Por favor, verifica la consola para detalles y asegúrate de que los índices de Firestore estén configurados correctamente.';
        this.loading = false;
      }
    });
  }

  /**
   * Convierte una cadena de fecha AAAA-MM-DD a un objeto LocalDate (simulado para el servicio).
   * @param dateString La cadena de fecha.
   * @returns Un objeto LocalDate con año, mes y día.
   */
  private convertStringToLocalDate(dateString: string): { year: number, month: number, day: number, toString(): string } {
    const [year, month, day] = dateString.split('-').map(Number);
    return {
      year,
      month,
      day,
      toString: () => dateString // Para que el servicio pueda usar el formato AAAA-MM-DD
    };
  }

  /**
   * Aplica la búsqueda/filtrado al hacer clic en el botón o cambiar los parámetros.
   */
  aplicarFiltros(): void {
    // Al aplicar filtros, siempre limpiamos los campos que no son el filtro principal activo
    // para evitar ambigüedades.

    const isCombinedFilterActive = this.filtroEmailYFecha.email && this.filtroEmailYFecha.fecha;
    const isBusquedaEmailActive = !!this.busquedaEmail; // Convertir a booleano
    const isFiltroFechaActive = !!this.filtroFecha; // Convertir a booleano

    if (isCombinedFilterActive) {
      // Si el combinado está activo, los otros deben estar vacíos.
      this.busquedaEmail = '';
      this.filtroFecha = '';
    } else if (isBusquedaEmailActive) {
      // Si solo email está activo, fecha y combinado deben estar vacíos.
      this.filtroFecha = '';
      this.filtroEmailYFecha = { email: '', fecha: '' };
    } else if (isFiltroFechaActive) {
      // Si solo fecha está activa, email y combinado deben estar vacíos.
      this.busquedaEmail = '';
      this.filtroEmailYFecha = { email: '', fecha: '' };
    }
    // Si no hay ningún filtro específico (todos vacíos), se cargan todos los registros.

    this.cargarAuditoria(); // Llama a la carga de datos con los filtros actualizados
  }

  /**
   * Limpia todos los filtros y vuelve a cargar todos los registros.
   */
  limpiarFiltros(): void {
    this.filtroFecha = '';
    this.busquedaEmail = '';
    this.filtroEmailYFecha = { email: '', fecha: '' };
    this.ordenarPor = 'fechaRegistroServidor';
    this.direccionOrdenamiento = 'desc';
    this.cargarAuditoria();
  }

  /**
   * Formatea la fecha y hora para mostrarla de forma legible en la tabla.
   * Firestore devuelve las fechas como objetos Timestamp, no string.
   * @param fechaTimestamp La fecha como Timestamp de Firestore.
   * @returns La fecha y hora formateada.
   */
  formatoFechaHora(fechaTimestamp: FieldValue | Timestamp | undefined): string { // Acepta FieldValue, Timestamp o undefined
    // CORRECCIÓN: Verifica si es una instancia de Timestamp antes de llamar a toDate()
    if (!fechaTimestamp) {
        return 'N/A';
    }
    if (fechaTimestamp instanceof Timestamp) {
        try {
            const date = fechaTimestamp.toDate(); // Ahora TypeScript sabe que es un Timestamp
            const options: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false // Formato 24 horas
            };
            return date.toLocaleString('es-ES', options);
        } catch (e) {
            console.error("Error formateando fecha (Firestore Timestamp):", e);
            return 'Fecha inválida';
        }
    } else {
        // Si es FieldValue (que no tiene toDate) o algún otro tipo inesperado
        // Esto podría ocurrir si se intenta renderizar un registro recién creado antes de que Firestore lo procese.
        return 'Pendiente...'; // O algún otro mensaje apropiado
    }
  }
}

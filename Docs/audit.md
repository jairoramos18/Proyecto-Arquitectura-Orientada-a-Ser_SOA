
# Documentación del Componente: `AuditoriaListComponent`

Este documento describe el funcionamiento del componente `AuditoriaListComponent` de Angular, diseñado para mostrar, filtrar y ordenar registros de auditoría obtenidos desde una colección de Firestore.

**Ruta del archivo:** `src/app/auditoria-list/auditoria-list.component.ts`

---

## 1. Resumen General

El `AuditoriaListComponent` es un componente **standalone** que gestiona la visualización de una lista de inicios de sesión de usuarios. Su principal responsabilidad es:
- **Obtener** los registros de auditoría desde `AuditoriaService`.
- **Mostrar** los datos en una tabla.
- Permitir al usuario **ordenar** los registros por diferentes campos (fecha, email, nombre).
- Proveer múltiples opciones de **filtrado** para la búsqueda de registros específicos:
    - Búsqueda por coincidencia parcial de email.
    - Filtro por una fecha exacta.
    - Filtro combinado por email y fecha.
- Manejar los **estados de carga y error** durante la obtención de datos.

---

## 2. Configuración del Componente

```typescript
@Component({
  selector: 'app-auditoria-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auditoria-list.component.html',
  styleUrls: ['./auditoria-list.component.css']
})
```
- **`standalone: true`**: Indica que el componente gestiona sus propias dependencias. No necesita ser declarado en un `NgModule`.
- **`imports`**:
    - `CommonModule`: Proporciona directivas estructurales y de atributos como `*ngIf`, `*ngFor`, etc.
    - `FormsModule`: Necesario para usar el enlace de datos bidireccional con `[(ngModel)]` en los campos de formulario del template (HTML).

---

## 3. Propiedades del Componente

Las propiedades definen el estado y los datos que maneja el componente.

### Propiedades de Datos y Estado
- **`auditoriaEntries: CrudAuditoria[] = []`**: Un arreglo que almacena los registros de auditoría recuperados desde Firestore. Es la fuente de datos para la tabla en la vista.
- **`loading: boolean = true`**: Una bandera para controlar la visibilidad de indicadores de carga (spinners, skeletons). Se establece en `true` al iniciar una petición y en `false` cuando la petición finaliza (con éxito o error).
- **`error: string | null = null`**: Almacena un mensaje de error legible para el usuario si falla la carga de datos. Si su valor no es nulo, se puede mostrar un mensaje de alerta en la vista.

### Propiedades de Ordenamiento
- **`ordenarPor: string = 'fechaRegistroServidor'`**: Define el campo por el cual se ordenarán los resultados. Los valores posibles son `'fechaRegistroServidor'`, `'email'`, o `'name'`. El valor por defecto es la fecha de registro.
- **`direccionOrdenamiento: 'asc' | 'desc' = 'desc'`**: Establece la dirección del ordenamiento. Por defecto, los registros más recientes aparecen primero (`'desc'`).

### Propiedades de Filtro y Búsqueda
- **`filtroFecha: string = ''`**: Almacena el valor de un campo de entrada de fecha (`YYYY-MM-DD`) para filtrar los registros por un día específico.
- **`busquedaEmail: string = ''`**: Almacena el texto para buscar usuarios por email. Esta búsqueda se realiza en el frontend y busca coincidencias parciales.
- **`filtroEmailYFecha: { email: string, fecha: string } = { email: '', fecha: '' }`**: Un objeto para la búsqueda combinada, que requiere tanto un email como una fecha. Este es el filtro de mayor prioridad.

---

## 4. Ciclo de Vida

### `ngOnInit()`
Este método del ciclo de vida de Angular se ejecuta una sola vez cuando el componente es inicializado.
```typescript
ngOnInit(): void {
  this.cargarAuditoria();
}
```
Su única responsabilidad es llamar a `cargarAuditoria()` para realizar la carga inicial de los datos tan pronto como el componente esté listo.

---

## 5. Métodos Principales

Estos métodos definen la lógica central y la interacción del usuario.

### `cargarAuditoria()`
Es el método más importante del componente. Orquesta la obtención de datos basándose en los filtros y ordenamientos seleccionados por el usuario.

**Lógica de funcionamiento:**
1.  Establece `loading` a `true` y `error` a `null` para iniciar el proceso de carga.
2.  Utiliza una serie de `if-else if-else` para determinar qué tipo de consulta realizar, siguiendo un orden de prioridad:
    1.  **Filtro combinado (Email y Fecha)**: Si `filtroEmailYFecha.email` y `filtroEmailYFecha.fecha` tienen valores, llama a `auditoriaService.getAuditoriaPorEmailYFecha()`.
    2.  **Búsqueda por Email**: Si no, pero `busquedaEmail` tiene un valor, llama a `auditoriaService.getAuditoriaParcialEmailFrontend()`.
    3.  **Filtro por Fecha**: Si no, pero `filtroFecha` tiene un valor, llama a `auditoriaService.getAuditoriaPorFecha()`.
    4.  **Sin filtros**: Si ningún filtro está activo, llama a `auditoriaService.getTodasEntradasAuditoria()` para obtener todos los registros.
3.  Se suscribe al `Observable` devuelto por el servicio:
    - **`next` (Éxito)**: Asigna los datos recibidos a `auditoriaEntries`, establece `loading` a `false` y muestra una advertencia en consola si no se encontraron resultados.
    - **`error` (Fallo)**: Captura cualquier error (ej. índices de Firestore faltantes, problemas de permisos), lo muestra en la consola, asigna un mensaje de error a la propiedad `error` y establece `loading` a `false`.

### `aplicarFiltros()`
Este método se invoca cuando el usuario quiere aplicar los filtros que ha configurado en la interfaz (por ejemplo, al hacer clic en un botón "Buscar").

**Lógica de funcionamiento:**
1.  Verifica cuál de los filtros principales está activo (combinado, solo email o solo fecha).
2.  Para evitar ambigüedades, **limpia los campos de los filtros que no están activos**. Por ejemplo, si se activa la búsqueda por email, se asegura de que los campos del filtro por fecha y el filtro combinado estén vacíos.
3.  Finalmente, llama a `cargarAuditoria()` para volver a ejecutar la consulta con los parámetros actualizados.

### `limpiarFiltros()`
Este método restaura el estado inicial del componente, permitiendo al usuario empezar una nueva búsqueda.

**Lógica de funcionamiento:**
1.  Resetea todas las propiedades de filtro (`filtroFecha`, `busquedaEmail`, `filtroEmailYFecha`) a sus valores vacíos.
2.  Restaura las propiedades de ordenamiento a sus valores por defecto (`fechaRegistroServidor`, `desc`).
3.  Llama a `cargarAuditoria()` para recargar la lista completa de registros con el ordenamiento por defecto.

---

## 6. Métodos de Utilidad y Formato

### `formatoFechaHora(fechaTimestamp: ...)`
Es una función de ayuda diseñada para ser usada en la plantilla HTML y transformar el objeto `Timestamp` de Firestore en una cadena de texto legible.

**Características:**
- Acepta `Timestamp`, `FieldValue` o `undefined` para mayor seguridad.
- **Valida** que el valor de entrada sea una instancia de `Timestamp` antes de intentar convertirlo con `toDate()`. Esto previene errores en tiempo de ejecución.
- Si la entrada es nula o indefinida, devuelve `'N/A'`.
- Si la entrada es un `FieldValue` (usado para marcas de tiempo del servidor antes de que se resuelvan), devuelve `'Pendiente...'`.
- Formatea la fecha al formato local de España (`es-ES`) con hora en formato 24h.

### `convertStringToLocalDate(dateString: string)`
Un método privado que convierte una cadena de fecha en formato `AAAA-MM-DD` a un objeto simple `{ year, month, day }`. Este es el formato que el `AuditoriaService` espera para las consultas por fecha.

---

## 7. Interacción con `AuditoriaService`

Este componente **no interactúa directamente con Firestore**. Delega toda la lógica de acceso a datos al servicio `AuditoriaService`, que es inyectado en el constructor. Esto sigue el principio de separación de responsabilidades. Los métodos del servicio utilizados son:

- `getAuditoriaPorEmailYFecha()`
- `getAuditoriaParcialEmailFrontend()`
- `getAuditoriaPorFecha()`
- `getTodasEntradasAuditoria()`
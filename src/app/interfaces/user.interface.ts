export interface User {
  id?: string;
  email: string;
  nombre: string;
  password: string;
  telefono?: string; // ¡CAMBIO AQUÍ! Añadido campo de teléfono opcional
}
// Usuarios quemados en el código para desarrollo
const MOCK_USERS = [
  {
    id: "u1",
    name: "Pablo Jimora",
    email: "pablo@riwi.com",
    password: "password123",
    role: "user", // Usuario normal
    isActive: true // Usuario activo por defecto
  },
  {
    id: "u2",
    name: "Duque",
    email: "duque@riwi.com",
    password: "securepass",
    role: "admin", // Administrador
    isActive: true // Administrador siempre activo
  }
];

export default MOCK_USERS;

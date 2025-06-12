const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;

// Configuración del middleware
app.use(bodyParser.json());

// Configurar conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "73490091",
  database: "menu_universidad",
});

// Verificar conexión a MySQL
db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});

// Ruta pública: Obtener menús
app.get("/menus", (req, res) => {
  const query = "SELECT * FROM menus";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send("Error al obtener los menús");
    }
    res.json(results);
  });
});

// Ruta para login de administradores
app.post("/login", (req, res) => {
  const { nombre, password } = req.body;

  const query = "SELECT * FROM usuarios_admin WHERE nombre = ?";
  db.query(query, [nombre], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).send("Usuario no encontrado");
    }

    const user = results[0];
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).send("Contraseña incorrecta");
      }

      // Crear token JWT
      const token = jwt.sign({ id: user.id, lugar_id: user.lugar_id }, "clave_secreta", { expiresIn: "1h" });
      res.json({ token });
    });
  });
});

// Ruta protegida: Actualizar menús
app.post("/menus", (req, res) => {
  const { token, lugar_id, categoria, descripcion, precio } = req.body;

  // Verificar token
  try {
    const decoded = jwt.verify(token, "clave_secreta");
    if (decoded.lugar_id !== lugar_id) {
      return res.status(403).send("Acceso denegado");
    }

    const query = "INSERT INTO menus (lugar_id, categoria, descripcion, precio) VALUES (?, ?, ?, ?)";
    db.query(query, [lugar_id, categoria, descripcion, precio], (err) => {
      if (err) {
        return res.status(500).send("Error al actualizar el menú");
      }
      res.send("Menú actualizado correctamente");
    });
  } catch {
    res.status(401).send("Token inválido o expirado");
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

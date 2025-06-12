const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// Registro de usuarios
router.post("/register", async (req, res) => {
    const { email, password, sector } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO users (email, password, sector) VALUES (?, ?, ?)";
    db.query(query, [email, hashedPassword, sector], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ message: "Usuario registrado con éxito" });
    });
});

// Inicio de sesión
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).send("Credenciales inválidas");

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).send("Credenciales inválidas");

        const token = jwt.sign({ id: user.id, sector: user.sector }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    });
});

module.exports = router;

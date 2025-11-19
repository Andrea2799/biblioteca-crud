const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Servir frontend

// Base de datos en memoria
let libros = [];
let idCounter = 1;

// ========================
// RUTAS CRUD
// ========================

// CREATE
app.post("/api/libros", (req, res) => {
    const libro = { id: idCounter++, ...req.body };
    libros.push(libro);
    res.json(libro);
});

// READ
app.get("/api/libros", (req, res) => {
    res.json(libros);
});

// UPDATE
app.put("/api/libros/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = libros.findIndex(l => l.id === id);
    if (index >= 0) {
        libros[index] = { id, ...req.body };
        res.json(libros[index]);
    } else {
        res.status(404).json({ error: "Libro no encontrado" });
    }
});

// DELETE
app.delete("/api/libros/:id", (req, res) => {
    const id = parseInt(req.params.id);
    libros = libros.filter(l => l.id !== id);
    res.json({ mensaje: "Libro eliminado" });
});

// ========================
// RUTA XML
// ========================
app.get("/api/xml", (req, res) => {
    const total = libros.length;
    const generoCount = {};
    libros.forEach(libro => {
        generoCount[libro.genero] = (generoCount[libro.genero] || 0) + 1;
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<biblioteca>\n`;
    xml += `<totalLibros>${total}</totalLibros>\n`;
    xml += `<porcentajes>\n`;
    for (const genero in generoCount) {
        const porcentaje = ((generoCount[genero] / total) * 100).toFixed(2);
        xml += `<genero nombre="${genero}" porcentaje="${porcentaje}"/>\n`;
    }
    xml += `</porcentajes>\n`;
    xml += `<libros>\n`;
    libros.forEach(l => {
        xml += `<libro id="${l.id}">\n`;
        xml += `<titulo>${l.titulo}</titulo>\n`;
        xml += `<autor>${l.autor}</autor>\n`;
        xml += `<anio>${l.anio}</anio>\n`;
        xml += `<genero>${l.genero}</genero>\n`;
        xml += `<precio>${l.precio}</precio>\n`;
        xml += `</libro>\n`;
    });
    xml += `</libros>\n</biblioteca>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
});

// ========================
// RUTA CATCH-ALL PARA SPA (Render)
// ========================
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ========================
// INICIAR SERVIDOR
// ========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

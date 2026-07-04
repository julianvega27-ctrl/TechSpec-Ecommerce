console.log("1. El archivo comenzó a ejecutarse");

import express from "express";

console.log("2. Express fue importado");

const app = express();

console.log("3. Express creado");

const PORT = 3000;

app.get("/", (_req, res) => {
    res.send("Hola");
});

console.log("4. Antes del listen");

app.listen(PORT, () => {
    console.log("5. Servidor iniciado");
});

console.log("6. Fin del archivo");
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/bin/:bin', async (req, res) => {
    const bin = req.params.bin;
    try {
        const response = await fetch(`https://lookup.binlist.net/${bin}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error al obtener BIN:", error);
        res.status(500).json({ error: "Error al obtener información del BIN" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor proxy escuchando en el puerto ${PORT}`);
});

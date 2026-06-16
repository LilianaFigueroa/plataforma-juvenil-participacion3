const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const rutaCandidatos = path.join(__dirname, "data", "candidatos.json");

const rutaVotos = path.join(__dirname, "data", "votos.json");

function leerVotos() {
  const data = fs.readFileSync(rutaVotos, "utf8");
  return JSON.parse(data);
}

function guardarVotos(votos) {
  fs.writeFileSync(rutaVotos, JSON.stringify(votos, null, 2));
}

function leerCandidatos() {
  const data = fs.readFileSync(rutaCandidatos, "utf8");
  return JSON.parse(data);
}

function guardarCandidatos(candidatos) {
  fs.writeFileSync(rutaCandidatos, JSON.stringify(candidatos, null, 2));
}

app.get("/api/candidatos", function (req, res) {
  const candidatos = leerCandidatos();
  res.json(candidatos);
});

app.post("/api/candidatos", function (req, res) {
  console.log("POST recibido:", req.body);
  
  const nuevoCandidato = {
    id: Date.now(),
    nombre: req.body.nombre,
    rol: req.body.rol,
    propuesta: req.body.propuesta,
    estado: "Perfil de práctica académica"
  };

  if (!nuevoCandidato.nombre || !nuevoCandidato.rol || !nuevoCandidato.propuesta) {
    console.log("Validación fallida - Faltan datos");
    return res.status(400).json({
      mensaje: "Faltan datos obligatorios"
    });
  }

  try {
    const candidatos = leerCandidatos();
    candidatos.push(nuevoCandidato);
    guardarCandidatos(candidatos);
    console.log("Candidato guardado:", nuevoCandidato);

    res.status(201).json({
      mensaje: "Perfil guardado correctamente",
      candidato: nuevoCandidato
    });
  } catch (error) {
    console.error("Error al guardar:", error);
    res.status(500).json({
      mensaje: "Error al guardar el perfil"
    });
  }
});

app.get("/api/votos", function (req, res) {
  const votos = leerVotos();
  res.json(votos);
});

app.post("/api/votos", function (req, res) {
  const identificacion = req.body.identificacion;
  const candidato = req.body.candidato;

  if (!identificacion || !candidato) {
    return res.status(400).json({
      mensaje: "Faltan datos: identificación o candidato"
    });
  }

  const votos = leerVotos();

  const yaVoto = votos.find(function (voto) {
    return voto.identificacion === identificacion;
  });

  if (yaVoto) {
    return res.status(400).json({
      mensaje: "Esta identificación ya registró un voto pedagógico"
    });
  }

  const nuevoVoto = {
    id: Date.now(),
    identificacion: identificacion,
    candidato: candidato,
    fecha: new Date().toISOString()
  };

  votos.push(nuevoVoto);
  guardarVotos(votos);

  res.status(201).json({
    mensaje: "Voto pedagógico guardado correctamente",
    voto: nuevoVoto
  });
});

app.get("/votar", function (req, res) {
  res.sendFile(path.join(__dirname, "votar.html"));
});

app.listen(PORT, function () {
  console.log("Servidor funcionando en http://localhost:" + PORT);
});


const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();

app.use(bodyParser.json());

let userList = [{
  username: "admin",
  password: "admin"
}];

// GET de página inicial
app.get("/", (req, res) => {
  // Retorna página inicial
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// GET de página de registro
app.get("/register-page", (req, res) => {
  // Retorna página de registro
  res.sendFile(path.join(__dirname, "../client/register.html"));
});

// GET de página de registro
app.get("/home", (req, res) => {
  // Retorna página de registro
  res.sendFile(path.join(__dirname, "../client/home.html"));
});

// POST /register - Registrar usuarix
app.post("/register", (req, res) => {
  console.log(req.body); // { username: 'admin', password: 'admin' }

  // Verificar si recibí los datos y validarlos
  if (!req.body.username || !req.body.password || !req.body.checkedPassword) {
    res.status(400).send("No se recibieron los datos correctos.");
    return; 
  }

  // Tengo los dos datos, los valido
  if (req.body.password !== req.body.checkedPassword) {
    res.status(400).send("Las contraseñas no coinciden.");
    return; // se usa el return para dejar de seguir validando, y esperar a otro post. Además si no usaramos el return, cuando hagamos otro POST al mismo endpoint, ya tendría seteado el header de status 400, sin poder modificarlo.
  }
  // Valido si existe el nombre de usuarix
  if (userList.filter(user => user.username === req.body.username).length > 0) {
    res.status(409).send("Ya existe usuarix con ese nombre.");
    return; 
  }

  userList.push({
    username: req.body.username,
    password: req.body.password
  });

  res.status(200).send("Usuarix registradx.");
});

// POST /login - login de usuarix
app.post("/login", (req, res) => {

  console.log(req.body);

  // Verificar si recibí los datos y validarlos
  if (!req.body.username || !req.body.password) {
    res.status(400).send("No se recibieron los datos correctos.");
    return;
  }

  if (userList.filter(user => user.username === req.body.username && user.password === req.body.password).length > 0) {
    res.status(200).send();
  } else {
    res.status(403).send("Datos no válidos");
  }

});

app.get("/phrases", (req, res) => {
    getPhrases (list => {
      if (req.query.keyword) {
        //filtro las frases coincidentes con la búsqueda, y muestro los primeros 5 resultados
        let phrasesResult = list.filter(phrase => phrase.includes(req.query.keyword)).slice(0,5); 
        res.json(phrasesResult);
      } 
  });
});

function getPhrases(callback) {
  fs.readFile(path.join(__dirname,"phrases.json"),"utf8", (error, data) => {
    if (error) {
      console.log("Ocurrió un error, no se pudo leer el archivo");
      callback([]);
    } else {
      callback(JSON.parse(data)); 
    }
  })
}

app.listen(4000, () => {
  console.log("Server iniciado en puerto 4000...");
});
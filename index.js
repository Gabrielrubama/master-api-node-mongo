const express = require("express");
const { conexion } = require("./basedatos/conexion.js");
const cors = require("cors");

//inicair app
console.log("App on");

//Conectar a la base de datos
conexion();

//crear servidor node
const app = express();
const puerto = 3000;

//configurar cors
app.use(cors());

//convertir body a obj Json
app.use(express.json()); //recibir datos con content-type app/json
app.use(express.urlencoded({extended:true})); //para poder utilzar x-www-form-urlencode en postman

//rutas
const rutas_Articulos = require("./rutas/articulo.js");

//cargo las rutas
app.use("/api", rutas_Articulos);

//RUtas harcodeadas
app.get("/probando", (req, res) => {
  return res.status(200).json({
    message: "Endpoint probando trabajando",
    Autor: "Gabriel Rubio",
  });
});
app.get("/", (req, res) => {
  return res.status(200).send("<h1> Probando nuevo endpoint </h1>");
});

//crear servidor y escuchar peticiones
app.listen(puerto, () => {
  console.log("Server on port " + puerto);
});

const mongoose = require("mongoose");

const conexion = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mi_blog");

    console.log("Conectado a la base de datos mi_blog!!");
  } catch (error) {
    console.log(error);
    throw new error("No se ha podido conectar a la base de datos");
  }
};

module.exports = {
  conexion
};

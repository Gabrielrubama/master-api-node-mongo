const fs = require("fs");
const path = require("path");
const { validarArticulo } = require("../helper/validar.js");
const Articulo = require("../modelos/Articulo.js");

const prueba = (req, res) => {
  return res.status(200).json({
    mensage: "Soy una prueba del controlador",
  });
};

const curso = (req, res) => {
  return res.status(200).json({
    message: "Endpoint probando trabajando",
    Autor: "Gabriel Rubio",
  });
};

const crear = (req, res) => {
  // reocoger parametros por post o guardar
  let parametros = req.body;

  //validar datos
  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      staus: "error",
      mensaje: "Faltan datos para enviar",
    });
  }

  // crear el objeto a guardar
  const articulo = new Articulo(parametros);

  //guardar en la base de datos
  articulo
    .save()
    .then((articuloGuardado) => {
      //Devolver resultados

      return res.status(200).json({
        status: "success",
        Articulo: articuloGuardado,
        mensaje: "Articulo creado con exito",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "No se ha guardado el articulo: " + error.message,
      });
    });
};

const listar = (req, res) => {
  let consulta = Articulo.find({});

  if (req.params.ultimos) {
    consulta.limit(3);
  }

  consulta
    .sort({ fecha: -1 }) // hace que el nuevo articulo creado salga de primeras
    .then((articulos) => {
      if (!articulos) {
        return res.status(404).json({
          status: "error",
          mensaje: "No se han encontrado articulos",
        });
      }
      return res.status(200).send({
        status: "success",
        parametros: req.params.ultimos,
        contador: articulos.length,
        articulos,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: "error",
        mensaje: "Ha ocurrido un error al listar los articulos",
        error: error.message,
      });
    });
};

const uno = (req, res) => {
  //id por url
  let id = req.params.id;

  //buscar articulo
  Articulo.findById(id)
    .then((articulo) => {
      // si no existe devolver error
      if (!articulo) {
        return res.status(404).json({
          status: "error",
          mensaje: "No se ha encontrado el articulo",
        });
      }

      //si existe, devolver resultado
      return res.status(200).json({
        status: "success",
        articulo,
      });
    })
    .catch((error) => {
      return res.status(404).json({
        status: "error",
        mensaje: "No se ha encontrado el articulo",
      });
    });
};

const borrar = async (req, res) => {
  let articulo_id = req.params.id;

  try {
    const articuloborrado = await Articulo.findByIdAndDelete({
      _id: articulo_id,
    });

    if (!articuloborrado) {
      return res.status(404).json({
        status: "error",
        mensaje: "Error al borrar el artículo",
      });
    }

    return res.status(200).json({
      status: "success",
      articulo: articuloborrado,
      mensaje: "Método de borrar",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al borrar el artículo",
      error: error.message,
    });
  }
};

const editar = async (req, res) => {
  let articuloId = req.params.id;
  let parametros = req.body;

  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      staus: "error",
      mensaje: "Faltan datos para enviar",
    });
  }
  try {
    const articuloActualizado = await Articulo.findOneAndUpdate(
      { _id: articuloId },
      req.body,
      { new: true }
    );

    if (!articuloActualizado) {
      return res.status(404).json({
        status: "error",
        mensaje: "Error al actualizar el artículo",
      });
    }

    return res.status(200).json({
      status: "success",
      articulo: articuloActualizado,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al actualizar el artículo",
      error: error.message,
    });
  }
};

// const subir = (req, res) => {

//   //Recoger el fichero de imagen subida
//   if (!req.file && !req.files) {
//     return res.status(400).json({
//       status: "error",
//       mensaje: "Peticion invalida",
//     });
//   }

//   //Nombre del archivo
//   let archivo = req.file.originalname;

//   //extencion del archivo
//   let archivo_split = archivo.split(".");
//   let extension = archivo_split[1];

//   //Comprobar  extension correcta
//   if (
//     extension != "png" &&
//     extension != "jpg" &&
//     extension != "jpeg" &&
//     extension != "gif"
//   ) {
//     //Borrar archivo y dar respuesta
//     fs.unlink(req.file.path, (error) => {
//       return res.status(400).json({
//         status: "error",
//         mensaje: "Archivo invalido",
//       });
//     });
//   } else {
//     let articuloId = req.params.id;

//     try {
//       const articuloActualizado = Articulo.findOneAndUpdate(
//         { _id: articuloId },
//         { imagen: req.file.filename },
//         { new: true }
//       );

//       if (!articuloActualizado) {
//         return res.status(404).json({
//           status: "error",
//           mensaje: "Error al actualizar el artículo",
//         });
//       }

//       return res.status(200).json({
//         status: "success",
//         articulo: articuloActualizado,
//         fichero: req.file,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         status: "error",
//         mensaje: "Error al actualizar el artículo",
//         error: error.message,
//       });
//     }
//   }
// };

const subir = async (req, res) => {
  try {
    //Recoger el fichero de imagen subida
    if (!req.file && !req.files) {
      return res.status(400).json({
        status: "error",
        mensaje: "Peticion invalida",
      });
    }

    //Nombre del archivo
    let archivo = req.file.originalname;

    //extencion del archivo
    let archivo_split = archivo.split(".");
    let extension = archivo_split[1];

    //Comprobar  extension correcta
    if (
      extension != "png" &&
      extension != "jpg" &&
      extension != "jpeg" &&
      extension != "gif"
    ) {
      //Borrar archivo y dar respuesta
      fs.unlink(req.file.path, (error) => {
        return res.status(400).json({
          status: "error",
          mensaje: "Archivo invalido",
        });
      });
    } else {
      let articuloId = req.params.id;

      const articuloActualizado = await Articulo.findOneAndUpdate(
        { _id: articuloId },
        { imagen: req.file.filename },
        { new: true }
      );

      if (!articuloActualizado) {
        return res.status(404).json({
          status: "error",
          mensaje: "Error al actualizar el artículo",
        });
      }

      return res.status(200).json({
        status: "success",
        articulo: articuloActualizado,
        fichero: req.file,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al actualizar el artículo",
      error: error.message,
    });
  }
};

const imagen = (req, res) => {
  let fichero = req.params.fichero;
  let ruta_fisica = "./imagenes/articulos/" + fichero;

  fs.stat(ruta_fisica, (error, existe) => {
    if (existe) {
      return res.sendFile(path.resolve(ruta_fisica));
    } else {
      return res.status(404).json({
        status: "error",
        mensaje: "La imagen no existe.",
        existe,
        fichero,
        ruta_fisica,
      });
    }
  });
};

const buscador = (req, res) => {
  let busqueda = req.params.busqueda;

Articulo.find({
  $or: [
    { titulo: { $regex: busqueda, $options: "i" } },
    { contenido: { $regex: busqueda, $options: "i" } },
  ],
})
  .sort({ fecha: -1 })
  .then((articulosEncontrados) => {
    if (!articulosEncontrados || articulosEncontrados.length <= 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se ha encontrado articulos",
      });
    }

    return res.status(200).json({
      status: "success",
      artiuclos: articulosEncontrados,
    });
  })
  .catch((error) => {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al buscar los articulos",
      error: error.message,
    });
  });
}

module.exports = {
  prueba,
  curso,
  crear,
  listar,
  uno,
  borrar,
  editar,
  subir,
  imagen,
  buscador,
};

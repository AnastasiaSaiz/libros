const express = require("express");
const mongodb = require("mongodb");
const servidor = express();
const MongoClient = mongodb.MongoClient;

servidor.use(express.static("public"));
servidor.use(express.urlencoded({ extended: false }));
servidor.use(express.json());

let db;

MongoClient.connect("mongodb://localhost:27017", function (error, client) {
    if (error !== null) {
        console.log(error);
    } else {
        db = client.db("libros");
    }
});

servidor.get("/api/libros", function (request, response) {
    db.collection("libros").find().toArray(function (error, datos) {
        if (error !== null) {
            response.send(error);
        } else response.send(datos);
    })
});

servidor.get("/api/libros/:titulo", function (request, response) {
    const titulo = request.params.titulo
    db.collection("libros").find({ titulo: titulo }).toArray(function (error, datos) {
        if (error !== null) {
            response.send(error);
        } else response.send(datos);
    })
});

servidor.post("/api/nuevoLibro/:titulo", function (request, response) {
    const titulo = request.params.titulo;
    const libro = {
        titulo,
        estado: "No leído"
    }
    db.collection("libros").insertOne(libro, function (error, datos) {
        if (error !== null) {
            response.send(error);
        } else {
            response.send(datos);
        }


    });
});

//Cambiar el libro de "no leído" a "leído"//

servidor.put("/api/editarLibro/:titulo", function (request, response) {
    const titulo = request.params.titulo;
    db.collection("libros").updateOne({ titulo: titulo }, { $set: { estado: "Leido" } }, function (error, datos) {
        if (error !== null) {
            response.send(error)
        } else {
            response.send(datos);
        }
    });

});


//metodo borrar libro//
servidor.delete("/api/borrarLibro/:titulo", function (request, response) {
    const titulo = request.params.titulo;

    db.collection("libros").deleteOne({ titulo: titulo }, function (error, datos) {
        if (error !== null) {
            response.send(error)
        } else {
            response.send(datos);
        }
    })
});





servidor.listen(3000);
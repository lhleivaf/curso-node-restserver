const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.usuariosPath = '/api/usuarios';

        // Middlewares
        this.middlewares();

        // Rutas de la aplicación
        this.routes();
    }

    middlewares() { // (funciones que añaden otra funcionalidad al WebServer)

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/usuario'));



        // this.app.get('/api', (req, res) => {
        //     res.status(403).json({msg: 'get API'});
        //     //res.json('Hello World yox 2');
        //   });

        // this.app.get('/api', (req, res) => {
        //     res.json({msg: 'get API'});
        // });

        // this.app.put('/api', (req, res) => {
        //     res.status(500).json({msg: 'put API'});
        //     //res.json('Hello World yox 2');
        // });

        // this.app.post('/api', (req, res) => {
        //     res.status(201).json({msg: 'post API'});
        //     //res.json('Hello World yox 2');
        // });
        
        // this.app.delete('/api', (req, res) => {
        //     res.json({msg: 'delete API'});
        // });

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });

    }

}

module.exports = Server;

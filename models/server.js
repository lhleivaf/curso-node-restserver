const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const {bdConn} = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.paths = {
            auth: '/api/auth', 
            buscar: '/api/buscar', 
            categorias: '/api/categorias', 
            productos: '/api/productos', 
            uploads: '/api/uploads', 
            usuarios: '/api/usuarios' 
        };
        // this.usuariosPath = '/api/usuarios';
        // this.authPath = 'usuarios';

        // Conectar a base de datos
        this.conectarBD();
        
        // Middlewares
        this.middlewares();

        // Rutas de la aplicación
        this.routes();
    }

    async conectarBD() {
        await bdConn();
    }

    middlewares() { // (funciones que añaden otra funcionalidad al WebServer)

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'));

        // Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
        this.app.use(this.paths.usuarios, require('../routes/usuario'));
        // this.app.use(this.authPath, require('../routes/auth'));
        // this.app.use(this.usuariosPath, require('../routes/usuario'));

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
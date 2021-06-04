const express = require('express')
const cors = require('cors')

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT

        this.paths = {
            vehicleType: '/api/vehicleType',
            vehicleParking: '/api/vehicleParking',
        }

        // Conectar a bd
        this.cocectarBD()

        // Middleware
        this.middelware()

        // Rutas de la app
        this.routes()
    }

    async cocectarBD() {
        // await dbConnection()
        require('../database/config')
    }

    middelware() {
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use( express.json() )
    }

    routes() {
        this.app.use(this.paths.vehicleType, require('../routes/vehicleType'))
        this.app.use(this.paths.vehicleParking, require('../routes/vehicleParking'))
    }

    listen() {
        this.server = this.app.listen(this.port, () => {
            console.log(`Server corriendo en el puerto ${this.port}`);
        })
    }
}

module.exports = Server;
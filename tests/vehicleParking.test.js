const supertest = require('supertest');

const server = require('../app')
const Database = require('./helpers/databaseControllerTest')

const app = server.app

const api = supertest(app)

const OLD_ENV = process.env;

beforeAll( async () => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
    // delete process.env.NODE_ENV

    // Se borra la informacion de la BD de TEST
    const database = new Database()
    await database.deleteCollection('vehicleParking')
    // await database.deleteCollection('purse')
    
    // Se agrega data por default
    await database.createCollection('vehicleParking')
});

describe('GET getvehicleParking', () => {
    const URL = `/api/vehicleParking/getvehicleParking`

    const data = {
        limit: 2
    }

    test('Se espera recibir un status 200', async () => {
        await api.post(URL)
            .send(data)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('Se espera que el tamaño de la data sea el indicado en el limite', async () => {
        const response = await api.post(URL)
            .send(data)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.data).toHaveLength(data.limit)
    })
})

afterAll ( () => {
    process.env = OLD_ENV
    server.server.close()
})
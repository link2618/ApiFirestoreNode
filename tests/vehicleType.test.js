const supertest = require('supertest');

const server = require('../app')
const Database = require('./helpers/databaseControllerTest')

const app = server.app

const api = supertest(app)

const OLD_ENV = process.env;
const idEdit = []

beforeAll( async () => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
    delete process.env.NODE_ENV

    // Se borra la informacion de la BD de TEST
    const database = new Database()
    await database.deleteCollection('vehicleType')
    
    // Se agrega data por default
    await database.createCollection('vehicleType')
});

describe('GET vehicleType', () => {
    const URL = '/api/vehicleType/getType'

    test('getType Se espera status 200', async () => {
        await api.get(URL)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('getType Si contiene data en respuesta', async () => {
        const response = await api.get(URL)
        expect(response.body.data)
    })
})

describe('POST vehicleType createType', () => {
    const URL = '/api/vehicleType/createType'

    const data = {
        type_name: 'CARRO',
        maximum_capacity: 5,
        current_capacity: 0
    }

    test('Se espera status 400 al no enviar data', async () => {
        await api.post(URL)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

    test('Se valida si no deja registrar tipo existente status 200', async () => {
        await api.post(URL)
            .send(data)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('Se valida si no deja registrar tipo existente "Ya esta registrado"', async () => {
        const response = await api.post(URL)
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)

        expect(response.body.message).toBe(`Ya esta registrado '${data.type_name}'`)
    })

    test('Se valida si el registro de un nuevo tipo retorna 201, si contiene data y el nombre este en mayuscula', async () => {
        const newType = {
            type_name: "nuevo",
            maximum_capacity: 20,
            current_capacity: 0
        }
        const response = await api.post(URL)
            .send(newType)
            .set('Accept', 'application/json')
            .expect(201)
            .expect('Content-Type', /application\/json/)
        expect(response.body.data)
        expect(response.body.data.type_name).toBe(newType.type_name.toUpperCase())

        // Se guarda id para prueba de editar
        idEdit.push(response.body.data.id)
    })

})

describe('PUT vehicleType updateType', () => {
    let URL = `/api/vehicleType/updateType/`

    const dataUpdateType = {
        maximum_capacity: 10
    }

    test('Se valida resultado de actualizacion status 200 y message "Success update"', async () => {
        URL = `${URL}${idEdit[0]}`
        const response = await api.put(URL)
            .send(dataUpdateType)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body).toStrictEqual({ ok: true, message: 'Success update' })
    })
})

describe('DELETE vehicleType deleteType', () => {
    let URL = `/api/vehicleType/deleteType/`

    test('Se valida resultado de eliminar status 200 y message "Success delete"', async () => {
        URL = `${URL}${idEdit[0]}`
        const response = await api.delete(URL)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body).toStrictEqual({ ok: true, message: 'Success delete' })
    })
})

afterAll ( () => {
    process.env = OLD_ENV
    server.server.close()
})
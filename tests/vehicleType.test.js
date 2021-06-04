const supertest = require('supertest');

const server = require('../app')
const app = server.app

const api = supertest(app)

// beforeAll(() => {
// });

describe('GET vehicleType', () => {
    const URL = '/api/vehicleType/getType'

    test('getType Se espera status 200', async () => {
        await api.get(URL)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('getType Si contiene data en respuesta', async () => {
        const response = await api.get(URL)
        expect(response.body).toEqual({ok: true, message: 'Success', data: []})
    })
})

describe('POST vehicleType', () => {
    const URL = '/api/vehicleType/createType'

    const data = {
        type_name: 'Test',
        maximum_capacity: 5,
        current_capacity: 0
    }

    test('createType Se espera status 400 al no enviar data', async () => {
        await api.post(URL)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

    test('createType Se espera status 201', async () => {
        await api.post(URL)
            .send(data)
            .set('Accept', 'application/json')
            .expect(201)
            .expect('Content-Type', /application\/json/)
    })
})

afterAll ( () => {
    server.server.close()
})
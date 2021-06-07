const supertest = require('supertest');

const server = require('../app')
const Database = require('./helpers/databaseControllerTest')
const db = require('../database/config');
const retornarDatos = require('../helpers/retornar-datos');

const app = server.app

const api = supertest(app)

const OLD_ENV = process.env;
const vehicleTypeRef = db.collection('vehicleType')
const vehicleParkingRef = db.collection('vehicleParking')
const purseRef = db.collection('purse')

beforeAll( async () => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
    // delete process.env.NODE_ENV

    // Se borra la informacion de la BD de TEST
    const database = new Database()
    await database.deleteCollection('vehicleType')
    await database.deleteCollection('vehicleParking')
    await database.deleteCollection('purse')
    
    // Se agrega data por default
    await database.createCollection('vehicleType')
    await database.createCollection('vehicleParking')
});

describe('GET getvehicleParking', () => {
    const URL = `/api/vehicleParking/getvehicleParking`

    const data = {
        limit: 2
    }

    const dataFiltro = {
        limit: 2,
        type: 'CARRO'
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

    test('Se traen aplicando el filtro con carro, se esperan 3 registros', async () => {
        const response = await api.post(URL)
            .send(dataFiltro)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.size).toBe(3)
    })
})

describe('POST createvehicleParking', () => {
    const URL = `/api/vehicleParking/createvehicleParking`

    test('Se valida que no deje crear el registro si el cupo esta lleno', async () => {
        const snapType = await vehicleTypeRef.get()
        const types = await retornarDatos(snapType)

        const car = types.filter( item => item.type_name == 'CARRO')
        // const mot = types.filter( item => item.type_name == 'MOTO')

        const dataNewFull = {
            plates_vehicle: "7a5sd4f",
            doc_owner: "546987123",
            name_owner: "Dueño",
            type_vehicle: "CARRO",
            id_type_vehicle: car[0].id
        }
        
        const response = await api.post(URL)
            .send(dataNewFull)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        expect(response.body.message).toBe(`Ya se alcanzo la capacidad maxima de ese tipo de vehiculo (3)`)
    })

    test('Se valida registro exitoso se espera status 201 y message "Success"', async () => {
        const snapType = await vehicleTypeRef.get()
        const types = await retornarDatos(snapType)

        const mot = types.filter( item => item.type_name == 'MOTO')

        const dataNew = {
            plates_vehicle: "7a5sd4f",
            doc_owner: "546987123",
            name_owner: "Dueño",
            type_vehicle: "MOTO",
            id_type_vehicle: mot[0].id
        }
        
        const response = await api.post(URL)
            .send(dataNew)
            .set('Accept', 'application/json')
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        expect(response.body.message).toBe('Success')
    })

    test('Se valida el incremento de la capacidad ocupada', async () => {
        const snapType = await vehicleTypeRef.where('type_name', '==', 'MOTO' ).get()
        const types = await retornarDatos(snapType)

        const cantidadAntes = types[0].current_capacity

        const dataNew = {
            plates_vehicle: "7a5sdf4",
            doc_owner: "546987123",
            name_owner: "Dueño prueba",
            type_vehicle: "MOTO",
            id_type_vehicle: types[0].id
        }
        
        const response = await api.post(URL)
            .send(dataNew)
            .set('Accept', 'application/json')
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const snapType2 = await vehicleTypeRef.where('type_name', '==', 'MOTO' ).get()
        const types2 = await retornarDatos(snapType2)

        const cantidadDespues = types2[0].current_capacity
        
        expect(cantidadDespues).toBe(cantidadAntes + 1)
    })

    test('Se valida registrar vehiculo ya registrado', async () => {
        const dataNew = {
            plates_vehicle: "7a5sdf4",
            doc_owner: "546987123",
            name_owner: "Dueño prueba",
            type_vehicle: "MOTO",
            id_type_vehicle: "ID de tipo de dato no existe"
        }
        
        const response = await api.post(URL)
            .send(dataNew)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        expect(response.body.message).toBe(`Ya esta registrado '${dataNew.plates_vehicle}'`)
    })

    test('Se valida registrar un ingreso con un tipo no existente', async () => {
        const dataNew = {
            plates_vehicle: "7assdf4",
            doc_owner: "546987123",
            name_owner: "Dueño prueba",
            type_vehicle: "MOTO",
            id_type_vehicle: "ID de tipo de dato no existe"
        }
        
        const response = await api.post(URL)
            .send(dataNew)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        expect(response.body.message).toBe('No existe el tipo de vehiculo ingresado')
    })
})

describe('PUT updatevehicleParking', () => {

    test('Se actualiza un registro con exito status 200 y mensaje de respuesta', async () => {
        const dataUpdate = {
            plates_vehicle: "7a5sdf4",
            doc_owner: "546987123",
            name_owner: "Dueño actualizado"
        }

        const snap = await vehicleParkingRef.where('plates_vehicle', '==', dataUpdate.plates_vehicle.toUpperCase()).get()
        const existe = await retornarDatos(snap)

        const URL = `/api/vehicleParking/updatevehicleParking/${existe[0].id}`
        
        const response = await api.put(URL)
            .send(dataUpdate)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        expect(response.body.message).toBe('Success update')
    })
})

describe('DELETE exitvehicleParking', () => {

    let URL = `/api/vehicleParking/exitvehicleParking/` 

    test('Se elimina registro se espera status 200 y mensaje "Success exit"', async () => {
        plates_vehicle = "7a5sdf4".toUpperCase()

        const snap = await vehicleParkingRef.where('plates_vehicle', '==', plates_vehicle.toUpperCase()).get()
        const existe = await retornarDatos(snap)

        URL += existe[0].id

        const snapType = await vehicleTypeRef.where('type_name', '==', 'MOTO' ).get()
        const types = await retornarDatos(snapType)

        const idType = types[0].id

        const data = {
            plates_vehicle,
            pay: 1000,
            id_type_vehicle: idType
        }
        
        const response = await api.put(URL)
            .send(data)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        expect(response.body.message).toBe('Success exit')
    })

    test('Se valida que baje la capacidad ocupada', async () => {
        plates_vehicle = "7a5sd4f".toUpperCase()

        const snap = await vehicleParkingRef.where('plates_vehicle', '==', plates_vehicle.toUpperCase()).get()
        const existe = await retornarDatos(snap)

        URL += existe[0].id

        const snapType = await vehicleTypeRef.where('type_name', '==', 'MOTO' ).get()
        const types = await retornarDatos(snapType)

        const idType = types[0].id
        const cantidadAntes = types[0].current_capacity

        const data = {
            plates_vehicle,
            pay: 5000,
            id_type_vehicle: idType
        }
        
        const response = await api.put(URL)
            .send(data)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const snapType2 = await vehicleTypeRef.where('type_name', '==', 'MOTO' ).get()
        const types2 = await retornarDatos(snapType2)

        const cantidadDespues = types2[0].current_capacity
        
        expect(cantidadDespues).toBe(cantidadAntes - 1)
    })

    test('Se valida que los registros guardados en purse sean 2', async () => {
        const snap = await purseRef.get()
        const purse = await retornarDatos(snap)
        
        expect(purse).toHaveLength(2)
    })
})

afterAll ( () => {
    process.env = OLD_ENV
    server.server.close()
})
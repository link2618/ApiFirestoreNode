const moment = require('moment')

const db = require('../database/config');
const retornarDatos = require('../helpers/retornar-datos');

const vehicleParking = {}
const vehicleParkingRef = db.collection('vehicleParking')
const vehicleTypeRef = db.collection('vehicleType')
const purseRef = db.collection('purse')

vehicleParking.getvehicleParking = async (req, res) => {

    try {
        let {lastPlates = null, fistPlates = null, limit, type = null} = req.body
        let fistDocument = null
        let lastDocument = null

        let size
        (!type) 
        ? size = await vehicleParkingRef.get()
        : size = await vehicleParkingRef.where('type_vehicle', '==', type).get()

        size = size.size

        if(fistPlates) {
            // Para ir a la pagina anterior
            const doc = await vehicleParkingRef.where('plates_vehicle', '==', fistPlates.toUpperCase()).get()
            const temp = await retornarDatos(doc)
            if(temp)
                fistDocument = await doc.docs[0]

            let snap
            (!type) 
            ? snap = await vehicleParkingRef.orderBy('initial_date').endBefore(fistDocument).limitToLast(limit).get()
            : snap = await vehicleParkingRef.where('type_vehicle', '==', type).orderBy('initial_date').endBefore(fistDocument).limitToLast(limit).get()
            const data = await retornarDatos(snap)
    
            return res.json({ ok: true, message: 'Success', size, data })
        } else if(lastPlates) {
            const doc = await vehicleParkingRef.where('plates_vehicle', '==', lastPlates.toUpperCase()).get()
            const temp = await retornarDatos(doc)
            if(temp)
                lastDocument = await doc.docs[0]

        }

        // Se deja fuera del else if para la primera pagina y se crea contenido con filtro de tipo o sin filtro
        let snap
        (!type) 
        ? snap = await vehicleParkingRef.orderBy('initial_date').startAfter(lastDocument).limit(limit).get()
        : snap = await vehicleParkingRef.where('type_vehicle', '==', type).orderBy('initial_date').startAfter(lastDocument).limit(limit).get()
        const data = await retornarDatos(snap)
        // lastDocument = await snap.docs[snap.docs.length-1]

        res.json({ ok: true, message: 'Success', size, data })
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false,message: 'fail' })
    }

}

vehicleParking.createvehicleParking = async (req, res) => {

    const {plates_vehicle, doc_owner, name_owner, type_vehicle, id_type_vehicle} = req.body

    try {
        const vehicle = {
            plates_vehicle: plates_vehicle.toUpperCase(),
            doc_owner,
            name_owner,
            type_vehicle,
            id_type_vehicle,
            initial_date: moment().format(process.env.DATE_FORMAT),
        }

        // Se valida si existe algun registro con la placa recibida
        const snap = await vehicleParkingRef.where('plates_vehicle', '==', plates_vehicle.toUpperCase()).get()
        const existe = await retornarDatos(snap)

        if(existe.length > 0) 
            return res.json({ ok: true, message: `Ya esta registrado '${plates_vehicle}'` })
        
        // Se valida si existe el tipo de vehiculo
        const snapType = await vehicleTypeRef.get()
        const types = await retornarDatos(snapType)
        const existeType = types.filter( item => item.id == id_type_vehicle)

        if(existeType.length == 0) 
            return res.json({ ok: true, message: `No existe el tipo de vehiculo ingresado` })

        // Se valida si se tiene cupo 
        const {current_capacity, maximum_capacity, id} = existeType[0]

        if (maximum_capacity <= current_capacity)
            return res.json({ ok: true, message: `Ya se alcanzo la capacidad maxima de ese tipo de vehiculo (${maximum_capacity})` })
        
        const update = {
            current_capacity: current_capacity + 1
        }

        // Se actualiza la capacidad actual
        await vehicleTypeRef.doc(id).update(update)

        // Se registra eñ vehiculo
        const resp = await vehicleParkingRef.add(vehicle)

        // Se agraga id al objeto ya existente
        Object.defineProperty(vehicle, "id", {
            value: resp.id,
            writable: true,
            enumerable: true,
            configurable: true
        })

        res.status(201).json({ ok: true, message: 'Success', data: vehicle })
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false,message: 'fail' })
    }

}

vehicleParking.updatevehicleParking = async (req, res) => {

    try {
        const { id } = req.params;
        const { plates_vehicle, doc_owner, name_owner } = req.body;

        const update = {
            plates_vehicle: plates_vehicle.toUpperCase(),
            doc_owner,
            name_owner
        }

        // Se valida si existe algun registro con la placa recibida
        const snap = await vehicleParkingRef.where('plates_vehicle', '==', plates_vehicle.toUpperCase()).get()
        const existe = await retornarDatos(snap)

        if(existe.length > 0 && id !== existe[0].id) 
            return res.json({ ok: true, message: `Ya esta registrado '${plates_vehicle}'` })

        await vehicleParkingRef.doc(id).update(update)
        res.json({ ok: true, message: 'Success update' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false,message: 'fail' })
    }

}

vehicleParking.exitvehicleParking = async (req, res) => {

    try {
        const { id } = req.params;
        const { plates_vehicle, pay, id_type_vehicle } = req.body;

        const data = {
            plates_vehicle: plates_vehicle.toUpperCase(),
            pay,
            date: moment().format(process.env.DATE_FORMAT)
        }

        await purseRef.add(data)
        await vehicleParkingRef.doc(id).delete()
        
        const snapType = await vehicleTypeRef.get()
        const types = await retornarDatos(snapType)
        const existeType = types.filter( item => item.id == id_type_vehicle)
        const { current_capacity } = existeType[0]

        const update = {
            current_capacity: current_capacity - 1
        }

        // Se actualiza la capacidad actual
        await vehicleTypeRef.doc(id_type_vehicle).update(update)
        
        res.json({ ok: true, message: 'Success exit' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false,message: 'fail' })
    }

}

module.exports = vehicleParking
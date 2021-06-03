const db = require('../database/config');
const retornarDatos = require('../helpers/retornar-datos');

const vehicleType = {}
const vehicleTypeRef = db.collection('vehicleType')

vehicleType.getType = async (req, res) => {

    try {
        const snap = await vehicleTypeRef.get()
        const data = await retornarDatos(snap)

        res.json({ ok: true, message: 'Success', data })
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false,message: 'fail' })
    }

}

vehicleType.createType = async (req, res) => {
    const {type_name, maximum_capacity, current_capacity = 0} = req.body;

    try {
        const createType = {
            type_name: type_name.toUpperCase(),
            maximum_capacity,
            current_capacity,
        }

        // Se valida si existe algun registro con el nombre recibido
        vehicleTypeRef.where('type_name', '==', type_name.toUpperCase()).get()
        .then( async (snap) => {
            const existe = await retornarDatos(snap)

            if(existe.length > 0) 
                return res.json({ ok: true, message: `Ya esta registrado '${type_name}'` })
            
            const resp = await vehicleTypeRef.add(createType)

            // Se agraga id al objeto ya existente
            Object.defineProperty(createType, "id", {
                value: resp.id,
                writable: true,
                enumerable: true,
                configurable: true
            })
    
            res.status(201).json({ ok: true, message: 'Success', data: createType })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false,message: 'fail' })
    }

}

vehicleType.updateType = async (req, res) => {

    try {
        const { id } = req.params;
        const { maximum_capacity } = req.body;

        const update = {
            maximum_capacity
        }

        await vehicleTypeRef.doc(id).update(update)
        
        res.json({ ok: true, message: 'Success update' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false,message: 'fail' })
    }

}

vehicleType.deleteType = async (req, res) => {

    try {
        const { id } = req.params;

        await vehicleTypeRef.doc(id).delete()

        res.json({ ok: true, message: 'Success delete' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false,message: 'fail' })
    }

}

module.exports = vehicleType
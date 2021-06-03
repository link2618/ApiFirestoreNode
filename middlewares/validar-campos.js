const { check, validationResult } = require('express-validator');

const validarCampos = {} 

validarCampos.validate = (method) => {
    switch (method) {
        case 'createType': {
            return [
                check('type_name', 'El type_name es obligatorio.').not().isEmpty(),
                check('maximum_capacity', 'El maximum_capacity es obligatorio.').not().isEmpty(),
                check('current_capacity', 'El current_capacity es obligatorio.').not().isEmpty(),
            ]
        }
        case 'updateType': {
            return [
                check('maximum_capacity', 'El maximum_capacity es obligatorio.').not().isEmpty(),
            ]
        }
        case 'getvehicleParking': {
            return [
                check('limit', 'El limit es obligatorio.').not().isEmpty(),
            ]
        }
        case 'createvehicleParking': {
            return [
                check('plates_vehicle', 'El plates_vehicle es obligatorio.').not().isEmpty(),
                check('doc_owner', 'El doc_owner es obligatorio.').not().isEmpty(),
                check('name_owner', 'El name_owner es obligatorio.').not().isEmpty(),
                check('type_vehicle', 'El type_vehicle es obligatorio.').not().isEmpty(),
                check('id_type_vehicle', 'El id_type_vehicle es obligatorio.').not().isEmpty(),
            ]
        }
        case 'updatevehicleParking': {
            return [
                check('plates_vehicle', 'El plates_vehicle es obligatorio.').not().isEmpty(),
                check('doc_owner', 'El doc_owner es obligatorio.').not().isEmpty(),
                check('name_owner', 'El name_owner es obligatorio.').not().isEmpty(),
            ]
        }
        case 'exitvehicleParking': {
            return [
                check('plates_vehicle', 'El plates_vehicle es obligatorio.').not().isEmpty(),
                check('pay', 'El pay es obligatorio.').not().isEmpty(),
                check('id_type_vehicle', 'El id_type_vehicle es obligatorio.').not().isEmpty(),
            ]
        }
    }
}

validarCampos.validarCamposObligatorios = ( req, res, next ) => {
    const errors = validationResult(req);    
    if (!errors.isEmpty()) {        
        return res.status(400).json(errors);    
    }

    next()
}

module.exports = validarCampos

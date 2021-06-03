const { Router } = require('express')
const validarCampos = require('../middlewares/validar-campos')
const vehicleParking = require('../controllers/vehicleParking')

const router = Router()

router.post('/getvehicleParking', validarCampos.validate('getvehicleParking'), validarCampos.validarCamposObligatorios, vehicleParking.getvehicleParking)
router.post('/createvehicleParking', validarCampos.validate('createvehicleParking'), validarCampos.validarCamposObligatorios, vehicleParking.createvehicleParking)
router.put('/updatevehicleParking/:id', validarCampos.validate('updatevehicleParking'), validarCampos.validarCamposObligatorios, vehicleParking.updatevehicleParking)
router.put('/exitvehicleParking/:id', validarCampos.validate('exitvehicleParking'), validarCampos.validarCamposObligatorios, vehicleParking.exitvehicleParking)

module.exports = router
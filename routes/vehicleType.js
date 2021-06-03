const { Router } = require('express')
const validarCampos = require('../middlewares/validar-campos')
const vehicleType = require('../controllers/vehicleType')

const router = Router()

router.get('/getType', vehicleType.getType)
router.post('/createType', validarCampos.validate('createType'), validarCampos.validarCamposObligatorios, vehicleType.createType)
router.put('/updateType/:id', validarCampos.validate('updateType'), validarCampos.validarCamposObligatorios, vehicleType.updateType)
router.delete('/deleteType/:id', vehicleType.deleteType)

module.exports = router
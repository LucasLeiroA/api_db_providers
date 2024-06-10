// backend/routes/providerRoutes.js
const express = require('express');
const {
    createProvider,
    addDebt,
    addPayment,
    getProvider,
    getAllProviders,
    deleteDebt,
    deletePayment,
    deleteProvider
} = require('../controllers/providerController');

const router = express.Router();

router.post('/', createProvider);
router.post('/:id/debts', addDebt);
router.post('/:id/payments', addPayment);
router.get('/:id', getProvider);
router.delete('/:id' , deleteProvider )
router.get('/', getAllProviders);
router.delete('/:id/debts/:debtId', deleteDebt);
router.delete('/:id/payments/:paymentId', deletePayment);
module.exports = router;

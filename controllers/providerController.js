// backend/controllers/providerController.js
const Provider = require('../models/providerModel');

const createProvider = async (req, res, next) => {
    try {
        const { name, contact_info } = req.body;
        const newProvider = new Provider({ name, contact_info });
        await newProvider.save();
        res.status(201).send(newProvider);
    } catch (error) {
        next(error);
    }
};



const addDebt = async (req, res, next) => {
    try {
        const { id } = req.params;
        let { amount,  description } = req.body;

        // Convertir amount a un número
        amount = parseFloat(amount);
        
        const provider = await Provider.findById(id);
        if (!provider) {
            return res.status(404).send('Proveedor no encontrado');
        }
        const date = new Date();
        provider.debt_details.push({ amount, date, description });
        provider.total_debt += amount;
        
        await provider.save();
        res.send(provider);
    } catch (error) {
        next(error);
    }
};


const addPayment = async (req, res, next) => {
    try {
        const { id } = req.params;
        let { amount, description } = req.body;
        
        // Convertir amount a un número
        amount = parseFloat(amount);
        
        const provider = await Provider.findById(id);
        if (!provider) {
            return res.status(404).send('Proveedor no encontrado');
        }
        const date = new Date();
        provider.payment_details.push({ amount, date, description });

        // Convertir total_payments a un número y sumarle amount
        provider.total_payments = parseFloat(provider.total_payments) + amount;

        // Convertir total_debt a un número y restarle amount
        provider.total_debt = parseFloat(provider.total_debt) - amount;
        
        await provider.save();
        res.send(provider);
    } catch (error) {
        next(error);
    }
};

const getProvider = async (req, res, next) => {
    try {
        const { id } = req.params;
        const provider = await Provider.findById(id);
        if (!provider) {
            return res.status(404).send('Proveedor no encontrado');
        }
        res.send(provider);
    } catch (error) {
        next(error);
    }
};
const getAllProviders = async (req, res, next) => {
    try {
        const providers = await Provider.find();
        res.send(providers);
    } catch (error) {
        next(error);
    }
};



const deleteDebt = async (req, res, next) => {
    try {
        const { id, debtId } = req.params;
        
        const provider = await Provider.findById(id);
        if (!provider) {
            return res.status(404).send('Proveedor no encontrado');
        }
        
        const debt = provider.debt_details.id(debtId);
        if (!debt) {
            return res.status(404).send('Deuda no encontrada');
        }
        
        // Restar el monto de la deuda eliminada del total de deudas
        provider.total_debt -= debt.amount;
        
        // Encuentra el índice del subdocumento y elimínalo del array
        const debtIndex = provider.debt_details.findIndex(d => d._id.equals(debtId));
        provider.debt_details.splice(debtIndex, 1);
        
        await provider.save();
        res.send(provider);
    } catch (error) {
        next(error);
    }
};


const deletePayment = async (req, res, next) => {
    try {
        const { id, paymentId } = req.params;
        
        const provider = await Provider.findById(id);
        if (!provider) {
            return res.status(404).send('Proveedor no encontrado');
        }
        
        const payment = provider.payment_details.id(paymentId);
        if (!payment) {
            return res.status(404).send('Pago no encontrado');
        }
        
        provider.total_payments -= payment.amount;
        provider.total_debt += payment.amount;
        
        // Encuentra el índice del subdocumento y elimínalo del array
        const paymentIndex = provider.payment_details.findIndex(p => p._id.equals(paymentId));
        provider.payment_details.splice(paymentIndex, 1);
        
        await provider.save();
        res.send(provider);
    } catch (error) {
        next(error);
    }
};

const deleteProvider = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Eliminar el proveedor por su ID
        await Provider.findByIdAndDelete(id);
        
        // Recuperar la lista actualizada de proveedores después de la eliminación
        const remainingProviders = await Provider.find();
        console.log(remainingProviders);
        res.status(201).send(remainingProviders); // Responder con un código 204 (Sin contenido) y la lista de proveedores actualizada
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProvider,
    addDebt,
    addPayment,
    getProvider,
    getAllProviders,
    deleteDebt,
    deletePayment,
    deleteProvider
};


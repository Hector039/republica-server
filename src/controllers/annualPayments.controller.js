import CustomError from "../tools/customErrors/customError.js";
import TErrors from "../tools/customErrors/enum.js";
//import { client } from "./utils.controller.js"


export default class AnnualPaymentsController {
    constructor(annualPaymentsService, usersService) {
        this.annualPaymentsService = annualPaymentsService;
        this.usersService = usersService;
    }

    getHistoryPayments = async (req, res, next) => {
        const { uid } = req.params;
        try {
            const user = await this.usersService.getUser(uid);
            if (!user.length) {
                CustomError.createError({
                    message: `Usuario de ID: ${uid} no encontrado.`,
                    code: TErrors.NOT_FOUND,
                });
            }
            const paymentsHistory = await this.annualPaymentsService.getHistoryPayments(uid);
            res.status(200).send(paymentsHistory);
        } catch (error) {
            next(error)
        }
    }

    addPayment = async (req, res, next) => {
        const { uid, year, payDate, amount } = req.body;
        try {
            if (!uid || !year || !amount) {
                CustomError.createError({
                    message: "Datos no recibidos o inválidos.",
                    code: TErrors.INVALID_TYPES,
                });
            }
            const user = await this.usersService.getUser(uid);
            if (!user.length) {
                CustomError.createError({
                    message: `Usuario de ID: ${uid} no encontrado.`,
                    code: TErrors.NOT_FOUND,
                });
            }
            const annualFee = await this.annualPaymentsService.getAnnualFee();
            
            const paymentExists = await this.annualPaymentsService.checkPayment(uid, year);
            
            if (paymentExists.length > 0 && paymentExists[0].is_complete === 1) {
                CustomError.createError({
                    message: `El pago del año ${year} ya existe.`,
                    code: TErrors.CONFLICT,
                });
            } else if (paymentExists.length > 0 && paymentExists[0].is_complete === 0) {
                if (annualFee[0].amount > (parseInt(amount) + paymentExists[0].amount)) {
                    await this.annualPaymentsService.updatePayment(paymentExists[0].id_payment, payDate, parseInt(amount) + paymentExists[0].amount);
                    await this.annualPaymentsService.updatePaymentHistory(paymentExists[0].id_payment, payDate, parseInt(amount));
                    return res.status(200).send();
                } else if (annualFee[0].amount <= (parseInt(amount) + paymentExists[0].amount)) {
                    await this.annualPaymentsService.updatePayment( paymentExists[0].id_payment, payDate, parseInt(amount) + paymentExists[0].amount);
                    await this.annualPaymentsService.closePayment(paymentExists[0].id_payment);
                    await this.annualPaymentsService.updatePaymentHistory(paymentExists[0].id_payment, payDate, parseInt(amount));
                    return res.status(200).send(`Se saldó la matrícula del año ${year}`);
                }
            }

            await this.annualPaymentsService.addPayment(uid, year, payDate);
            const newPayment = await this.annualPaymentsService.checkPayment(uid, year);
            await this.annualPaymentsService.updatePayment(newPayment[0].id_payment, payDate, parseInt(amount));
            await this.annualPaymentsService.updatePaymentHistory(newPayment[0].id_payment, payDate, parseInt(amount));
            console.log(annualFee[0].amount, newPayment[0].amount);
            
            if (annualFee[0].amount <= amount) {
                await this.annualPaymentsService.closePayment(newPayment[0].id_payment);
                return res.status(200).send(`Se saldó la matrícula del año ${year}`);
            }
            res.status(200).send();
        } catch (error) {
            next(error)
        }
    }

    getDebtorsHistory = async (req, res, next) => {
        const { year } = req.params;
        try {
            const debtors = await this.annualPaymentsService.getDebtorsHistory(year);
            res.status(200).send(debtors);
        } catch (error) {
            next(error)
        }
    }

    getDayTotalPayments = async (req, res, next) => {
        const { day } = req.body;
        try {
            const dayPayments = await this.annualPaymentsService.getDayTotalPayments(day);
            if (!dayPayments.length) {
                CustomError.createError({
                    message: `No se registraron pagos en la fecha indicada.`,
                    code: TErrors.NOT_FOUND,
                });
            }
            res.status(200).send(dayPayments);
        } catch (error) {
            next(error)
        }
    }


    notifyDebtor = async (req, res, next) => {
        const { uid, date } = req.params;

        try {
            if (!uid || !date) {
                CustomError.createError({
                    message: "Datos no recibidos o inválidos.",
                    code: TErrors.INVALID_TYPES,
                });
            }
            const user = await this.usersService.getUser(uid);
            if (!user.length) {
                CustomError.createError({
                    message: `El usuario de ID ${uid} no encontrado.`,
                    code: TErrors.NOT_FOUND,
                });
            }
            const debtHistory = await this.annualPaymentsService.getUserDebtInfo(uid, date);
            console.log(debtHistory);
            
            if (debtHistory.length === 0) {
                return res.status(200).send(null)
            }
            let debtList = [];

            debtHistory.forEach(debt => {
                debtList.push(` ${debt.year_paid}`)
            });

            res.status(200).send(`Les recordamos que esta adeudando el pago correspondiente al/los año/s: ${debtList}`)
            //const chatId = `${user[0].tel_contact}@c.us`;
            //await client.sendMessage(chatId, `Estimado usuario, queremos recordarle que posee retraso/s de su cuota anual. Por favor regularice su situación. Detalle: ${debtList}`);
        } catch (error) {
            next(error)
        }
    }

    notifyAllDebtors = async (req, res, next) => {
        const { debtorsArray, date } = req.body;
        try {
            if (!debtorsArray.length) {
                CustomError.createError({
                    message: `No se recibió listado de deudores.`,
                    code: TErrors.NOT_FOUND,
                });
            }
            debtorsArray.forEach(async debtor => {
                const debtHistory = await this.annualPaymentsService.getUserDebtInfo(debtor.id_user, date);
                let debtList = [];
                debtHistory.forEach(debt => {
                    debtList.push(`Año: ${debt.year_paid}`)
                });
                const chatId = `${debtor.tel_contact}@c.us`;
                await client.sendMessage(chatId, `Estimado usuario, queremos recordarle que posee retraso/s de su cuota anual. Por favor regularice su situación. Detalle: ${debtList}`);
            });
            res.status(200).send();
        } catch (error) {
            next(error)
        }
    }

    getUserDebtHistory = async (req, res, next) => {
        const { uid } = req.params;
        try {
            const user = await this.usersService.getUser(uid);
            if (!user.length) {
                CustomError.createError({
                    message: `El usuario de ID ${uid} no encontrado.`,
                    code: TErrors.NOT_FOUND,
                });
            }
            const debtHistory = await this.annualPaymentsService.getUserDebtHistory(uid);
            res.status(200).send(debtHistory);
        } catch (error) {
            next(error)
        }
    }

}
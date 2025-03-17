import CustomError from "../tools/customErrors/customError.js";
import TErrors from "../tools/customErrors/enum.js";
//import { client } from "./utils.controller.js"

export default class MothlyPaymentsController {
    constructor(monthlyPaymentsService, usersService) {
        this.monthlyPaymentsService = monthlyPaymentsService;
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
            const paymentsHistory = await this.monthlyPaymentsService.getHistoryPayments(uid);
            res.status(200).send(paymentsHistory);
        } catch (error) {
            next(error)
        }
    }

    addPayment = async (req, res, next) => {
        const { uid, month, year, payDate, amount } = req.body;
        try {
            if (!uid || !month || !year || !amount) {
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

            const paymentExists = await this.monthlyPaymentsService.checkPayment(uid, month, year);            
            if (paymentExists.length > 0 && paymentExists[0].is_complete === 1) {
                CustomError.createError({
                    message: `El pago del mes ${month} y año ${year} ya existe.`,
                    code: TErrors.CONFLICT,
                });
            } else if (paymentExists.length > 0 && paymentExists[0].is_complete === 0) {
                if (user[0].amount > (parseInt(amount) + paymentExists[0].amount)) {
                    await this.monthlyPaymentsService.updatePayment(paymentExists[0].id_payment, payDate, parseInt(amount) + paymentExists[0].amount);
                    await this.monthlyPaymentsService.updatePaymentHistory(paymentExists[0].id_payment, payDate, parseInt(amount));
                    return res.status(200).send();
                } else if (user[0].amount <= (parseInt(amount) + paymentExists[0].amount)) {
                    await this.monthlyPaymentsService.updatePayment(paymentExists[0].id_payment, payDate, parseInt(amount) + paymentExists[0].amount);
                    await this.monthlyPaymentsService.closePayment(paymentExists[0].id_payment);
                    await this.monthlyPaymentsService.updatePaymentHistory(paymentExists[0].id_payment, payDate, parseInt(amount));

                    if (user[0].fee_descr !== "Amigo") {
                        await this.monthlyPaymentsService.addRepublicPayment(payDate);
                    }

                    return res.status(200).send(`Se saldó la cuota mes ${month} del año ${year}`)
                }
            }

            await this.monthlyPaymentsService.addPayment(uid, month, year, payDate);
            const newPayment = await this.monthlyPaymentsService.checkPayment(uid, month, year);
            await this.monthlyPaymentsService.updatePayment(newPayment[0].id_payment, payDate, parseInt(amount));
            await this.monthlyPaymentsService.updatePaymentHistory(newPayment[0].id_payment, payDate, parseInt(amount));
            if (user[0].amount <= parseInt(amount)) {
                await this.monthlyPaymentsService.closePayment(newPayment[0].id_payment);
                if (user[0].fee_descr !== "Amigo") {
                    await this.monthlyPaymentsService.addRepublicPayment(payDate);
                }
                return res.status(200).send(`Se saldó la cuota mes ${month} del año ${year}`)
            }
            
            res.status(200).send();
        } catch (error) {
            next(error)
        }
    }

    addLinkedPayment = async (req, res, next) => {
        const { uid, month, year, payDate, isLinked } = req.body;
        try {
            if (!uid || !month || !year) {
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
            const newPayment = await this.monthlyPaymentsService.checkPayment(uid, month, year);
            if (newPayment.length > 0  && newPayment[0].is_complete === 1) {
                CustomError.createError({
                    message: `El pago vínculo del mes ${month} y año ${year} ya existe.`,
                    code: TErrors.CONFLICT,
                });
            }
            const newLinkedPayment = await this.monthlyPaymentsService.addLinkedPayment(uid, month, year, payDate, isLinked);
            res.status(200).send(newLinkedPayment);
        } catch (error) {
            next(error)
        }
    }

    getDebtorsHistory = async (req, res, next) => {
        const { month, year } = req.params;
        try {
            const debtors = await this.monthlyPaymentsService.getDebtorsHistory(month, year);

            res.status(200).send(debtors);
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
            const debtHistory = await this.monthlyPaymentsService.getUserDebtInfo(uid, date);
            
            if (debtHistory.length === 0) {
                return res.status(200).send(null)
            }
            const meses = [" ", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];

            let debtList = [];
            debtHistory.forEach(debt => {
                debtList.push(` ${meses[parseInt(debt.month_paid)]}-${debt.year_paid}`)
            });

            res.status(200).send(`Les recordamos que esta adeudando la cuota correspondiente al/los mes/es de ${debtList}`)
            //const chatId = `${user[0].tel_contact}@c.us`;
            //await client.sendMessage(chatId, `Estimado usuario, queremos recordarle que posee retraso/s de su cuota mensual. Por favor regularice su situación. Detalle: ${debtList}`);
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
            const debtHistory = await this.monthlyPaymentsService.getUserDebtHistory(uid);
            res.status(200).send(debtHistory);
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
                const debtHistory = await this.monthlyPaymentsService.getUserDebtInfo(debtor.id_user, date);
                let debtList = [];
                debtHistory.forEach(debt => {
                    debtList.push(`Mes: ${debt.month_paid}/${debt.year_paid} - `)
                });
                const chatId = `${debtor.tel_contact}@c.us`;
                await client.sendMessage(chatId, `Estimado usuario, queremos recordarle que posee retraso/s de su cuota mensual. Por favor regularice su situación. Detalle: ${debtList}`);

            });
            res.status(200).send("Se enviaron los mensajes.");
        } catch (error) {
            next(error)
        }
    }
}
import CustomError from "../tools/customErrors/customError.js";
import TErrors from "../tools/customErrors/enum.js";
import { client } from "./utils.controller.js"


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
        const { uid, year, payDate } = req.body;
        try {
            if (!uid || !year) {
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
            const newPayment = await this.annualPaymentsService.addPayment(uid, year, payDate);
            res.status(200).send(newPayment);
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
            if (!debtHistory.length) {
                CustomError.createError({
                    message: `El usuario de ID ${uid} no posee deudas al día de la fecha.`,
                    code: TErrors.NOT_FOUND,
                });
            }
            let debtList = [];
            
            debtHistory.forEach(debt => {
                debtList.push(`Año: ${debt.year_paid}`)
            });

            const chatId = `${user[0].tel_contact}@c.us`;
            await client.sendMessage(chatId, `Estimado usuario, queremos recordarle que posee retraso/s de su cuota anual. Por favor regularice su situación. Detalle: ${debtList}`);
            res.status(200).send(`Se envió el mensaje`)
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
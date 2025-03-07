import { Client } from 'whatsapp-web.js';
import CustomError from "../tools/customErrors/customError.js";
import TErrors from "../tools/customErrors/enum.js";

export const client = new Client({
    webVersionCache: {
        type: "remote",
        remotePath:
            "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ],
    },
});


export default class UtilsController {
    constructor(utilsService) {
        this.utilsService = utilsService;
    }


    getAdminNotifications = async (req, res, next) => {
        try {
            const { merchReq, inscReq } = await this.utilsService.getAdminNotifications();
            res.status(200).send({ merchReq: merchReq, inscReq: inscReq })
        } catch (error) {
            next(error)
        }
    }

    getQr = async (req, res, next) => {
        try {
            
            client.on('qr', qr => {
                res.status(200).send({ qrCode: qr });
            });
            client.on('ready', () => {
                console.log('Client is ready!');
            });
            client.initialize();
            
        } catch (error) {
            next(error)
        }
    }

    getFees = async (req, res, next) => {
        try {
            const fees = await this.utilsService.getFees();
            res.status(200).send(fees)
        } catch (error) {
            next(error)
        }
    }

    updateFees = async (req, res, next) => {
        const { fid, newFee } = req.body;
        
        try {
            if (!fid || newFee === undefined) {
                CustomError.createError({
                    message: `Faltan datos o son inválidos.`,
                    code: TErrors.INVALID_TYPES,
                });
            }
            await this.utilsService.updateFees(fid, newFee);
            res.status(200).send()
        } catch (error) {
            next(error)
        }
    }

    newExpenditures = async (req, res, next) => {        
        const { descr, amount, payDate } = req.body;
        
        try {
            if (!payDate || !descr || !amount) {
                CustomError.createError({
                    message: `Faltan datos o son inválidos.`,
                    code: TErrors.INVALID_TYPES,
                });
            }
            await this.utilsService.newExpenditures(payDate, descr, amount);
            res.status(200).send()
        } catch (error) {
            next(error)
        }
    }

    
    getDailyClub = async (req, res, next) => {
        const { day } = req.params;

        try {
            const dayPayments = await this.utilsService.getDailyClub(day);
            res.status(200).send(dayPayments);
        } catch (error) {
            next(error)
        }
    }

    dailyMonthly = async (req, res, next) => {
        const { day } = req.params;

        try {
            const dayPayments = await this.utilsService.dailyMonthly(day);
            res.status(200).send(dayPayments);
        } catch (error) {
            next(error)
        }
    }

    dailyAnnual = async (req, res, next) => {
        const { day } = req.params;

        try {
            const dayPayments = await this.utilsService.dailyAnnual(day);
            res.status(200).send(dayPayments);
        } catch (error) {
            next(error)
        }
    }

    dailyInscriptions = async (req, res, next) => {
        const { day } = req.params;

        try {
            const dayPayments = await this.utilsService.dailyInscriptions(day);
            res.status(200).send(dayPayments);
        } catch (error) {
            next(error)
        }
    }

    dailyRequests = async (req, res, next) => {
        const { day } = req.params;

        try {
            const dayPayments = await this.utilsService.dailyRequests(day);
            res.status(200).send(dayPayments);
        } catch (error) {
            next(error)
        }
    }

    dailyExpenditures = async (req, res, next) => {
        const { day } = req.params;

        try {
            const dayPayments = await this.utilsService.dailyExpenditures(day);
            res.status(200).send(dayPayments);
        } catch (error) {
            next(error)
        }
    }

    getExpenditures = async (req, res, next) => {
        const { month } = req.params;
        try {
            const expenditures = await this.utilsService.getExpenditures(month);
            res.status(200).send(expenditures);
        } catch (error) {
            next(error)
        }
    }

}
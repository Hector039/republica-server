import CustomError from "../tools/customErrors/customError.js";
import TErrors from "../tools/customErrors/enum.js";

export default class InscriptionsRequestsController {
    constructor(inscriptionsRequestsService, usersService, eventsService) {
        this.inscriptionsRequestsService = inscriptionsRequestsService;
        this.usersService = usersService;
        this.eventsService = eventsService;
    }

    param = async (req, res, next, iid) => {//param
        try {
            const inscReq = await this.inscriptionsRequestsService.getInscriptionRequest(iid);
            if (!inscReq.length) {
                req.inscReq = null;
                CustomError.createError({
                    message: `Solicitud de inscripción ID: ${iid} no encontrada.`,
                    code: TErrors.NOT_FOUND,
                });
            }
            req.inscReq = inscReq[0];
            next();
        } catch (error) {
            next(error);
        }
    }

    getInscriptionsRequests = async (req, res, next) => {
        try {
            let inscReq = await this.inscriptionsRequestsService.getInscriptionsRequests();
            res.status(200).send(inscReq);
        } catch (error) {
            next(error)
        }
    }

    getDebtorsHistory = async (req, res, next) => {
        const { day } = req.params;
        try {
            const debtors = await this.inscriptionsRequestsService.getDebtorsHistory(day);
            res.status(200).send(debtors);
        } catch (error) {
            next(error)
        }
    }

    getUserInscriptionRequest = async (req, res, next) => {
        const { uid } = req.params;
        try {
            const user = await this.usersService.getUser(uid);
            if (!user.length) {
                CustomError.createError({
                    message: `El usuario de ID ${uid} no encontrado.`,
                    code: TErrors.NOT_FOUND,
                });
            }
            let userInscReq = await this.inscriptionsRequestsService.getUserInscriptionsRequests(uid);
            res.status(200).send(userInscReq);
        } catch (error) {
            next(error)
        }
    }

    getAllUserInscriptions = async (req, res, next) => {
        const { uid } = req.params;
        try {
            const user = await this.usersService.getUser(uid);
            if (!user.length) {
                CustomError.createError({
                    message: `El usuario de ID ${uid} no encontrado.`,
                    code: TErrors.NOT_FOUND,
                });
            }
            let userInscReq = await this.inscriptionsRequestsService.getAllUserInscriptions(uid);
            res.status(200).send(userInscReq);
        } catch (error) {
            next(error)
        }
    }

    updateInscriptionRequest = async (req, res, next) => {
        const { iid, payDate } = req.body;
        try {
            if (!payDate) {
                CustomError.createError({
                    message: `Dato no recibido o inválido.`,
                    code: TErrors.INVALID_TYPES,
                });
            }
            let inscReq = await this.inscriptionsRequestsService.updateInscriptionRequest(iid, payDate);
            res.status(200).send(inscReq);
        } catch (error) {
            next(error)
        }
    }

    addInscriptionRequest = async (req, res, next) => {
        const { eid, uid } = req.params;
        try {
            if (!eid || !uid) {
                CustomError.createError({
                    message: `Datos no recibidos o inválidos.`,
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
            const event = await this.eventsService.getEvent(eid);
            if (!event.length) {
                CustomError.createError({
                    message: `Evento ID: ${eid} no encontrado.`,
                    code: TErrors.NOT_FOUND
                });
            };
            let inscReq = await this.inscriptionsRequestsService.addInscriptionRequest(eid, uid);
            res.status(200).send(inscReq);
        } catch (error) {
            next(error)
        }
    }

    deleteInscriptionRequest = async (req, res, next) => {
        try {
            let inscReqId = req.inscReq.id_inscription;
            let inscReq = await this.inscriptionsRequestsService.deleteInscriptionRequest(inscReqId);
            res.status(200).send(inscReq);
        } catch (error) {
            next(error)
        }
    }

    getNewInscriptionRequests = async (req, res, next) => {
        try {
            let newInscRequests = await this.inscriptionsRequestsService.getNewInscriptionRequests();
            //await this.inscriptionsRequestsService.updateSeenInscriptionRequests();
            res.status(200).send(newInscRequests);
        } catch (error) {
            next(error)
        }
    }

    updateSeenNewInscriptionRequests = async (req, res, next) => {
        try {
            await this.inscriptionsRequestsService.updateSeenInscriptionRequests();
            res.status(200).send();
        } catch (error) {
            next(error)
        }
    }

}
export default class InscriptionsRequestsService {
    constructor(repository) {
        this.inscriptionRepo = repository;
    }
    async getInscriptionsRequests() {
        const result = await this.inscriptionRepo.getInscriptionsRequests();
        return result;
    }

    async getInscriptionRequest(iid) {
        const result = await this.inscriptionRepo.getInscriptionRequest(iid);
        return result;
    }

    async getUserInscriptionsRequests(uid) {
        const result = await this.inscriptionRepo.getUserInscriptionsRequests(uid);
        return result;
    }

    async getAllUserInscriptions(uid) {
        const result = await this.inscriptionRepo.getAllUserInscriptions(uid);
        return result;
    }
    
    async updateInscriptionRequest(iid, payDate) {
        const result = await this.inscriptionRepo.updateInscriptionRequest(iid, payDate);
        return result;
    }

    async addInscriptionRequest(eid, uid) {
        const result = await this.inscriptionRepo.addInscriptionRequest(eid, uid);
        return result;
    }

    async deleteInscriptionRequest(iid) {
        const result = await this.inscriptionRepo.deleteInscriptionRequest(iid);
        return result;
    }

    async getNewInscriptionRequests() {
        const result = await this.inscriptionRepo.getNewInscriptionRequests();
        return result;
    }
    
    async updateSeenInscriptionRequests() {
        const result = await this.inscriptionRepo.updateSeenInscriptionRequests();
        return result;
    }

    getUserDebtHistory = async (uid) => {
        const result = await this.inscriptionRepo.getUserDebtHistory(uid);
        return result;
    };

    getDebtorsHistory = async (day) => {
        const result = await this.inscriptionRepo.getDebtorsHistory(day);
        return result;
    };
};
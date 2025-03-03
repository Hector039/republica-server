export default class ProductService {
    constructor(repository) {
        this.merchRepo = repository;
    }

    async getMerchRequests() {
        const result = await this.merchRepo.getMerchRequests();
        return result;
    }

    async getUserMerchRequest(uid) {
        const result = await this.merchRepo.getUserMerchRequest(uid);
        return result;
    }

    async getAllUserMerchRequest(uid) {
        const result = await this.merchRepo.getAllUserMerchRequest(uid);
        return result;
    }

    async getMerchRequestById(mid) {
        const result = await this.merchRepo.getMerchRequestById(mid);
        return result;
    }
    
    async addMerchRequest(newMerch) {
        const result = await this.merchRepo.addMerchRequest(newMerch);
        return result;
    }

    async updateMerchRequest(mid, merchReqUpdated) {
        const result = await this.merchRepo.updateMerchRequest(mid, merchReqUpdated);
        return result;
    }

    async deleteMerchRequest(mid) {
        const result = await this.merchRepo.deleteMerchRequest(mid);
        return result;
    }

    async updateMerchPayment(mid, paymentStatus) {
        const result = await this.merchRepo.updateMerchPayment(mid, paymentStatus);
        return result;
    }

    async getNewMerchRequests() {
        const result = await this.merchRepo.getNewMerchRequests();
        return result;
    }
    
    async updateSeenMerchRequest() {
        const result = await this.merchRepo.updateSeenMerchRequest();
        return result;
    }

    getDebtorsHistory = async (day) => {
        const result = await this.merchRepo.getDebtorsHistory(day);
        return result;
    };
};
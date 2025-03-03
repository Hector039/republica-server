export default class UtilsService {
    constructor(repository) {
        this.utilsRepo = repository;
    }
    async getAdminNotifications() {
        const result = await this.utilsRepo.getAdminNotifications();
        return result;
    }
    
    getDayTotalPayments = async (day) => {
        const result = await this.utilsRepo.getDayTotalPayments(day);
        return result;
    };

};
export default class UtilsService {
    constructor(repository) {
        this.utilsRepo = repository;
    }
    async getAdminNotifications() {
        const result = await this.utilsRepo.getAdminNotifications();
        return result;
    }
    
    getFees = async () => {
        const result = await this.utilsRepo.getFees();
        return result;
    };

    updateFees = async (fid, newFee) => {
        const result = await this.utilsRepo.updateFees(fid, newFee);
        return result;
    };

    newExpenditures = async (today, descr, amount) => {
        const result = await this.utilsRepo.newExpenditures(today, descr, amount);
        return result;
    };

    getDailyClub = async (day) => {
        const result = await this.utilsRepo.getDailyClub(day);
        return result;
    };

    dailyMonthly = async (day) => {
        const result = await this.utilsRepo.dailyMonthly(day);
        return result;
    };

    dailyAnnual = async (day) => {
        const result = await this.utilsRepo.dailyAnnual(day);
        return result;
    };

    dailyInscriptions = async (day) => {
        const result = await this.utilsRepo.dailyInscriptions(day);
        return result;
    };

    dailyRequests = async (day) => {
        const result = await this.utilsRepo.dailyRequests(day);
        return result;
    };

    dailyExpenditures = async (day) => {
        const result = await this.utilsRepo.dailyExpenditures(day);
        return result;
    };

    getExpenditures = async (month) => {
        const result = await this.utilsRepo.getExpenditures(month);
        return result;
    };

    openCloseFeatures = async (fid, position) => {
        const result = await this.utilsRepo.openCloseFeatures(fid, position);
        return result;
    };

    getPositionFeatures = async () => {
        const result = await this.utilsRepo.getPositionFeatures();
        return result;
    };

    

    monthlyClub = async (month) => {
        const result = await this.utilsRepo.monthlyClub(month);
        return result;
    };

    monthly = async (month) => {
        const result = await this.utilsRepo.monthly(month);
        return result;
    };

    monthlyAnnual = async (month) => {
        const result = await this.utilsRepo.monthlyAnnual(month);
        return result;
    };

    monthlyInscriptions = async (month) => {
        const result = await this.utilsRepo.monthlyInscriptions(month);
        return result;
    };

    monthlyRequests = async (month) => {
        const result = await this.utilsRepo.monthlyRequests(month);
        return result;
    };

    monthlyExpenditures = async (month) => {
        const result = await this.utilsRepo.monthlyExpenditures(month);
        return result;
    };

    getMonthGridInfo = async (month) => {
        const result = await this.utilsRepo.getMonthGridInfo(month);
        return result;
    };

};
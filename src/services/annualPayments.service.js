export default class AnnualPaymentsService {
    constructor(repository) {
        this.paymentsRepo = repository;
    }

    async addPayment(uid, year) {
        try {
            const payment = await this.paymentsRepo.addPayment(uid, year)
            return payment;
        } catch (error) {
            throw error;
        }
    };

    getHistoryPayments = async (uid) => {
        const result = await this.paymentsRepo.getHistoryPayments(uid);
        return result;
    };

    getDebtorsHistory = async (year) => {
        const result = await this.paymentsRepo.getDebtorsHistory(year);
        return result;
    };

    getDayTotalPayments = async (day) => {
        const result = await this.paymentsRepo.getDayTotalPayments(day);
        return result;
    };

    getUserDebtHistory = async (uid) => {
        const result = await this.paymentsRepo.getUserDebtHistory(uid);
        return result;
    };

    getUserDebtInfo = async (uid,date) => {
        const result = await this.paymentsRepo.getUserDebtInfo(uid, date);
        return result;
    };
};

export default class MonthlyPaymentsService {
    constructor(repository) {
        this.paymentsRepo = repository;
    }

    async addPayment(uid, month, year, payDate) {
        try {
            const payment = await this.paymentsRepo.addPayment(uid, month, year, payDate)
            return payment;
        } catch (error) {
            throw error;
        }
    };

    async addLinkedPayment(uid, month, year, payDate, isLinked) {
        try {
            const payment = await this.paymentsRepo.addLinkedPayment(uid, month, year, payDate, isLinked)
            return payment;
        } catch (error) {
            throw error;
        }
    };

    async addRepublicPayment(payDate) {
        try {
            const payment = await this.paymentsRepo.addRepublicPayment(payDate)
            return payment;
        } catch (error) {
            throw error;
        }
    };

    getHistoryPayments = async (uid) => {
        const result = await this.paymentsRepo.getHistoryPayments(uid);
        return result;
    };

    getDebtorsHistory = async (month, year) => {
        const result = await this.paymentsRepo.getDebtorsHistory(month, year);
        return result;
    };

    

    getUserDebtHistory = async (uid) => {
        const result = await this.paymentsRepo.getUserDebtHistory(uid);
        return result;
    };

    getUserDebtInfo = async (uid, date) => {
        const result = await this.paymentsRepo.getUserDebtInfo(uid, date);
        return result;
    };
};
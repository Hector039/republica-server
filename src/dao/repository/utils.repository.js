export default class UtilsRepository {
    constructor(database) {
        this.database = database;
    }

    getAdminNotifications = async () => {
        try {
            const sqlMerchReq = 'SELECT COUNT(id_request) AS merch FROM `merch_requests` WHERE seen = 0';
            const sqlInscReq = 'SELECT COUNT(id_inscription) AS insc FROM `inscription_requests` WHERE seen = 0';
            const merchReq = await this.database.execute(sqlMerchReq);
            const inscReq = await this.database.execute(sqlInscReq);
            return { merchReq: merchReq[0][0], inscReq: inscReq[0][0] };
        } catch (err) {
            throw err;
        }
    };

    getFees = async () => {
        try {
            const sql = 'SELECT * FROM fees';
            const fees = await this.database.execute(sql);
            return fees;
        } catch (err) {
            throw err;
        }
    };

    updateFees = async (fid, newFee) => {
        try {
            const sql = 'UPDATE fees SET amount = ? WHERE id_fee = ?';
            const fees = await this.database.execute(sql, [newFee, fid]);
            return fees;
        } catch (err) {
            throw err;
        }
    };
    
    newExpenditures = async (today, descr, amount) => {
        try {
            const sql = 'INSERT INTO expenditures (`pay_date`, `amount`, `descr`) VALUES (?, ?, ?)';
            const fees = await this.database.execute(sql, [today, amount, descr]);
            return fees;
        } catch (err) {
            throw err;
        }
    };

    
    async getDailyClub(day) {
        try {

            const sql = `SELECT COUNT(r.id_payment) AS cantidad, f.fee_descr AS tarifa, SUM(f.amount) AS total
                    FROM fees f JOIN republic_payments r  
                    ON f.id_fee = r.id_fee AND r.pay_date = ?
                    WHERE f.id_fee = 9`;
            const [rows, fields] = await this.database.query(sql, [day]);
            return rows;
        } catch (err) {
            throw err;
        }
    };

    async dailyMonthly(day) {
        try {
            const sql = `SELECT f.fee_descr, COUNT(mp.id_payment) AS registros, SUM(f.amount) AS total, ROW_NUMBER() OVER (ORDER BY f.fee_descr) row_num
                FROM users u
                JOIN monthly_payments mp ON u.id_user = mp.id_user
                JOIN fees f ON u.id_fee = f.id_fee
                WHERE mp.is_linked = 0 AND mp.pay_date = ? GROUP BY f.fee_descr`;
            const [rows, fields] = await this.database.query(sql, [day]);
            return rows;
        } catch (err) {
            throw err;
        }
    };

    async dailyAnnual(day) {
        try {
            const sql = `SELECT 
                            f.fee_descr, 
                            COUNT(ap.id_payment) AS registros, 
                            SUM(f.amount) AS total, ROW_NUMBER() OVER (ORDER BY f.fee_descr) row_num
                        FROM annual_payments ap
                        JOIN fees f ON f.id_fee = 10
                        WHERE ap.pay_date = ?
                        GROUP BY f.fee_descr`;
            const [rows, fields] = await this.database.query(sql, [day]);
            return rows;
        } catch (err) {
            throw err;
        }
    };

    async dailyInscriptions(day) {
        try {
            const sql = `SELECT ce.event_name, COUNT(ir.id_inscription) AS registros, SUM(ce.inscription_price) AS total, ROW_NUMBER() OVER (ORDER BY ce.event_name) row_num
                            FROM inscription_requests ir
                            JOIN custom_events ce ON ir.id_event = ce.id_event
                            WHERE ir.pay_date = ?
                            GROUP BY ce.event_name`;
            const [rows, fields] = await this.database.query(sql, [day]);
            return rows;
        } catch (err) {
            throw err;
        }
    };

    async dailyRequests(day) {
        try {
            const sql = `SELECT mr.id_request, COUNT(mr.id_request) AS registros, SUM(mr.amount) AS total
                            FROM merch_requests mr
                            WHERE mr.pay_date = ? GROUP BY mr.id_request`;
            const [rows, fields] = await this.database.query(sql, [day]);
            return rows;
        } catch (err) {
            throw err;
        }
    };

    async dailyExpenditures(day) {
        try {
            const sql = `SELECT COUNT(e.id_exp) AS registros, SUM(e.amount) AS total
                            FROM expenditures e
                            WHERE e.pay_date = ?`;
            const [rows, fields] = await this.database.query(sql, [day]);
            return rows;
        } catch (err) {
            throw err;
        }
    };

    async getExpenditures(month) {
        const arrayDate = month.split("-")
        try {
            const sql = `SELECT 
            e.id_exp,
    e.pay_date,
    e.amount,
    e.descr
FROM expenditures e
WHERE YEAR(e.pay_date) = ?
AND MONTH(e.pay_date) = ?`;
            const [rows, fields] = await this.database.query(sql, [arrayDate[0], arrayDate[1]]);
            return rows;
        } catch (err) {
            throw err;
        }
    };
};
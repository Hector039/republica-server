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
            const sql = `SELECT mp.id_monthly_payment AS registros, mp.amount AS total
                FROM monthly_payments_history mp 
                WHERE mp.pay_date = ?`;
            const [rows, fields] = await this.database.query(sql, [day]);
            return rows;
        } catch (err) {
            throw err;
        }
    };

    async dailyAnnual(day) {
        try {
            const sql = `SELECT 
                            ap.id_annual_payment AS registros, 
                            ap.amount AS total
                        FROM annual_payments_history ap
                        WHERE ap.pay_date = ?`;
            const [rows, fields] = await this.database.query(sql, [day]);
            return rows;
        } catch (err) {
            throw err;
        }
    };

    async dailyInscriptions(day) {
        try {
            const sql = `SELECT ip.id_insc_payment AS registros, ip.amount AS total
                            FROM inscription_payments ip
                            WHERE ip.pay_date = ?`

            const sql2 = `SELECT ce.event_name, COUNT(ip.id_insc_payment) AS registros, SUM(ip.amount) AS total, ROW_NUMBER() OVER (ORDER BY ce.event_name) row_num
                            FROM inscription_requests ir JOIN inscription_payments ip
                            JOIN custom_events ce ON ir.id_event = ce.id_event ON ir.id_inscription = ip.id_inscription
                            WHERE ip.pay_date = ?
                            GROUP BY ce.event_name`;

            const [rows, fields] = await this.database.query(sql, [day]);
            return rows;
        } catch (err) {
            throw err;
        }
    };

    async dailyRequests(day) {
        try {
            const sql = `SELECT mp.id_req_payment AS registros, mp.amount AS total
                            FROM merch_payments mp
                            WHERE mp.pay_date = ?`;
            const [rows, fields] = await this.database.query(sql, [day]);
            return rows;
        } catch (err) {
            throw err;
        }
    };

    async dailyExpenditures(day) {
        try {
            const sql = `SELECT e.id_exp, e.amount, e.descr
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

    async openCloseFeatures(fid, position) {
        try {
            const sql = `UPDATE is_open SET feature = ? WHERE id = ?`;
            const [rows, fields] = await this.database.execute(sql, [position, fid]);
            return rows;
        } catch (err) {
            throw err;
        }
    };

    async getPositionFeatures() {
        try {
            const sql = `SELECT * FROM is_open`;
            const [rows, fields] = await this.database.execute(sql);
            return rows;
        } catch (err) {
            throw err;
        }
    };






    async monthlyClub(month) {
        const monthDate = month.split("-")
        try {

            const sql = `SELECT COUNT(r.id_payment) AS cantidad, 
                                f.fee_descr AS tarifa, 
                                SUM(f.amount) AS total
                                FROM fees f JOIN republic_payments r ON f.id_fee = r.id_fee
                                WHERE f.id_fee = 9 AND MONTH(r.pay_date) = ? AND YEAR(r.pay_date) = ? GROUP BY f.fee_descr`;
            const [rows, fields] = await this.database.query(sql, [monthDate[1], monthDate[0]]);
            return rows;
        } catch (err) {
            throw err;
        }
    };

    async monthly(month) {
        const monthDate = month.split("-")
        try {
            const sql = `SELECT mp.id_monthly_payment AS registros, mp.amount AS total, mp.pay_date
                            FROM monthly_payments_history mp
                            WHERE MONTH(mp.pay_date) = ? AND YEAR(mp.pay_date) = ?`;
            const [rows, fields] = await this.database.query(sql, [monthDate[1], monthDate[0]]);
            return rows;
        } catch (err) {
            throw err;
        }
    };

    async monthlyAnnual(month) {
        const monthDate = month.split("-")
        try {
            const sql = `SELECT 
                            ap.id_annual_payment AS registros, ap.pay_date, ap.amount AS total
                            FROM annual_payments_history ap
                            WHERE MONTH(ap.pay_date) = ? AND YEAR(ap.pay_date) = ?`;
            const [rows, fields] = await this.database.query(sql, [monthDate[1], monthDate[0]]);
            return rows;
        } catch (err) {
            throw err;
        }
    };

    async monthlyInscriptions(month) {
        const monthDate = month.split("-")
        try {

            const sql = `SELECT ip.id_insc_payment AS registros, ip.amount AS total, ip.pay_date
                            FROM inscription_payments ip
                            WHERE MONTH(ip.pay_date) = ? AND YEAR(ip.pay_date) = ?`;

            const sql2 = `SELECT ce.event_name, COUNT(ip.id_insc_payment) AS registros, SUM(ip.amount) AS total, ROW_NUMBER() OVER (ORDER BY ce.event_name) row_num
                            FROM inscription_requests ir JOIN inscription_payments ip
                            JOIN custom_events ce ON ir.id_event = ce.id_event ON ir.id_inscription = ip.id_inscription
                            WHERE  MONTH(ip.pay_date) = ? AND YEAR(ip.pay_date) = ?
                            GROUP BY ce.event_name`;

            const [rows, fields] = await this.database.query(sql, [monthDate[1], monthDate[0]]);
            return rows;
        } catch (err) {
            throw err;
        }
    };

    async monthlyRequests(month) {
        const monthDate = month.split("-")
        try {
            const sql = `SELECT mp.id_req_payment AS registros, mp.amount AS total, mp.pay_date
                            FROM merch_payments mp
                            WHERE MONTH(mp.pay_date) = ? AND YEAR(mp.pay_date) = ?`;
            const [rows, fields] = await this.database.query(sql, [monthDate[1], monthDate[0]]);
            return rows;
        } catch (err) {
            throw err;
        }
    };

    async getMonthGridInfo(month) {
        const monthDate = month.split("-")
        
        try {
            const sql = `SELECT 
                            ROW_NUMBER() OVER (ORDER BY day) AS id, -- Agrega un identificador único
                            day,
                            totalIn,
                            totalOut,
                            total
                        FROM (
                            SELECT 
                                DATE(pay_date) AS day, -- Nos aseguramos de que pay_date esté correctamente agrupado
                                SUM(COALESCE(mp_amount, 0)) + SUM(COALESCE(ap_amount, 0)) AS totalIn,
                                SUM(COALESCE(e_amount, 0)) AS totalOut,
                                (SUM(COALESCE(mp_amount, 0)) + SUM(COALESCE(ap_amount, 0)) - SUM(COALESCE(e_amount, 0))) AS total
                            FROM (
                                SELECT pay_date, amount AS mp_amount, 0 AS ap_amount, 0 AS e_amount FROM monthly_payments_history
                                UNION ALL
                                SELECT pay_date, 0, amount, 0 FROM annual_payments_history
                                UNION ALL
                                SELECT pay_date, 0, 0, amount FROM expenditures
                            ) AS combined
                            WHERE YEAR(pay_date) = ? AND MONTH(pay_date) = ?
                            GROUP BY day
                            ORDER BY day
                        ) AS grouped_data;`;
            const [rows, fields] = await this.database.query(sql, [monthDate[0], monthDate[1]]);
            return rows;
        } catch (err) {
            throw err;
        }
    };

};
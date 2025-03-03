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

    async getDayTotalPayments(day) {
        try {
            const sql = `SELECT creation_date, table_name, COUNT(*) AS total, ROW_NUMBER() OVER (ORDER BY creation_date DESC, table_name) AS id
                            FROM (
                                SELECT pay_date AS creation_date, 'monthly_payments' AS table_name FROM monthly_payments
                                UNION ALL
                                SELECT pay_date AS creation_date, 'annual_payments' AS table_name FROM annual_payments
                                UNION ALL
                                SELECT pay_date AS creation_date, 'merch_requests' AS table_name FROM merch_requests
                                UNION ALL
                                SELECT pay_date AS creation_date, 'inscription_requests' AS table_name FROM inscription_requests
                                ) AS combined
                                WHERE creation_date = ?
                                GROUP BY creation_date, table_name
                                ORDER BY creation_date DESC`;
            const [rows, fields] = await this.database.query(sql, [day]);
            return rows;
        } catch (err) {
            throw err;
        }
    };


};
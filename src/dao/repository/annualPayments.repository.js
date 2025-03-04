export default class AnnualPaymentsRepository {
  constructor(database) {
    this.database = database;
  }

  async addPayment(uid, year, payDate) {
    try {
      const sql = 'INSERT INTO `annual_payments`(`id_user`, `pay_date`, `year_paid`) VALUES (?, ?, ?)';
      const values = [uid, payDate, year]
      const [result, fields] = await this.database.execute(sql, values);
      return result;
    } catch (err) {
      throw err
    }
  };

  async getHistoryPayments(uid) {
    
    try {
      const sql = 'SELECT * FROM `annual_payments` WHERE id_user = ?';
      const [rows, fields] = await this.database.query(sql, [uid]);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  async getDebtorsHistory(year) {
    try {
      const sql = `SELECT u.id_user, u.first_name, u.last_name, u.email, u.tel_contact, u.user_status
                  FROM users u LEFT JOIN annual_payments a  
                  ON u.id_user = a.id_user AND a.year_paid = ? 
                  WHERE a.id_payment IS NULL AND u.user_status = 1`;
      const [rows, fields] = await this.database.query(sql, [year]);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  async getDayTotalPayments(day) {
    try {
      const sql = `SELECT u.fee, COUNT(m.id_payment) + COUNT(a.id_payment) AS total_pagos, ROW_NUMBER() OVER (ORDER BY u.fee) row_num
                  FROM users u
                  JOIN monthly_payments m JOIN annual_payments a ON u.id_user = m.id_user AND u.id_user = a.id_user
                  WHERE p.pay_date = ?
                  GROUP BY u.fee
                  ORDER BY u.fee`;
      const [rows, fields] = await this.database.query(sql, [day]);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  async getUserDebtHistory(uid) {
    console.log(uid);
    
    try {
      const sql = `SELECT a.year_paid, ROW_NUMBER() OVER (ORDER BY a.id_payment) id
                  FROM users u LEFT JOIN annual_payments a  
                  ON u.id_user = a.id_user AND u.id_user = ?
                  WHERE a.id_payment IS NULL AND u.user_status = 1 AND u.register_date < NOW()`;
      const [rows, fields] = await this.database.query(sql, [uid]);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  async getUserDebtInfo(uid, date) {
    const year = date.slice(0, -6)
    try {
      const sql2 = `WITH RECURSIVE YearRange AS (
        SELECT YEAR(u.register_date) AS year_paid
        FROM users u WHERE u.id_user = ?
        UNION ALL
        SELECT year_paid + 1 FROM YearRange WHERE year_paid < ?
    )
    SELECT yr.year_paid, ROW_NUMBER() OVER (ORDER BY yr.year_paid) AS id
    FROM YearRange yr
    LEFT JOIN annual_payments a  
        ON a.id_user = ? AND a.year_paid = yr.year_paid
    WHERE a.id_payment IS NULL`;

      const [rows, fields] = await this.database.query(sql2, [uid, year, uid]);
      return rows;
    } catch (err) {
      throw err;
    }
  };
};
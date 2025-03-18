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

  async closePayment(pid) {
    try {
      const sql = 'UPDATE annual_payments SET is_complete = 1 WHERE id_payment = ?';
      const [result, fields] = await this.database.execute(sql, [pid]);
      return result;
    } catch (err) {
      throw err
    }
  };

  async updatePayment(pid, payDate, amount) {
    try {
      const sql = 'UPDATE annual_payments SET pay_date = ?, amount = ? WHERE id_payment = ?';
      const [result, fields] = await this.database.execute(sql, [payDate, amount, pid]);
      return result;
    } catch (err) {
      throw err
    }
  };

  async checkPayment(uid, year) {
    try {
      const sql = 'SELECT * FROM `annual_payments` WHERE id_user = ? AND year_paid = ?';
      const [result, fields] = await this.database.execute(sql, [uid, year]);
      return result;
    } catch (err) {
      throw err
    }
  };

  async updatePaymentHistory(pid, payDate, amount){
    try {
      const sql = 'INSERT INTO `annual_payments_history`(`id_payment`, `pay_date`, `amount`) VALUES (?, ?, ?)';
      const [result, fields] = await this.database.execute(sql, [pid, payDate, amount]);
      return result;
    } catch (err) {
      throw err
    }
  }

  async getHistoryPayments(uid) {
    try {
      const sql = 'SELECT * FROM `annual_payments` WHERE id_user = ?';
      const [rows, fields] = await this.database.query(sql, [uid]);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  async getAnnualFee() {
    try {
      const sql = 'SELECT f.amount FROM fees f WHERE id_fee = 10';
      const [rows, fields] = await this.database.query(sql);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  async getDebtorsHistory(year) {
    try {
      const sql = `SELECT u.id_user, u.first_name, u.last_name, u.tel_contact, u.user_status
                  FROM users u LEFT JOIN annual_payments a  
                  ON u.id_user = a.id_user AND a.year_paid = ?
                  WHERE a.id_payment IS NULL OR a.is_complete = 0 AND u.user_status = 1`;
      const [rows, fields] = await this.database.query(sql, [year]);
      return rows;
    } catch (err) {
      throw err;
    }
  };
/* 
  async getDayTotalPayments(day) {
    try {
      const sql = `SELECT COUNT(m.id_monthly_payment) + COUNT(a.id_annual_payment) AS total_pagos, ROW_NUMBER() OVER (ORDER BY u.fee) row_num
                  FROM users u
                  JOIN monthly_payments_history m JOIN annual_payments_history a ON u.id_user = m.id_user AND u.id_user = a.id_user
                  WHERE p.pay_date = ?
                  GROUP BY u.fee
                  ORDER BY u.fee`;
      const [rows, fields] = await this.database.query(sql, [day]);
      return rows;
    } catch (err) {
      throw err;
    }
  };
 */
  async getUserDebtHistory(uid) {
    try {
      const sql = `SELECT a.year_paid, ROW_NUMBER() OVER (ORDER BY a.id_payment) id
                  FROM users u LEFT JOIN annual_payments a  
                  ON u.id_user = a.id_user AND u.id_user = ?
                  WHERE a.id_payment IS NULL OR a.is_complete = 0 AND u.user_status = 1 AND u.register_date < NOW()`;
      const [rows, fields] = await this.database.query(sql, [uid]);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  async getUserDebtInfo(uid, date) {
    const year = date.split("-")
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
    WHERE a.id_payment IS NULL OR a.is_complete = 0 `;

      const [rows, fields] = await this.database.query(sql2, [uid, year[0], uid]);
      return rows;
    } catch (err) {
      throw err;
    }
  };
};
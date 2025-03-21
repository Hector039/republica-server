export default class MonthlyPaymentsRepository {
  constructor(database) {
    this.database = database;
  }

  async addPayment(uid, month, year, payDate) {
    try {
      const sql = 'INSERT INTO `monthly_payments`(`id_user`, `pay_date`, `month_paid`, `year_paid`) VALUES (?, ?, ?, ?)';
      const [result, fields] = await this.database.execute(sql, [uid, payDate, month, year]);
      return result;
    } catch (err) {
      throw err
    }
  };

  async checkPayment(uid, month, year) {
    try {
      const sql = 'SELECT * FROM `monthly_payments` WHERE id_user = ? AND month_paid = ? AND year_paid = ?';
      const [result, fields] = await this.database.execute(sql, [uid, month, year]);
      return result;
    } catch (err) {
      throw err
    }
  };

  async closePayment(pid) {
    try {
      const sql = 'UPDATE monthly_payments SET is_complete = 1 WHERE id_payment = ?';
      const [result, fields] = await this.database.execute(sql, [pid]);
      return result;
    } catch (err) {
      throw err
    }
  };

  async updatePayment(pid, payDate, amount) {
    try {
      const sql = 'UPDATE monthly_payments SET pay_date = ?, amount = ? WHERE id_payment = ?';
      const [result, fields] = await this.database.execute(sql, [payDate, amount, pid]);
      return result;
    } catch (err) {
      throw err
    }
  };

  async updatePaymentHistory(pid, payDate, amount) {
    try {
      const sql = 'INSERT INTO `monthly_payments_history` (`id_payment`, `pay_date`, `amount`) VALUES (?, ?, ?)';
      const [result, fields] = await this.database.execute(sql, [pid, payDate, amount]);
      return result;
    } catch (err) {
      throw err
    }
  }

  async addRepublicPayment(payDate) {
    try {
      const sql2 = 'INSERT INTO `republic_payments` (`pay_date`) VALUES (?)';
      await this.database.execute(sql2, [payDate]);
      return;
    } catch (err) {
      throw err
    }
  };

  async addLinkedPayment(uid, month, year, payDate, isLinked) {
    try {
      const sql = 'INSERT INTO `monthly_payments`(`id_user`, `pay_date`, `month_paid`, `year_paid`, `is_linked`, `is_complete`) VALUES (?, ?, ?, ?, ?, ?)';
      const values = [uid, payDate, month, year, isLinked, 1]
      const [result, fields] = await this.database.execute(sql, values);
      return result;
    } catch (err) {
      throw err
    }
  };

  async getHistoryPayments(uid) {
    try {
      const sql = 'SELECT * FROM `monthly_payments` WHERE id_user = ?';
      const [rows, fields] = await this.database.query(sql, [uid]);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  async getDebtorsHistory(month, year) {
    try {
      const sql = `SELECT u.id_user, u.first_name, u.last_name, u.email, u.tel_contact, u.user_status
                  FROM users u LEFT JOIN monthly_payments p  
                  ON u.id_user = p.id_user AND p.month_paid = ? AND p.year_paid = ? 
                  WHERE p.id_payment IS NULL OR p.is_complete = 0 AND u.user_status = 1`;
      const [rows, fields] = await this.database.query(sql, [month, year]);
      return rows;
    } catch (err) {
      throw err;
    }
  };



  async getUserDebtHistory(uid) {
    try {
      const sql = `SELECT p.month_paid, p.year_paid, ROW_NUMBER() OVER (ORDER BY p.id_payment) row_num
                  FROM users u LEFT JOIN monthly_payments p  
                  ON u.id_user = p.id_user AND u.id_user = ?
                  WHERE p.id_payment IS NULL OR p.is_complete = 0 AND u.user_status = 1 AND u.register_date <= NOW()`;
      const [rows, fields] = await this.database.query(sql, [uid]);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  async getUserDebtInfo(uid, date) {
    const monthDate = date.split("-")

    try {

      const sql = `WITH RECURSIVE MonthRange AS (
    -- Primer mes desde la fecha de registro del usuario
    SELECT YEAR(u.register_date) AS year_paid, MONTH(u.register_date) AS month_paid
    FROM users u WHERE u.id_user = ?
    
    UNION ALL
    
    -- Generamos los siguientes meses hasta el año y mes consultado
    SELECT 
        CASE WHEN month_paid = 12 THEN year_paid + 1 ELSE year_paid END AS year_paid,
        CASE WHEN month_paid = 12 THEN 1 ELSE month_paid + 1 END AS month_paid
    FROM MonthRange
    WHERE year_paid < ? OR (year_paid = ? AND month_paid < ?)
)
SELECT mr.month_paid, mr.year_paid, ROW_NUMBER() OVER (ORDER BY mr.year_paid, mr.month_paid) AS row_num
FROM MonthRange mr
LEFT JOIN monthly_payments p  
    ON p.id_user = ? 
    AND p.year_paid = mr.year_paid 
    AND p.month_paid = mr.month_paid
WHERE p.id_payment IS NULL OR p.is_complete = 0`;
      const [rows, fields] = await this.database.query(sql, [uid, monthDate[0], monthDate[0], monthDate[1], uid]);
      return rows;
    } catch (err) {
      throw err;
    }
  };
};
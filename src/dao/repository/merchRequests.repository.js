export default class MerchRequestsRepository {
  constructor(database) {
    this.database = database;
  }

  getMerchRequests = async () => {
    try {
      const sql2 = `SELECT  u.id_user,  u.first_name,  u.last_name, u.tel_contact, m.id_request, m.req_date, m.req_description, m.pay_date, COALESCE(SUM(mp.amount), 0) AS amount
      FROM users u JOIN merch_requests m ON u.id_user = m.id_user 
      LEFT JOIN merch_payments mp ON m.id_request = mp.id_request
      GROUP BY 
          u.id_user, 
          u.first_name, 
          u.last_name, 
          u.tel_contact, 
          m.id_request, 
          m.req_date, 
          m.req_description, 
          m.pay_date`
      const sql = `SELECT u.id_user, u.first_name, u.last_name, u.email, u.tel_contact, m.req_date, m.req_description, m.pay_date, m.id_request
                  FROM users u JOIN merch_requests m  
                  ON u.id_user = m.id_user`;
      const [rows, fields] = await this.database.query(sql2);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  getUserMerchRequest = async (uid) => {
    try {
      const sql = `SELECT m.req_date, m.req_description, m.pay_date, m.id_request
                  FROM users u JOIN merch_requests m  
                  ON u.id_user = m.id_user WHERE m.pay_date IS NOT NULL AND m.id_user = ?`;
      const [rows, fields] = await this.database.execute(sql, [uid]);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  getAllUserMerchRequest = async (uid) => {
    try {
      const sql2 = `SELECT m.id_request, m.req_date, m.req_description, m.pay_date, COALESCE(SUM(mp.amount), 0) AS amount
                FROM users u JOIN merch_requests m ON u.id_user = m.id_user LEFT JOIN merch_payments mp ON m.id_request = mp.id_request
                WHERE u.id_user = ?
                GROUP BY m.id_request, m.req_date, m.req_description, m.pay_date`;

      const [rows, fields] = await this.database.execute(sql2, [uid]);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  getNewMerchRequests = async () => {
    try {
      const sql = `SELECT  u.id_user,  u.first_name,  u.last_name, u.tel_contact, m.id_request, m.req_date, m.req_description, m.pay_date, COALESCE(SUM(mp.amount), 0) AS total_amount
                  FROM users u JOIN merch_requests m ON u.id_user = m.id_user 
                  LEFT JOIN merch_payments mp ON m.id_request = mp.id_request
                  WHERE m.seen = 0
                  GROUP BY 
                      u.id_user, 
                      u.first_name, 
                      u.last_name, 
                      u.tel_contact, 
                      m.id_request, 
                      m.req_date, 
                      m.req_description, 
                      m.pay_date`;
      const [rows, fields] = await this.database.query(sql);
      return rows;
    } catch (err) {
      throw err;
    }
  };


  getMerchRequestById = async (mid) => {
    try {
      const sql = 'SELECT * FROM `merch_requests` WHERE id_request = ?';
      const [rows, fields] = await this.database.execute(sql, [mid]);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  addMerchRequest = async (uid, req_description) => {
    try {
      const sql = 'INSERT INTO `merch_requests`(`id_user`, `req_description`) VALUES (?, ?)';
      const [result, fields] = await this.database.execute(sql, [uid, req_description]);
      return result;
    } catch (err) {
      throw err
    }
  };

  addMerchPayment = async (mid, amount, payDate) => {
    try {
      const sql = 'INSERT INTO `merch_payments`(`id_request`, `amount`, `pay_date`) VALUES (?, ?, ?)';
      const [result, fields] = await this.database.execute(sql, [mid, amount, payDate]);
      return result;
    } catch (err) {
      throw err
    }
  };

  /* updateMerchRequest = async (mid, updatedMerchReq) => {
    try {
      const sql = 'UPDATE `merch_requests` SET `size` = ?, `quantity` = ?, `req_description` = ? WHERE `id_request` = ?';
      const values = [updatedMerchReq.size, updatedMerchReq.quantity, updatedMerchReq.req_description, mid];

      const [result, fields] = await this.database.execute(sql, values);

      return result;
    } catch (err) {
      throw err;
    }
  }; */

  updateMerchPayment = async (mid, payDate) => {
    try {
      const sql = 'UPDATE `merch_requests` SET pay_date = ? WHERE `id_request` = ?';

      const [result, fields] = await this.database.execute(sql, [payDate, mid]);

      return result;
    } catch (err) {
      throw err;
    }
  }

  deleteMerchRequest = async (mid) => {
    try {
      const sql = 'DELETE FROM `merch_requests` WHERE id_request = ?';
      const [result, fields] = await this.database.execute(sql, [mid]);
      return;
    } catch (err) {
      throw err;
    }
  };

  updateSeenMerchRequest = async () => {
    try {
      const sql = 'UPDATE `merch_requests` SET seen = 1';
      const [result, fields] = await this.database.execute(sql);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getDebtorsHistory(day) {
    try {
      const sql = `SELECT 
    u.id_user, 
    u.first_name, 
    u.last_name,
    u.email,
    u.tel_contact,
    u.user_status,
    m.id_request,
    m.req_description
FROM users u
JOIN merch_requests m ON u.id_user = m.id_user
WHERE m.pay_date IS NULL AND u.user_status = 1
AND m.req_date = ?`
      const [rows, fields] = await this.database.query(sql, [day]);
      return rows;
    } catch (err) {
      throw err;
    }
  };
};
export default class InscriptionsRequestsRepository {
    constructor(database) {
        this.database = database;
    }
    
    getInscriptionsRequests = async () => {
      try {
        const sql = `SELECT u.id_user, u.first_name, u.last_name, u.email, u.tel_contact, e.event_name, e.event_date, e.inscription_price, i.inscription_date, i.pay_date, i.id_inscription
                  FROM users u JOIN custom_events e JOIN inscription_requests i  
                  ON u.id_user = i.id_user AND e.id_event = i.id_event`;
        const [rows, fields] = await this.database.query(sql);
        return rows;
      } catch (err) {
        throw err;
      }
    };

    getInscriptionRequest = async (iid) => {
      try {
        const sql = 'SELECT * FROM `inscription_requests` WHERE id_inscription = ?';
        const [rows, fields] = await this.database.query(sql, [iid]);
        return rows;
      } catch (err) {
        throw err;
      }
    };

    getUserInscriptionsRequests = async (uid) => {
      try {
        const sql2 = `SELECT e.id_event, e.publication_date, e.event_date, e.event_name, e.event_description, e.inscription_price, i.id_user, i.id_inscription, i.pay_date
                  FROM custom_events e JOIN inscription_requests i  
                  ON e.id_event = i.id_event WHERE i.pay_date IS NOT NULL AND  i.id_user = ?`;
        const [rows, fields] = await this.database.query(sql2, [uid]);
        return rows;
      } catch (err) {
        throw err;
      }
    };

    getAllUserInscriptions = async (uid) => {
      try {
        const sql2 = `SELECT e.id_event, e.publication_date, e.event_date, e.event_name, e.event_description, e.inscription_price, i.id_user, i.id_inscription, i.pay_date
                  FROM custom_events e JOIN inscription_requests i  
                  ON e.id_event = i.id_event WHERE i.id_user = ?`;
        const [rows, fields] = await this.database.query(sql2, [uid]);
        return rows;
      } catch (err) {
        throw err;
      }
    };

    addInscriptionRequest = async (eid, uid) => {
      try {
        const sql = 'INSERT INTO `inscription_requests`(`id_user`, `id_event`) VALUES (?, ?)';
        const values = [ uid, eid ]
        const [result, fields] = await this.database.execute(sql, values);
        return result;
      } catch (err) {
        throw err
      }
    };

    deleteInscriptionRequest = async (iid) => {
      try {
        const sql = 'DELETE FROM `inscription_requests` WHERE id_inscription = ?';
        const [result, fields] = await this.database.execute(sql, [iid]);
        return;
      } catch (err) {
        throw err;
      }
    };

    updateInscriptionRequest = async (iid, payDate) => {
      try {
        const sql = 'UPDATE `inscription_requests` SET pay_date = ? WHERE `id_inscription` = ?';
        const values = [ payDate, iid ];
      
        const [result, fields] = await this.database.execute(sql, values);
      
        return result;
      } catch (err) {
        throw err;
      }
    };

    getNewInscriptionRequests = async () => {
      try {
        const sql = `SELECT u.id_user, u.first_name, u.last_name, u.email, u.tel_contact, e.event_name, e.event_date, e.inscription_price, i.inscription_date, i.pay_date, i.id_inscription
                  FROM users u JOIN custom_events e JOIN inscription_requests i  
                  ON u.id_user = i.id_user AND e.id_event = i.id_event WHERE i.seen = 0`;
        const [rows, fields] = await this.database.query(sql);
        return rows;
      } catch (err) {
        throw err;
      }
    };

    updateSeenInscriptionRequests = async () => {
      try {
        const sql = 'UPDATE `inscription_requests` SET seen = 1';
        const [result, fields] = await this.database.execute(sql);
      
        return result;
      } catch (err) {
        throw err;
      }
    }

    async getDebtorsHistory(day) {
      try {
        const sql2 = `SELECT 
    u.id_user, 
    u.first_name, 
    u.last_name,
    u.email,
    u.tel_contact,
    u.user_status,
    i.id_inscription,
    e.event_date,
    e.event_name,
    e.inscription_price
FROM users u
JOIN inscription_requests i ON u.id_user = i.id_user
JOIN custom_events e ON i.id_event = e.id_event
WHERE i.pay_date IS NULL AND u.user_status = 1
AND e.event_date = ?`
        const [rows, fields] = await this.database.query(sql2, [day]);
        return rows;
      } catch (err) {
        throw err;
      }
    };
};
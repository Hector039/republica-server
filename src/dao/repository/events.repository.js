export default class EventsRepository {
  constructor(database) {
    this.database = database;
  }

  addEvent = async (newEvent) => {
    try {
      const sql = 'INSERT INTO `custom_events`(`event_date`, `event_name`, `event_description`, `inscription_price`) VALUES (?, ?, ?, ?)';
      const values = [ newEvent.event_date, newEvent.event_name, newEvent.event_description, newEvent.inscription_price ]
      const [result, fields] = await this.database.execute(sql, values);
      return result;
    } catch (err) {
      throw err
    }
  };

  getEvents = async () => {
    try {
      const sql = 'SELECT * FROM `custom_events` ORDER BY publication_date DESC';
      const [rows, fields] = await this.database.query(sql);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  getEvent = async (eid) => {
    try {
      const sql = 'SELECT * FROM `custom_events` WHERE id_event = ?';
      const [rows, fields] = await this.database.query(sql, eid);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  updateEvent = async (eid, updatedEvent) => {
    try {
      const sql = 'UPDATE `custom_events` SET event_date = ?, event_name = ?, event_description = ?, inscription_price = ? WHERE `id_event` = ?';
      const values = [ updatedEvent.event_date, updatedEvent.event_name, updatedEvent.event_description, updatedEvent.inscription_price, eid ];
    
      const [result, fields] = await this.database.execute(sql, values);
    
      return result;
    } catch (err) {
      throw err;
    }
  }

  deleteAllEvents = async () => {
    try {
      const sql = 'DELETE FROM `custom_events`';
      const [result, fields] = await this.database.execute(sql);
      return;
    } catch (err) {
      throw err;
    }
  };

  deleteEvent = async (eid) => {
    try {
      const sql = 'DELETE FROM `custom_events` WHERE id_event = ?';
      const [result, fields] = await this.database.execute(sql, [eid]);
      return;
    } catch (err) {
      throw err;
    }
  };
}
export default class UsersRepository {
  constructor(database) {
    this.database = database;
  }

  getUsers = async (search, value) => {
    try {
      if (search === 'TODO') {
        const [rows, fields] = await this.database.execute('SELECT * FROM `users`');
        return rows;
      } else if (!value) {
        const [rows, fields] = await this.database.execute('SELECT * FROM `users`');
        return rows;
      }else {
        let valueWilcard = value + '%';
        
        const [rows, fields] = await this.database.execute(`SELECT * FROM users WHERE ${search} LIKE '${valueWilcard}'`);
        return rows;
      }
    } catch (err) {
      throw err;
    }
  };

  changeUserStatus = async (uid, userStatus) => {
    try {
      const sql = 'UPDATE `users` SET user_status = ? WHERE id_user = ?';
      const values = [ userStatus, uid ];
    
      const [result, fields] = await this.database.execute(sql, values);
    
      return fields;
    } catch (err) {
      throw err;
    }
  }

  changeUserGroup = async (uid, newGroup) => {
    try {      
      const sql = 'UPDATE `users` SET user_group = ? WHERE id_user = ?';
      const values = [ newGroup, uid ];
    
      const [result, fields] = await this.database.execute(sql, values);
    
      return result;
    } catch (err) {
      throw err;
    }
  }

  changeUserFee = async (uid, newFee) => {
    try {
      const sql = 'UPDATE `users` SET id_fee = ? WHERE id_user = ?';
    
      const [result, fields] = await this.database.execute(sql, [ newFee, uid ]);
    
      return result;
    } catch (err) {
      throw err;
    }
  }

  updateUserPassword = async (uid, newPassword) => {
    try {
      const sql = 'UPDATE `users` SET user_password = ? WHERE id_user = ?';
      const values = [ newPassword, uid ];
    
      const [result, fields] = await this.database.execute(sql, values);
    
      return result;
    } catch (err) {
      throw err;
    }
  };

  getUser = async (uid) => {
    try {
      const sql = 'SELECT * FROM `users` WHERE id_user = ?';
      const [rows, fields] = await this.database.execute(sql, [uid]);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  

  getUserByEmail = async (email) => {
    try {
      const sql = 'SELECT * FROM `users` WHERE email = ?';
      const [rows, fields] = await this.database.execute(sql, [email]);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  getUserByDni = async (dni) => {
    try {
      const sql = 'SELECT * FROM `users` WHERE dni = ?';
      const [rows, fields] = await this.database.execute(sql, [dni]);
      return rows;
    } catch (err) {
      throw err;
    }
  };

  addUser = async (newuser) => {
    try {
      const sql = 'INSERT INTO `users`(`first_name`, `last_name`, `email`, `birth_date`, `user_password`, `dni`, `tel_contact`) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const values = [ newuser.first_name, newuser.last_name, newuser.email, newuser.birth_date, newuser.user_password, newuser.dni, newuser.tel_contact ]
      const [result, fields] = await this.database.execute(sql, values);
      return result;
    } catch (err) {
      throw err
    }
  };

  updateUser = async (uid, updatedUser) => {
    try {
      const sql = 'UPDATE `users` SET `first_name` = ?, `last_name` = ?, `email` = ?, `birth_date` = ?, `dni` = ?, `tel_contact` = ? WHERE `id_user` = ?';
      const values = [ updatedUser.first_name, updatedUser.last_name, updatedUser.email, updatedUser.birth_date, updatedUser.dni, updatedUser.tel_contact, uid ];
    
      const [result, fields] = await this.database.execute(sql, values);
    
      return result;
    } catch (err) {
      throw err;
    }
  };

  updateUserWoDni = async (uid, updatedUser) => {
    try {
      const sql = 'UPDATE `users` SET `first_name` = ?, `last_name` = ?, `email` = ?, `birth_date` = ?, `tel_contact` = ? WHERE `id_user` = ?';
      const values = [ updatedUser.first_name, updatedUser.last_name, updatedUser.email, updatedUser.birth_date, updatedUser.tel_contact, uid ];
    
      const [result, fields] = await this.database.execute(sql, values);
    
      return result;
    } catch (err) {
      throw err;
    }
  };

}
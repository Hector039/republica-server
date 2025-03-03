import mysql from 'mysql2/promise'
import 'dotenv/config'

export default async function mysqlConnection() {
    try {
        const connection = await mysql.createConnection(
            process.env.URL_DB
        );
        
        return connection;
    } catch (err) {
        console.log(err);
    }
}

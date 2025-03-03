import EventsRepository from "./events.repository.js";
import MerchRequestsRepository from "./merchRequests.repository.js";
import InscriptionsRequestsRepository from "./inscriptionsRequests.repository.js";
import MonthlyPaymentsRepository from "./monthlyPayments.repository.js";
import AnnualPaymentsRepository from "./annualPayments.repository.js";
import UsersRepository from "./users.repository.js";
import UtilsRepository from "./utils.repository.js";
import 'dotenv/config'

import mysql from 'mysql2/promise'

export default async function mysqlConnection() {
    try {
        const connection = await mysql.createConnection(
            process.env.URL_DB
        );
        console.log('DB connected');
        
        return connection;
    } catch (err) {
        console.log(err);
    }
}
const database = await mysqlConnection();

const eventsRepository = new EventsRepository(database);
const merchRequestsRepository = new MerchRequestsRepository(database);
const inscriptionsRequestsRepository = new InscriptionsRequestsRepository(database);
const usersRepository = new UsersRepository(database);
const monthlyPaymentsRepository = new MonthlyPaymentsRepository(database);
const annualPaymentsRepository = new AnnualPaymentsRepository(database);
const utilsRepository = new UtilsRepository(database);

export { eventsRepository, merchRequestsRepository, inscriptionsRequestsRepository, usersRepository,
    monthlyPaymentsRepository, annualPaymentsRepository, utilsRepository };
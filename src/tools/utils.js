import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPass = (password, userPassword) => bcrypt.compareSync(password, userPassword);
export const generateToken = (user) => {
    const token = jwt.sign(user, process.env.USERCOOKIESECRET, { expiresIn: "3h" });
    return token;
};

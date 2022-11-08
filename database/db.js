import { Sequelize } from "sequelize";
import { DB_HOST,DB_NAME,DB_PASSWORD,DB_PORT,DB_USER } from "../config.js";
import * as dotenv from "dotenv"

dotenv.config()

const db = new Sequelize (DB_NAME||process.env.DB_DATABASE,DB_USER||process.env.DB_USER,DB_PASSWORD||process.env.DB_PASSWORD,{
    host:DB_HOST||process.env.DB_HOST,
    port:DB_PORT||process.env.DB_PORT,
    dialect:'mysql'||process.env.DB_DIALECT
})

export default db
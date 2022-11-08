import { Sequelize } from "sequelize";
import { DB_HOST,DB_NAME,DB_PASSWORD,DB_PORT,DB_USER } from "../config.js";


const db = new Sequelize (DB_NAME,DB_USER,DB_PASSWORD,{
    DB_HOST,
    DB_PORT,
    dialect:'mysql'
})

export default db
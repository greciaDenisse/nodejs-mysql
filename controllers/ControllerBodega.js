import { Bodegas } from "../models/Models.js"
import { Sequelize } from "sequelize";
import db from "../database/db.js";


export const getAllBodegas = async (req,res) => {
    try{
        const bodegas = await db.query(
            'SELECT * FROM bodegas_mat where estadoBod = 1',
            {type: db.QueryTypes.SELECT}
        )
        res.json(bodegas)
   }catch(error){
           res.json({message:error.message})
   }
}
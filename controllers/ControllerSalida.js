import {Salidas} from "../models/Models.js";
import { Sequelize, where } from "sequelize";
import db from "../database/db.js";

export const materialesEntrada = async (req,res) => {

    try{
        const matEntrada= await db.query(
            'SELECT SUM(cantEntMat) As TotalMat, e.idMaterial, m.nombreMat from entrada_materiales e JOIN materiales m ON e.idMaterial = m.idMaterial where e.idObra=? GROUP BY idMaterial;',
            {
              replacements: [req.params.id],
              type:db.QueryTypes.SELECT
            }
        )
        res.json(matEntrada)
        
    }catch(error){
            res.json({message:error.message})
    }
}

export const getAllSalidas = async (req,res) => {
    try{
        const salidas= await Salidas.findAll()
        res.json(salidas)
   }catch(error){
           res.json({message:error.message})
   }
}

export const createSalida = async  (req,res) =>{
    try {
        const salidaId = await Salidas.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idSalMat')), 'maxId']],
            raw: true,
        })
        const lastId = salidaId[0]["maxId"];   
        const cantidadSalida = req.body.cantSalMat
        const fechaSalida = req.body.fechaSalMat
        const flete = req.body.flete
        const material = req.body.idMaterial
        const obra = req.body.idObra

            await Salidas.create({idSalMat: lastId + 1, 
                cantSalMat: cantidadSalida,fechaSalMat:fechaSalida,
                flete:flete,idMaterial:material,idObra:obra})
            res.json({
                "message": "¡Registro creado correctamente!"
            })
            } catch (error) {
                res.json({message:error.message})
            }
}
import {CarritoSalidaMat, Materiales} from "../models/Models.js";
import { Sequelize} from "sequelize";
import db from "../database/db.js";
//import { format } from 'date-fns';



export const getAllCarritoMat = async (req,res) => {
    try{
        const carritoMat= await CarritoSalidaMat.findAll()
        res.json(carritoMat)
   }catch(error){
           res.json({message:error.message})
   }
}


export const createCarritoMat = async (req, res) => {
        try{
            const idCar = await CarritoSalidaMat.findAll({
                attributes:[[Sequelize.fn('MAX', Sequelize.col('idCar')), 'maxId']],
                raw: true,
            })
            const lastId = idCar[0]["maxId"];   
            const obraOriginal = req.body.idObraOriginal   
            const obraNueva = req.body.idObraNueva
            const material = req.body.idMaterial
            const nombreMat = req.body.nombreMat
            const cantidadSalida = req.body.cantSalida

             await CarritoSalidaMat.create({idCar: lastId + 1,
                idObraOriginal:obraOriginal,idObraNueva:obraNueva,
                idMaterial:material,nombreMat:nombreMat,
                cantSalida:cantidadSalida })
                res.json({
                    "message": "¡Registro creado correctamente!"
                })
            
        }  catch (error){
            res.json({message: error.message})
        }
}

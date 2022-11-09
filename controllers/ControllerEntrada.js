import {Entrada} from "../models/Modelos.js";
import { Sequelize } from "sequelize";
import db from "../database/db.js";


export const getAllEntradas = async (req,res) => {
    try{
        const entradaMat= await db.query(
            'SELECT e.idObra, e.cantEntMat,e.precioUni,e.fechaEntMat, m.nombreMat,b.nombreBod from  entradamateriales e JOIN materiales m ON m.idMaterial=e.idMaterial JOIN bodegas b ON b.idBodega=e.idBodega'
            ,{type:db.QueryTypes.SELECT}
        )
        res.json(entradaMat)
        console.log(entradaMat)
    }catch(error){
            res.json({message:error.message})
    }
}

export const createEntrada = async  (req,res) =>{
    try {
        const idEntrada = await Entrada.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idEntMat')), 'maxId']],
            raw: true,
        })
        const lastId = idEntrada[0]["maxId"];   
        const cantEnt = req.body.cantEntMat
        const precio = req.body.precioUni
        const material = req.body.idMaterial
        const obra = req.body.idObra
        const bodega = req.body.idBodega
        const fecha = req.body.fechaEntMat

        //await ModelCategoria.create(req.body)
       
            await Entrada.create({idEntMat: lastId + 1,cantEntMat:cantEnt,
            precioUni:precio,idMaterial:material,
            idObra:obra,idBodega:bodega,fechaEntMat:fecha})
            res.json({
                "message": "Registro creado correctamente"
                
            })
            } catch (error) {
                res.json({message:error.message})
            }
}
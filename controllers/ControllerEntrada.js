import {Entrada, Materiales} from "../models/Models.js";
import { Sequelize } from "sequelize";
import db from "../database/db.js";


export const getAllEntradas = async (req,res) => {
    try{
        const entradaMat= await db.query(
            'SELECT e.idObra, e.cantEntMat,e.precioUni, m.nombreMat,b.nombreBod, e.fechaEntMat from  entrada_materiales e JOIN materiales m ON m.idMaterial=e.idMaterial JOIN bodegas_materiales b ON b.idBodega=e.idBodega'
            ,{type:db.QueryTypes.SELECT}
        )
        res.json(entradaMat)
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

        const resultado = await Materiales.findAll({
            where:{idMaterial: material}
        })
        
        //console.log("stock:  "+resultado[0].stockMat + " idMat " + resultado[0].idMaterial)
        let totalMat = resultado[0].stockMat
        let cantidad = parseInt(cantEnt)
        let stockFinal= totalMat+(cantidad)
        //console.log(totalMat)
        //console.log(stockFinal)
        //await ModelCategoria.create(req.body)
            await Materiales.update({stockMat:stockFinal},{
                where:{
                    idMaterial:material}
            })

            await Entrada.create({idEntMat: lastId + 1,cantEntMat:cantEnt,
            precioUni:precio,idMaterial:material,
            idObra:obra,idBodega:bodega,fechaEntMat:fecha,flete:0,estadoEntrada:1})
            res.json({
                "message": "Registro creado correctamente"
                
            })
            } catch (error) {
                res.json({message:error.message})
            }
}
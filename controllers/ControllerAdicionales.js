import { ModelAdicionales } from "../models/Models.js";
import { Sequelize } from "sequelize";
import db from "../database/db.js";

export const getAllAdicionales = async (req, res) => {
    try{
        const adicionales = await db.query(
            'SELECT * FROM adicionales where estadoAdicional = 1',
            {type: db.QueryTypes.SELECT}
        )
        res.json(adicionales)
    } catch (error){
        res.json({message: error.message})
    }
}

export const getAdicional = async (req, res) => {
    try{
        const adicional = await ModelAdicionales.findAll({
            where:{idAdicional:req.params.id}
        })
        res.json(adicional[0])
    } catch (error){
        res.json({message: error.message})
    }
}

export const createAdicional = async (req, res) => {
    try{
        const idAd = await ModelAdicionales.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idAdicional')), 'maxId']],
            raw: true,
        })
        const lastId = idAd[0]["maxId"];   
        const nombreAd = req.body.nombreAdicional        
        const resultado = await ModelAdicionales.findAll({
            where:{nombreAdicional:nombreAd}
        })
        if(resultado.length === 0){
            await ModelAdicionales.create({idAdicional: lastId + 1, 
                nombreAdicional: nombreAd, estadoAdicional:1})
            res.json({
                "message": "¡Registro creado correctamente!"
            })
        }else{
            res.json({
                "message": "Ya existe"
            })
        }
    }  catch (error){
        res.json({message: error.message})
    }
}

export const updateAdicional = async (req, res) => {
    try{
        const nombreAd = req.body.nombreAdicional
        const resultado = await ModelAdicionales.findAll({
            where:{nombreAdicional:nombreAd}
        })
        if(resultado.length === 0){
            await ModelAdicionales.update(req.body, {
                where:{idAdicional:req.params.id}
            })        
            res.json({
                "message": "¡Registro actualizado correctamente!"
            })
        }else{
            res.json({
                "message": "Ya existe"
            })
        }
        
    } catch (error){
        res.json({message: error.message})
    }
}

export const deleteAdicional = async (req, res) => {
    try{
        const resultado = await ModelAdicionales.findAll({
            where:{idAdicional:req.params.id}
        })
        const nombre = resultado[0].dataValues.nombreAdicional
        console.log(nombre+"-eliminado")
        await ModelAdicionales.update({nombreAdicional: nombre + "-eliminado", estadoAdicional:0}, {
            where:{idAdicional:req.params.id}
        })
        res.json({
            "message": "¡Registro eliminado correctamente!"
        })
    } catch (error){
        res.json({message: error.message})
    }
}
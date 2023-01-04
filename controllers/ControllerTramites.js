import { ModelTramites } from "../models/Models.js";
import { Sequelize } from "sequelize";
import db from "../database/db.js";

export const getAllTramites = async (req, res) => {
    try{
        const tramites = await db.query(
            'SELECT * FROM tramites where estadoTramite = 1',
            {type: db.QueryTypes.SELECT}
        )
        res.json(tramites)
    } catch (error){
        res.json({message: error.message})
    }
}

export const getTramite = async (req, res) => {
    try{
        const tramite = await ModelTramites.findAll({
            where:{idTramite:req.params.id}
        })
        res.json(tramite[0])
    } catch (error){
        res.json({message: error.message})
    }
}

export const createTramite = async (req, res) => {
    try{
        const idTra = await ModelTramites.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idTramite')), 'maxId']],
            raw: true,
        })
        const lastId = idTra[0]["maxId"];   
        const nombreTra = req.body.nombreTramite        
        const resultado = await ModelTramites.findAll({
            where:{nombreTramite:nombreTra}
        })
        if(resultado.length === 0){
            await ModelTramites.create({idTramite: lastId + 1, 
                nombreTramite: nombreTra, estadoTramite:1})
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

export const updateTramite = async (req, res) => {
    try{
        const nombreTra = req.body.nombreTramite
        const resultado = await ModelTramites.findAll({
            where:{nombreTramite:nombreTra}
        })
        if(resultado.length === 0){
            await ModelTramites.update(req.body, {
                where:{idTramite:req.params.id}
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

export const deleteTramite = async (req, res) => {
    try{
        const resultado = await ModelTramites.findAll({
            where:{idTramite:req.params.id}
        })
        const nombre = resultado[0].dataValues.nombreTramite
        console.log(nombre+"-eliminado")
        await ModelTramites.update({nombreTramite: nombre + "-eliminado", estadoTramite:0}, {
            where:{idTramite:req.params.id}
        })
        res.json({
            "message": "¡Registro eliminado correctamente!"
        })
    } catch (error){
        res.json({message: error.message})
    }
}
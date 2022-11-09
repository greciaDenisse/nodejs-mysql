import { ModelAreas } from "../models/Models.js";
import { Sequelize } from "sequelize";
import db from "../database/db.js";

export const getAllAreas = async (req, res) => {
    try{
        const areas = await db.query(
            'SELECT * FROM areas where estadoArea = 1',
            {type: db.QueryTypes.SELECT}
        )
        res.json(areas)
    } catch (error){
        res.json({message: error.message})
    }
}

export const getArea = async (req, res) => {
    try{
        const area = await ModelAreas.findAll({
            where:{idArea:req.params.id}
        })
        res.json(area[0])
    } catch (error){
        res.json({message: error.message})
    }
}

export const createArea = async (req, res) => {
    try{
        const idAr = await ModelAreas.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idArea')), 'maxId']],
            raw: true,
        })
        const lastId = idAr[0]["maxId"];   
        const nombreAr = req.body.nombreArea        
        const resultado = await ModelAreas.findAll({
            where:{nombreArea:nombreAr}
        })
        if(resultado.length === 0){
            await ModelAreas.create({idArea: lastId + 1, 
                nombreArea: nombreAr, estadoArea:1})
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

export const updateArea = async (req, res) => {
    try{
        const nombreAr = req.body.nombreArea        
        const resultado = await ModelAreas.findAll({
            where:{nombreArea:nombreAr}
        })
        if(resultado.length === 0){
            await ModelAreas.update(req.body, {
                where:{idArea:req.params.id}
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

export const deleteArea = async (req, res) => {
    try{
        const resultado = await ModelAreas.findAll({
            where:{idArea:req.params.id}
        })
        const nombre = resultado[0].dataValues.nombreArea
        console.log(nombre+"-eliminado")
        await ModelAreas.update({nombreArea: nombre + "-eliminado", estadoArea:0}, {
            where:{idArea:req.params.id}
        })
        res.json({
            "message": "¡Registro eliminado correctamente!"
        })
    } catch (error){
        res.json({message: error.message})
    }
}
import { ModelMaquinarias } from "../models/Models.js";
import { Sequelize } from "sequelize";
import db from "../database/db.js";

export const getAllMaquinarias = async (req, res) => {
    try{
        const maquinarias = await db.query(
            'SELECT * FROM maquinarias where estadoMaquinaria = 1',
            {type: db.QueryTypes.SELECT}
        )
        res.json(maquinarias)
    } catch (error){
        res.json({message: error.message})
    }
}

export const getMaquinaria = async (req, res) => {
    try{
        const maquinaria = await ModelMaquinarias.findAll({
            where:{idMaquinaria:req.params.id}
        })
        res.json(maquinaria[0])
    } catch (error){
        res.json({message: error.message})
    }
}

export const createMaquinaria = async (req, res) => {
    try{
        const idMaq = await ModelMaquinarias.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idMaquinaria')), 'maxId']],
            raw: true,
        })
        const lastId = idMaq[0]["maxId"];   
        const nombreMaq = req.body.nombreMaquinaria        
        const resultado = await ModelMaquinarias.findAll({
            where:{nombreMaquinaria:nombreMaq}
        })
        if(resultado.length === 0){
            await ModelMaquinarias.create({idMaquinaria: lastId + 1, 
                nombreMaquinaria: nombreMaq, estadoMaquinaria:1})
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

export const updateMaquinaria = async (req, res) => {
    try{
        const nombreMaq = req.body.nombreMaquinaria
        const resultado = await ModelMaquinarias.findAll({
            where:{nombreMaquinaria:nombreMaq}
        })
        if(resultado.length === 0){
            await ModelMaquinarias.update(req.body, {
                where:{idMaquinaria:req.params.id}
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

export const deleteMaquinaria = async (req, res) => {
    try{
        const resultado = await ModelMaquinarias.findAll({
            where:{idMaquinaria:req.params.id}
        })
        const nombre = resultado[0].dataValues.nombreMaquinaria
        console.log(nombre+"-eliminado")
        await ModelMaquinarias.update({nombreMaquinaria: nombre + "-eliminado", estadoMaquinaria:0}, {
            where:{idMaquinaria:req.params.id}
        })
        res.json({
            "message": "¡Registro eliminado correctamente!"
        })
    } catch (error){
        res.json({message: error.message})
    }
}
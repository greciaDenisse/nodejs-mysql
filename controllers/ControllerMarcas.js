import { ModelMarcas } from "../models/Models.js";
import { Sequelize } from "sequelize";
import db from "../database/db.js";

export const getAllMarcas = async (req, res) => {
    try{
        const marcas = await db.query(
            'SELECT * FROM marcas_her where estadoMarca = 1',
            {type: db.QueryTypes.SELECT}
        )
        res.json(marcas)
    } catch (error){
        res.json({message: error.message})
    }
}

export const getMarca = async (req, res) => {
    try{
        const marca = await ModelMarcas.findAll({
            where:{idMarca:req.params.id}
        })
        res.json(marca[0])
    } catch (error){
        res.json({message: error.message})
    }
}

export const createMarca = async (req, res) => {
    try{
        const idMar = await ModelMarcas.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idMarca')), 'maxId']],
            raw: true,
        })
        const lastId = idMar[0]["maxId"];   
        const nombreMar = req.body.nombreMarca        
        const resultado = await ModelMarcas.findAll({
            where:{nombreMarca:nombreMar}
        })
        if(resultado.length === 0){
            await ModelMarcas.create({idMarca: lastId + 1, 
                nombreMarca: nombreMar, estadoMarca:1})
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

export const updateMarca = async (req, res) => {
    try{
        const nombreMar = req.body.nombreMarca        
        const resultado = await ModelMarcas.findAll({
            where:{nombreMarca:nombreMar}
        })
        if(resultado.length === 0){
            await ModelMarcas.update(req.body, {
                where:{idMarca:req.params.id}
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

export const deleteMarca = async (req, res) => {
    try{
        const resultado = await ModelMarcas.findAll({
            where:{idMarca:req.params.id}
        })
        const nombre = resultado[0].dataValues.nombreMarca
        console.log(nombre+"-eliminado")
        await ModelMarcas.update({nombreMarca: nombre + "-eliminado", estadoMarca:0}, {
            where:{idMarca:req.params.id}
        })
        res.json({
            "message": "¡Registro eliminado correctamente!"
        })
    } catch (error){
        res.json({message: error.message})
    }
}
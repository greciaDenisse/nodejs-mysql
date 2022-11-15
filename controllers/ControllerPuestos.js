import { ModelPuestos } from "../models/Models.js"; 
import { Sequelize } from "sequelize";
import db from "../database/db.js";

export const getAllPuestos = async (req, res) => {
    try{
        const puestos = await db.query(
            'SELECT * FROM puestos where estadoPuesto = 1',
            {type: db.QueryTypes.SELECT}
        )
        res.json(puestos)
    } catch (error){
        res.json({message: error.message})
    }
}

export const getPuesto = async (req, res) => {
    try{
        const puesto = await ModelPuestos.findAll({
            where:{idPuesto:req.params.id}
        })
        res.json(puesto[0])
    } catch (error){
        res.json({message: error.message})
    }
}

export const createPuesto = async (req, res) => {
    try{
        const idPu = await ModelPuestos.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idPuesto')), 'maxId']],
            raw: true,
        })
        const lastId = idPu[0]["maxId"];   
        const nombrePu = req.body.nombrePuesto
        const resultado = await ModelPuestos.findAll({
            where:{nombrePuesto:nombrePu}
        })
        if(resultado.length === 0){
            await ModelPuestos.create({idPuesto: lastId + 1, 
                nombrePuesto: nombrePu, estadoPuesto:1})
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

export const updatePuesto = async (req, res) => {
    try{       
        await ModelPuestos.update(req.body, {
            where:{idPuesto:req.params.id}
        })        
        res.json({
            "message": "¡Registro actualizado correctamente!"
        })
    } catch (error){
        res.json({message: error.message})
    }
}

export const deletePuesto = async (req, res) => {
    try{
        const resultado = await ModelPuestos.findAll({
            where:{idPuesto:req.params.id}
        })
        const nombre = resultado[0].dataValues.nombrePuesto
        await ModelPuestos.update({nombrePuesto: nombre + "-eliminado", estadoPuesto:0}, {
            where:{idPuesto:req.params.id}
        })
        res.json({
            "message": "¡Registro eliminado correctamente!"
        })
    } catch (error){
        res.json({message: error.message})
    }
}
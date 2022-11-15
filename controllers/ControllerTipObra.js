import {TipObra} from "../models/Models.js";
import { Sequelize } from "sequelize";
import db from "../database/db.js";

export const getAllTipo = async (req,res) => {
    try{
        const obrasTipo= await db.query(
            'select idTipoObra,nombreTipoObra from tipos_obra where estadoTipoObra=1',
            {type:db.QueryTypes.SELECT}
        )
        res.json(obrasTipo)
    }catch(error){
            res.json({message:error.message})
    }
}
//mostrar un registro

export const getTipo =  async (req,res)=>{
    try{
       const tipo = await TipObra.findAll({
            where:{
                idTObra:req.params.id}
        })
        res.json(tipo[0])
    } catch (error){
        res.json({message:error.message})
    }
}
//crear registro

export const createTipo = async  (req,res) =>{
    try {
        const idTipo = await TipObra.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idTObra')), 'maxId']],
            raw: true,
        })
        const lastId = idTipo[0]["maxId"];   
        const nombreTipo = req.body.nombreTObra

        const resultado = await TipObra.findAll({
            where:{nombreTObra:nombreTipo}
        })
        //await ModelCategoria.create(req.body)
        if(resultado.length === 0){
            await TipObra.create({idTObra: lastId + 1, 
                nombreTObra: nombreTipo,estadoTObra:1})
            res.json({
                "message": "¡Registro creado correctamente!"
                
            })
        }else{
            res.json({
                "message": "Ya existe"
            })
        }

    } catch (error) {
        res.json({message:error.message})
    }
}
//modificar

export const updateTipo =  async (req,res)=>{
    try{
        const nombreTipo = req.body.nombreTObra
        const resultado = await TipObra.findAll({
            where:{nombreTObra:nombreTipo}
        })
        if(resultado.length === 0){
       await TipObra.update((req.body),{
            where:{
                idTObra:req.params.id}
        })
        res.json({"message":"Registro modificado"})
        }else{
            res.json({
                "message": "Ya existe"
            })
        }
    } catch (error){
        res.json({message:error.message})
    }
}

export const deleteTipo =  async (req,res)=>{
    try{
       await TipObra.update({estadoTObra:0},{
            where:{
                idTObra:req.params.id}
        })
        res.json({"message":"registro eliminado"})
    } catch (error){
        res.json({message:error.message})
    }
}

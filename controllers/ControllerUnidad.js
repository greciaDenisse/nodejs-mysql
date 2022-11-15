import {Unidades} from "../models/Models.js";
import { Sequelize } from "sequelize";
import db from "../database/db.js";

export const getAllUnidades = async (req,res) => {
    try{
        const unidades= await db.query(
            'select idUnidad,nombreUnidad from unidades where estadoUnidad=1',
            {type:db.QueryTypes.SELECT}
        )
        res.json(unidades)
    }catch(error){
            res.json({message:error.message})
    }
}

export const getUnidad =  async (req,res)=>{
    try{
       const unidad = await Unidades.findAll({
            where:{
                idUnidad:req.params.id}
        })
        res.json(unidad[0])
    } catch (error){
        res.json({message:error.message})
    }
}

export const createUnidad = async  (req,res) =>{
    try {
        const idUnidad = await Unidades.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idUnidad')), 'maxId']],
            raw: true,
        })
        const lastId = idUnidad[0]["maxId"];   
        const nombre = req.body.nombreUnidad

        const resultado = await Unidades.findAll({
            where:{nombreUnidad:nombre}
        })
        //await ModelCategoria.create(req.body)
        if(resultado.length === 0){
            await Unidades.create({idUnidad: lastId + 1, 
                nombreUnidad: nombre,estadoUnidad:1})
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

export const updateUnidad =  async (req,res)=>{
    try{
        const nombre = req.body.nombreUnidad

        const resultado = await Unidades.findAll({
            where:{nombreUnidad:nombre}
        })
        if(resultado.length === 0){
       await Unidades.update((req.body),{
            where:{
                idUnidad:req.params.id}
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


export const deleteUnidad =  async (req,res)=>{
    try{

        const resultado = await Unidades.findAll({
            where:{idUnidad:req.params.id}
        })
        const codigo=resultado[0].nombreUnidad

       await Unidades.update({estadoUnidad:0,nombreUnidad:codigo+"-eliminado"},{
            where:{
                idUnidad:req.params.id}
        })
        res.json({"message":"registro eliminado"})
    } catch (error){
        res.json({message:error.message})
    }
}

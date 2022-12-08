import { Bodegas } from "../models/Models.js"
import { Sequelize } from "sequelize";
import db from "../database/db.js";

export const getAllBodegas = async (req,res) => {
    try{
        const bodegas= await db.query(
            'select idBodega,nombreBod,direccionBod from bodegas_materiales where estadoBod=1',
            {type:db.QueryTypes.SELECT}
        )
        res.json(bodegas)
   }catch(error){
           res.json({message:error.message})
   }
}

export const getBodega =  async (req,res)=>{
    try{
       const bodega = await Bodegas.findAll({
            where:{
                idBodega:req.params.id}
        })
        res.json(bodega[0])
    } catch (error){
        res.json({message:error.message})
    }
}

export const createBodega = async  (req,res) =>{
    try {
        const idBodega = await Bodegas.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idBodega')), 'maxId']],
            raw: true,
        })
        const lastId = idBodega[0]["maxId"];   
        const nombre = req.body.nombre
        const direccion = req.body.direccion

        const resultado = await Bodegas.findAll({
            where:{nombreBod:nombre}
        })
        //await ModelCategoria.create(req.body)
        if(resultado.length === 0){
            await Bodegas.create({idBodega: lastId + 1, 
                nombreBod: nombre,estadoBod:1,direccionBod:direccion})
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

export const updateBodega =  async (req,res)=>{
    try{
        const nombre = req.body.nombre
        const direccion = req.body.direccion

        const resultado = await Bodegas.findAll({
            where:{nombreBod:nombre}
        })
            if(resultado.length === 0){
                    await Bodegas.update({nombreBod:nombre,direccionBod:direccion},
                    {
                            where:{
                                idBodega:req.params.id}
                    })
                    res.json({"message":"Registro modificado"})
                }else{
                    await Bodegas.update({direccionBod:direccion},
                        {
                                where:{
                                    idBodega:req.params.id}
                        })
                        res.json({"message":"Registro modificado"})
                }
    } catch (error){
        res.json({message:error.message})
    }
}

export const deleteBodega=  async (req,res)=>{
    try{

        const resultado = await Bodegas.findAll({
            where:{idBodega:req.params.id}
        })
        const codigo=resultado[0].nombreBod

       await Bodegas.update({estadoBod:0,nombreBod:codigo+"-eliminado"},{
            where:{
                idBodega:req.params.id}
        })
        res.json({"message":"registro eliminado"})
    } catch (error){
        res.json({message:error.message})
    }
}
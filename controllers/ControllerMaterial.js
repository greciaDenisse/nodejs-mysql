import {Materiales} from "../models/Models.js";
import { Sequelize } from "sequelize";
import db from "../database/db.js";
//**mostrar todo **/

export const getAllMat = async (req,res) => {
    try{
         const materiales= await Materiales.findAll()
         res.json(materiales)
    }catch(error){
            res.json({message:error.message})
    }
}

export const getMatActivo = async (req,res) => {
    try{
         const materiales= await db.query(
             'select m.idMaterial,m.codigoMat,m.nombreMat,m.stockMat,m.idCatMat,u.nombreUnidad from materiales m JOIN unidades_materiales u ON u.idUnidad = m.idUnidad where m.estadoMat=1',
             {type:db.QueryTypes.SELECT}
         )
         res.json(materiales)
    }catch(error){
            res.json({message:error.message})
    }
}

//mostrar un registro

export const getMat =  async (req,res)=>{
    try{
       const material = await Materiales.findAll({
            where:{
             idMaterial:req.params.id}
        })
        res.json(material[0])
    } catch (error){
        res.json({message:error.message})
    }
}

//crear registro

export const createMat = async (req,res) =>{
    try {
        const idMat = await Materiales.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idMaterial')), 'maxId']],
            raw: true,
        })

        const lastId = idMat[0]["maxId"];
        const codigo = req.body.codigoMat  
        const nombre = req.body.nombreMat
        const unidad = req.body.idUnidad
        const idCat = req.body.idCatMat

        const resultado = await Materiales.findAll({
            where:{codigoMat:codigo}
        })
        if(resultado.length === 0){
            const resnom = await Materiales.findAll({
                where:{nombreMat:nombre,idUnidad:unidad}
            })
            if(resnom.length === 0){
                await Materiales.create({idMaterial: lastId + 1, 
                    codigoMat:codigo, nombreMat: nombre, estadoMat:1,idUnidad:unidad,stockMat:0,idCatMat:idCat})
                res.json({
                    "message": "¡Registro creado correctamente!"                   
                })
            }else{
                res.json({
                    "message": "Nombre y unidad ya registrados"                   
                })
            }        
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

export const updateMat =  async (req,res)=>{
    try{
        const codigo = req.body.codigoMat  
        const nombre = req.body.nombreMat
        const unidad = req.body.idUnidad

        const resultado = await Materiales.findAll({
            where:{codigoMat:codigo}
        })
        if(resultado.length === 0){
            const resnom = await Materiales.findAll({
                where:{nombreMat:nombre,idUnidad:unidad}
            })
            if(resnom.length === 0){
                await Materiales.update({codigoMat:codigo,nombreMat:nombre,idUnidad:unidad},{
                    where:{
                        idMaterial:req.params.id}
                })
                res.json({
                    "message": "¡Registro modificado correctamente!"                   
                })
            }else{
                await Materiales.update({codigoMat:codigo},{
                    where:{
                        idMaterial:req.params.id}
                })
                res.json({
                    "message": "¡Registro modificado correctamente!"                   
                })
            }        
        }else{
            if(resultado[0].dataValues.codigoMat===codigo){
                const resnomuni = await Materiales.findAll({
                    where:{nombreMat:nombre,idUnidad:unidad}
                })
                if(resnomuni.length === 0){
                    await Materiales.update({nombreMat:nombre,idUnidad:unidad},{
                        where:{
                            idMaterial:req.params.id}
                    })
                    res.json({
                        "message": "¡Registro modificado correctamente!"                   
                    })
                }else{
                    res.json({
                        "message": "Nombre y unidad ya registrados"                   
                    })
                }    
            }else{
                res.json({
                    "message": "Ya existe"
                })
            }  
        }
    } catch (error){
        res.json({message:error.message})
    }
}

export const deleteMat =  async (req,res)=>{
    try{
        const resultado = await Materiales.findAll({
            where:{idMaterial:req.params.id}
        })
        const codigo=resultado[0].codigoMat

            await Materiales.update({estadoMat:0,codigoMat:codigo+"-eliminado"},{
                where:{
                    idMaterial:req.params.id}
            })
            res.json({"message":"registro eliminado"})

    } catch (error){
        res.json({message:error.message})
    }
}

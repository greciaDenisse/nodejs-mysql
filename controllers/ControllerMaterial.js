import {Materiales} from "../models/Modelos.js";
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
             'select idMaterial,codigoMat,nombreMat,unidadMat,stockMat,idCatMat from materiales where estadoMat=1',
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
        const nombre = req.body.nombreMat
        const unidad = req.body.unidadMat
        const idCat = req.body.idCatMat

        // realizar una consulta en la tabla materiales pasandole como parametro el id de la categoria
        //para que regrese el nombre de la categoria
        const categoriaSelect= await db.query(
            'SELECT nombreCatMat FROM catMateriales WHERE idCatMat = ?',
            {
              replacements: [idCat],
              type: db.QueryTypes.SELECT
            }
        )

        let nombreCate=categoriaSelect[0].nombreCatMat
        //indicamos el codigo utilizando el nombre de la categoria, la unidad, nombre del material, etc
        const cadenaCate = nombreCate.substring(0,3);
        const cadenaNombre = nombre.substring(0,3);
        const cadenaunidad = unidad.substring(0,3);
        const numeroMat = lastId+1
        const myString = cadenaCate+numeroMat.toString()+cadenaNombre+cadenaunidad;

        const resultado = await Materiales.findAll({
            where:{codigoMat:myString}
        })
        if(resultado.length === 0){
            await Materiales.create({idMaterial: lastId + 1, 
                codigoMat:myString, nombreMat: nombre, estadoMat:1,unidadMat:unidad,stockMat:0,idCatMat:idCat})
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

export const updateMat =  async (req,res)=>{
    try{
        const nombre = req.body.nombreMat
        const unidad = req.body.unidadMat

        const tablaCate = await Materiales.findAll({
            where:{idMaterial:req.params.id}
        })
        //obtener id de la categoria y id del material para modificar el codigo
        const numCate= tablaCate[0].idCatMat
        const numeroId= tablaCate[0].idMaterial

        // realizar una consulta en la tabla materiales pasandole como parametro el id de la categoria
        //para que regrese el nombre de la categoria
        const categoriaSelect= await db.query(
            'SELECT nombreCatMat FROM catMateriales WHERE idCatMat = ?',
            {
              replacements: [numCate],
              type: db.QueryTypes.SELECT
            }
        )
        let nombreCate=categoriaSelect[0].nombreCatMat

        //indicamos el codigo utilizando el nombre de la categoria, la unidad, nombre del material
        const cadenaCate = nombreCate.substring(0,3);
        const cadenaNombre = nombre.substring(0,3);
        const cadenaunidad = unidad.substring(0,3);
        const numeroMat = numeroId.toString()
        const myString = cadenaCate+numeroMat+cadenaNombre+cadenaunidad;

        const resultado = await Materiales.findAll({
            where:{codigoMat:myString}
        })
        if(resultado.length === 0){
       await Materiales.update({codigoMat:myString,nombreMat:nombre,unidadMat:unidad},{
            where:{
                idMaterial:req.params.id}
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

import { CartHerramientasEnt, ModelSalidaHerramientas } from "../models/Models.js";
import { Sequelize } from "sequelize";
import db from "../database/db.js";

export const getListaEnt = async (req,res) => {
    try{
        const lista = await CartHerramientasEnt.findAll()
        res.json(lista)
    }catch (error){
        res.json({message: error.message})
    }
}

export const createListaEnt = async (req,res) =>{
    try{
       const idOb = req.body.idObra
        const idH = req.body.idHer
        const codH = req.body.codHer
        const nomH = req.body.nomHer
        const obsH = req.body.observacion
        const idList = await CartHerramientasEnt.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idCartEnt')), 'maxId']],
            raw: true,
        })
        const lastId = idList[0]["maxId"];
        await CartHerramientasEnt.create({idCartEnt: lastId + 1, 
            idObra: idOb, idHerramienta:idH, codHerramienta:codH,
            nomHerramienta:nomH, observacion: obsH
        })
        await ModelSalidaHerramientas.update({estadoSal:"devuelto"}, {
            where:{idHerramienta:idH}
        })
        console.log("Estado modificado")
        res.json({
            "message": "¡Herramienta agregada!"
        })
    }catch (error){
        res.json({message: error.message})
    }
}

export const deleteHerEnt = async (req,res) =>{
    try{
        const idH = req.body.idHerra
        await ModelSalidaHerramientas.update({estadoSal:"prestado"}, {
            where:{idHerramienta:idH}
        })
        await CartHerramientasEnt.destroy({
            where:{idCartEnt:req.params.id}
        })
        res.json({
            "message": "¡Herramienta eliminada!"
        })
    }catch (error){
        res.json({message: error.message})
    }
}

export const deleteListEnt = async (req,res) =>{
    try{        
        const lista = await CartHerramientasEnt.findAll()
        const arrayIdHer = []       
        for (let i = 0; i < lista.length; i++) {           
            arrayIdHer.push({id:lista[i].dataValues.idHerramienta})
        }
        for (let h = 0; h < arrayIdHer.length; h++) {
            await ModelSalidaHerramientas.update({estadoSal:"prestado"}, {
                where:{idHerramienta:arrayIdHer[h].id}
            })
           console.log("Estado modificado")            
        }
        await CartHerramientasEnt.destroy({truncate: true})
        res.json({
            "message": "¡Lista eliminada!"
        })
    }catch (error){
        res.json({message: error.message})
    }
}
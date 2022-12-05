import { CartHerramientas, ModelHerramientas } from "../models/Models.js";
import { Sequelize } from "sequelize";
import db from "../database/db.js";

export const getLista = async (req,res) => {
    try{
        const lista = await CartHerramientas.findAll()
        res.json(lista)
    }catch (error){
        res.json({message: error.message})
    }
}

export const createLista = async (req,res) =>{
    try{
        console.log(req.body.lista)
        const lista = JSON.parse(req.body.lista) 
        console.log(lista)
        console.log(req.body.obra)
        /*const idOb = req.body.idObra
        const idH = req.body.idHer
        const codH = req.body.codHer
        const nomH = req.body.nomHer
        const idList = await CartHerramientas.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idCart')), 'maxId']],
            raw: true,
        })
        const lastId = idList[0]["maxId"];
        await CartHerramientas.create({idCart: lastId + 1, 
            idObra: idOb, idHerramienta:idH, codHerramienta:codH,
            nomHerramienta:nomH
        })
        await ModelHerramientas.update({statusHer:"no disponible"}, {
            where:{idHerramienta:idH}
        })
        console.log("Estado modificado")*/ 
        res.json({
            "message": "¡Herramienta agregada!"
        })
    }catch (error){
        res.json({message: error.message})
    }
}

export const deleteHer = async (req,res) =>{
    try{
        const idH = req.body.idHerra
        console.log(idH)
        await ModelHerramientas.update({statusHer:"disponible"}, {
            where:{idHerramienta:idH}
        })
        await CartHerramientas.destroy({
            where:{idCart:req.params.id}
        })
        res.json({
            "message": "¡Herramienta eliminada!"
        })
    }catch (error){
        res.json({message: error.message})
    }
}

export const deleteList = async (req,res) =>{
    try{
        console.log(req.params.id,req.params.ido)
        await CartHerramientas.update({nomHerramienta:"new"},{
            where:{idCart:req.params.id, idObra:req.params.ido}
        })
        /*await CartHerramientas.destroy({
            where:{idCart:req.params.id, idObra:req.params.ido}
        })
        const lista = await CartHerramientas.findAll()
        console.log(lista.length)
        const arrayIdHer = []       
        for (let i = 0; i < lista.length; i++) {           
            arrayIdHer.push({id:lista[i].dataValues.idHerramienta})
        }
        console.log(arrayIdHer)
        for (let h = 0; h < arrayIdHer.length; h++) {
            await ModelHerramientas.update({statusHer:"disponible"}, {
                where:{idHerramienta:arrayIdHer[h].id}
            })
           console.log("Estado modificado")            
        }
        await CartHerramientas.destroy({truncate: true})*/
        res.json({
            "message": "¡Lista eliminada!"
        })
    }catch (error){
        res.json({message: error.message})
    }
}
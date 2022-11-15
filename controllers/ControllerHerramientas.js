import { ModelHerramientas } from "../models/Models.js";
import { Sequelize } from "sequelize";
import db from "../database/db.js";

export const getAllHerramientas = async (req, res) => {
    try{
        const herramientas = await  db.query(
            'SELECT * FROM herramientas where estadoHer = 1',
            {type: db.QueryTypes.SELECT}
        )
        res.json(herramientas)
    } catch (error){
        res.json({message: error.message})
    }
}

export const getHerramienta = async (req, res) => {
    try{
        const herramienta = await ModelHerramientas.findAll({
            where:{idHerramienta:req.params.id}
        })
        res.json(herramienta[0])
    } catch (error){
        res.json({message: error.message})
    }
}

export const createHerramienta = async (req, res) => {
    try{
        const idHer = await ModelHerramientas.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idHerramienta')), 'maxId']],
            raw: true,
        })
        const lastId = idHer[0]["maxId"];
        const codigoHe = req.body.codigoHer
        const nombreHe = req.body.nombreHer
        const marcaHe = req.body.idMarcaHer
        const idCat = req.body.idCategoria
        const resultado = await ModelHerramientas.findAll({
            where:{codigoHer:codigoHe}
        })
        if(resultado.length === 0){
            await ModelHerramientas.create({idHerramienta: lastId + 1,
                codigoHer: codigoHe, nombreHer: nombreHe, 
                idMarcaHer: marcaHe, idCategoria: idCat,
                statusHer:"disponible",estadoHer:1})
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

export const updateHerramienta = async (req, res) => {
    try{
        const codigo = req.body.codigoHer
        const nombre = req.body.nombreHer
        const marca = req.body.idMarcaHer
        const estado = req.body.statusHer

        const resultado = await ModelHerramientas.findAll({
            where:{codigoHer:codigo}
        })
        
        if(resultado.length === 0){
            await ModelHerramientas.update(req.body, {
                where:{idHerramienta:req.params.id}
            })        
            res.json({
                "message": "¡Registro actualizado correctamente!"
            })
        }else{
            const resul = await ModelHerramientas.findAll({
                where:{idHerramienta:req.params.id}
            })
            if(resul[0].dataValues.codigoHer === codigo){
                await ModelHerramientas.update({nombreHer:nombre,idMarcaHer:marca,statusHer:estado}, {
                    where:{idHerramienta:req.params.id}
                })        
                res.json({
                    "message": "¡Registro actualizado correctamente!"
                })
            }else{
                res.json({
                    "message": "Ya existe"
                })
            }
                
            
        }
        
    } catch (error){
        res.json({message: error.message})
    }
}

export const deleteHerramienta = async (req, res) => {
    try{
        const resultado = await ModelHerramientas.findAll({
            where:{idHerramienta:req.params.id}
        })
        const nombre = resultado[0].dataValues.nombreHer
        console.log(nombre+"-eliminado")
        await ModelHerramientas.update({nombreHer: nombre + "-eliminado", estadoHer:0}, {
            where:{idHerramienta:req.params.id}
        })
        res.json({
            "message": "¡Registro eliminado correctamente!"
        })
    } catch (error){
        res.json({message: error.message})
    }
}
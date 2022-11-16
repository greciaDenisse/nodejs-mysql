import {ModelCatHer} from "../models/Models.js";
import { Sequelize } from "sequelize";
import {rename, unlink} from 'node:fs';
import multer from "multer";
import db from "../database/db.js";

export const getAllCatHer = async (req, res) => {
    try{
        const categorias = await  db.query(
            'SELECT * FROM categoria_herramientas where estadoCatHer = 1',
            {type: db.QueryTypes.SELECT}
        )
        res.json(categorias)
    } catch (error){
        res.json({message: error.message})
    }
}

export const getCatHer = async (req, res) => {
    try{
        const categoria = await ModelCatHer.findAll({
            where:{idCatHer:req.params.id}
        })
        res.json(categoria[0])
    } catch (error){
        res.json({message: error.message})
    }
}

const diskstorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, './images')
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    }
})
export const uploadcather = multer({
    storage: diskstorage
})

export const createCatHer = async (req, res) => {
    try{        
        const nombre = req.body.name
        const namefile =req.file.originalname
        const newname = 'cather-'+nombre+'.png'

        rename('./images/'+namefile, './images/'+newname, (err) => {
            if (err) throw err;
            console.log('Rename complete!');
        });
        
        console.log(req.file.originalname)
        console.log(nombre)
        const idCat = await ModelCatHer.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idCatHer')), 'maxId']],
            raw: true,
        })
        const lastId = idCat[0]["maxId"];   
        const resultado = await ModelCatHer.findAll({
            where:{nombreCatHer:nombre}
        })
        if(resultado.length === 0){
            await ModelCatHer.create({idCatHer: lastId + 1, 
                nombreCatHer: nombre, imagenCatHer:newname, estadoCatHer:1})
            res.json({
                "message": "¡Registro creado correctamente!"
            })
        }else{
            res.json({
                "message": "Ya existe"
            })
            unlink('./images/'+newname, (err) => {
                if (err) throw err;
                console.log('Image was deleted');
            });
        }  
    }  catch (error){
        res.json({message: error.message})
    }
}

export const updateCatHer = async (req, res) => {
    try{
        if(req.body.nombreCatHer === undefined){
            const nombre = req.body.name
            const namefile =req.file.originalname
            const newname = 'cather-'+nombre+'.png'
            rename('./images/'+namefile, './images/'+newname, (err) => {
                if (err) throw err;
                console.log('Rename complete!');
            });
            console.log(req.file.originalname)
            console.log(req.body.name)

            const resultado = await ModelCatHer.findAll({
                where:{nombreCatHer:nombre}
            })
            console.log(resultado[0].dataValues.nombreCatHer)
            if(resultado.length === 0){                
                await ModelCatHer.update({nombreCatHer:nombre, imagenCatHer:newname}, {
                    where:{idCatHer:req.params.id}
                })
                
                res.json({
                    "message": "¡Registro actualizado correctamente!"
                })
            }else{
                if(resultado[0].dataValues.nombreCatHer === nombre){
                    await ModelCatHer.update({imagenCatHer:newname}, {
                        where:{idCatHer:req.params.id}
                    })                    
                    res.json({
                        "message": "¡Registro actualizado correctamente!"
                    })
                }else{
                    res.json({
                        "message": "Ya existe"
                    })                
                    unlink('./images/'+newname, (err) => {
                        if (err) throw err;
                        console.log('Image was deleted');
                    });
                }
                /*res.json({
                    "message": "Ya existe"
                })                
                unlink('./images/'+newname, (err) => {
                    if (err) throw err;
                    console.log('Image was deleted');
                });*/
            }
            
        }else{
            const nombreCate = req.body.nombreCatHer
            console.log(req.body.nombreCatHer)
            const resultado = await ModelCatHer.findAll({
                where:{nombreCatHer:nombreCate}
            })
            if(resultado.length === 0){
                await ModelCatHer.update(req.body, {
                    where:{idCatHer:req.params.id}
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

export const deleteCatHer = async (req, res) => {
    try{
        /*await ModelCategoria.destroy({
            where:{idCatHer:req.params.id}
        })*/
        const resultado = await ModelCatHer.findAll({
            where:{idCatHer:req.params.id}
        })
        const nombre = resultado[0].dataValues.nombreCatHer
        const imagen = resultado[0].dataValues.imagenCatHer
        console.log(nombre + "-eliminado")
        console.log("eliminado-"+imagen)
        await ModelCatHer.update({nombreCatHer: nombre + "-eliminado",estadoCatHer:0}, {
            where:{idCatHer:req.params.id}
        })
        unlink('./images/'+imagen, (err) => {
            if (err) throw err;
            console.log('Image was deleted');
        });
        
        res.json({
            "message": "¡Registro eliminado correctamente!"
        })
    } catch (error){
        res.json({message: error.message})
    }
}
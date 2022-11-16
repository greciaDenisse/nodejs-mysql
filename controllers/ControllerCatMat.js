import {CategoriaModel} from "../models/Models.js";
import { Sequelize } from "sequelize";
import multer from "multer";
import db from "../database/db.js";
import {rename, unlink} from 'node:fs';

//**mostrar todo **/

export const getAllCat = async (req,res) => {
    try{
        const catMateriales= await db.query(
            'select idCatMat,nombreCatMat,imagenCatMat from categoria_materiales where estadoCatMat=1',
            {type:db.QueryTypes.SELECT}
        )
        res.json(catMateriales)
    }catch(error){
            res.json({message:error.message})
    }
}

//mostrar un registro

export const getCat =  async (req,res)=>{
    try{
       const categoria = await CategoriaModel.findAll({
            where:{
                idCatMat:req.params.id}
        })
        res.json(categoria[0])
    } catch (error){
        res.json({message:error.message})
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
export const upload = multer({
    storage: diskstorage
})

//crear registro

export const createCat = async  (req,res) =>{
    try {
        const nombre = req.body.name
        const namefile =req.file.originalname
        const newname = 'catmat-'+nombre+'.png'

        rename('./images/'+namefile, './images/'+newname, (err) => {
            if (err) throw err;
            console.log('Rename complete!');
        });
        
        const idCat = await CategoriaModel.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idCatMat')), 'maxId']],
            raw: true,
        })
        const lastId = idCat[0]["maxId"];   
        const resultado = await CategoriaModel.findAll({
            where:{nombreCatMat:nombre}
        })
        //await ModelCategoria.create(req.body)
        if(resultado.length === 0){
            await CategoriaModel.create({idCatMat: lastId + 1, 
                nombreCatMat: nombre, imagenCatMat:newname, estadoCatMat:1})
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

    } catch (error) {
        res.json({message:error.message})
    }
  
}
//modificar

export const updateCat =  async (req,res)=>{
    try{
        if(req.body.nombreCatMat === undefined){
            const nombre = req.body.name
            const namefile =req.file.originalname
            const newname = 'catmat-'+nombre+'.png'
            console.log(nombre)

            rename('./images/'+namefile, './images/'+newname, (err) => {
                if (err) throw err;
            });
                        
            const resultado = await CategoriaModel.findAll({
             where:{nombreCatMat:nombre}
            })
            if(resultado.length === 0){                
                await CategoriaModel.update({nombreCatMat:nombre, imagenCatMat:newname},
                    {where:{idCatMat:req.params.id}})
                res.json({
                    "message": "¡Registro actualizado correctamente!"
                })
            }else{
                if(resultado[0].dataValues.nombreCatMat === nombre){
                    await CategoriaModel.update({imagenCatMat:newname}, {
                        where:{idCatMat:req.params.id}
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
            }
            
        }else{
            const nombreCate = req.body.nombreCatMat
            const resultado = await CategoriaModel.findAll({
                where:{nombreCatMat:nombreCate}
            })
            if(resultado.length === 0){
                await CategoriaModel.update(req.body, {
                    where:{idCatMat:req.params.id}
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

export const deleteCat =  async (req,res)=>{
    try{
        /*await ModelCategoria.destroy({
            where:{idCatHer:req.params.id}
        })*/
        const resultado = await CategoriaModel.findAll({
            where:{idCatMat:req.params.id}
        })
        const nombre = resultado[0].dataValues.nombreCatMat
        const imagen = resultado[0].dataValues.imagenCatMat
       
        await CategoriaModel.update({nombreCatMat: nombre + "-eliminado",estadoCatMat:0}, {
            where:{idCatMat:req.params.id}
        })
        unlink('./images/'+imagen, (err) => {
            if (err) throw err;
            console.log('Image was deleted');
        });
        
        res.json({
            "message": "Registro eliminado"
        })
    } catch (error){
        res.json({message: error.message})
    }
}

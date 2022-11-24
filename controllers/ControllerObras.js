import {Obras} from "../models/Models.js";
import { Sequelize } from "sequelize";
import multer from "multer";
import db from "../database/db.js";
import {rename, unlink} from 'node:fs';

export const getAllObras = async (req,res) => {
    try{
        const obras= await db.query(
            'select o.idObra,o.nombreObra,o.clienteObra,o.direccionObra,e.nombreEmp, o.fechaInicio,o.fechaFinal,o.imagenObra,t.nombreTipoObra from obras o JOIN tipos_obras t ON o.idTObra=t.idTipoObra JOIN empleados e ON e.idEmpleado = o.administrador  where o.estadoObra=1',
            {type:db.QueryTypes.SELECT}
        )
        res.json(obras)
    }catch(error){
            res.json({message:error.message})
    }
}

//mostrar un registro

export const getObra =  async (req,res)=>{
    try{
       const obras = await Obras.findAll({
            where:{
                idObra:req.params.id}
        })
        res.json(obras[0])
    } catch (error){
        res.json({message:error.message})
    }
}
//crear registro
    const diskstorage = multer.diskStorage({
        destination: (req,file,cb)=>{
            cb(null, './images')
        },
        filename: (req, file, cb)=>{
            cb(null, file.originalname)
        }
    })
    export const uploadObra = multer({
        storage: diskstorage
    })

export const createObra = async  (req,res) =>{
    try {

        const idObra = await Obras.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idObra')), 'maxId']],
            raw: true,
        })

        const lastId = idObra[0]["maxId"];   
        const nombre = req.body.name
        const cliente = req.body.cliente
        const direccion = req.body.direccion
        const fechaI = req.body.fechaI
        const fechaF = req.body.fechaF
        const idTipo = req.body.tipo
        const administrador = req.body.idAdministrador
        
        const idString= lastId+1;

        const namefile =req.file.originalname
        const newname = 'obra-'+idString.toString()+'.png'

        rename('./images/'+namefile, './images/'+newname, (err) => {
            if (err) throw err;
            console.log('Rename complete!');
        });
        
        const resultado = await Obras.findAll({
            where:{nombreObra:nombre}
        })
        if(resultado.length === 0){
            await Obras.create({idObra: lastId + 1, 
                nombreObra: nombre,clienteObra:cliente,
                direccionObra:direccion,fechaInicio:fechaI,
                fechaFinal:fechaF,administrador:administrador, 
                idTObra:idTipo,imagenObra:newname,estadoObra:1})
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

export const updateObra =  async (req,res)=>{
    try{
        if(req.body.nombreObra === undefined){
        const resultadoId = await Obras.findAll({
                where:{idObra:req.params.id}
            })
        const obraId=resultadoId[0].idObra

        const nombreObra = req.body.name
        const direccion = req.body.direccion
        const cliente = req.body.cliente
        const fechaI = req.body.fechaI
        const fechaF = req.body.fechaF
        const obraTipo = req.body.obraTipo
        //nuevo nombre
        const namefile =req.file.originalname
        const newname = 'obra-'+obraId.toString()+'.png'

        rename('./images/'+namefile, './images/'+newname, (err) => {
            if (err) throw err;
        });

        const resultado = await Obras.findAll({
            where:{nombreObra:nombreObra}
        })
        if(resultado.length === 0){
            await Obras.update({nombreObra:nombreObra,direccionObra:direccion,
                clienteObra:cliente,
                fechaInicio:fechaI,fechaFinal:fechaF,idTObra:obraTipo,
                imagenObra:newname},
                {where:{idObra:req.params.id}}) 
        res.json({"message":"Registro modificado"})
        }else{
            if(resultado[0].dataValues.nombreObra === nombreObra){
                await Obras.update({imagenObra:newname}, {
                    where:{idObra:req.params.id}
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
            const nombreObras = req.body.nombreObra
            const resultado1 = await Obras.findAll({
                where:{nombreObra:nombreObras}
            })
            if(resultado1.length === 0){
                await Obras.update(req.body , {
                    where:{idObra:req.params.id}
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
            res.json({message:error.message})
        }
}

export const deleteObra =  async (req,res)=>{
    try{

        const resultado = await Obras.findAll({
            where:{idObra:req.params.id}
        })
        const nombreObra=resultado[0].dataValues.nombreObra
        const imagen = resultado[0].dataValues.imagenObra
        
       await Obras.update({estadoObra:0,nombreObra:nombreObra+"eliminado"},{
            where:{
                idObra:req.params.id}
        })
        unlink('./images/'+imagen, (err) => {
            if (err) throw err;
            console.log('Image was deleted');
        });
        res.json({
            "message":"Registro eliminado"
        })
    } catch (error){
        res.json({message:error.message})
    }
}

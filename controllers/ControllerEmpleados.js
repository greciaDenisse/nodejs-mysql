import {  ModelEmpleados, ModelPuestos } from "../models/Models.js";
import { Sequelize, where } from "sequelize";
import moment from "moment/moment.js";
import db from "../database/db.js";

export const getAllEmpleados = async (req, res) => {
    try{
        const empleados = await db.query(
            'SELECT e.idEmpleado, e.codigoEmp, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp, e.correoEmp, e.telefonoEmp, e.fechaNacEmp, e.sexoEmp, e.sueldoEmp, e.seguroEmp, a.nombreArea, p.nombrePuesto FROM empleados e JOIN areas a ON a.idArea = e.idArea JOIN puestos p ON p.idPuesto = e.idPuesto WHERE e.estadoEmp = 1 ORDER BY nombreEmp ASC',
            {type: db.QueryTypes.SELECT}
        )
        res.json(empleados)
    } catch (error){
        res.json({message: error.message})
    }
}

export const getEmpleado = async (req, res) => {
    try{
        const empleado = await ModelEmpleados.findAll({
            where:{idEmpleado:req.params.id}
        })
        res.json(empleado[0])
    } catch (error){
        res.json({message: error.message})
    }
}

export const createEmpleado = async (req, res) => {
    try{
        const idEm = await ModelEmpleados.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idEmpleado')), 'maxId']],
            raw: true,
        })
        const lastId = idEm[0]["maxId"];
        const nombreEm = req.body.nombreEmp
        const apePatEm = req.body.apellidoPaternoEmp
        const apeMatEm = req.body.apellidoMaternoEmp
        const correoEm = req.body.correoEmp
        const telEm = req.body.telefonoEmp
        const fechaNacEm = req.body.fechaNacEmp
        const sexEm = req.body.sexoEmp
        const sueldoEm = req.body.sueldoEmp
        const seguroEm = req.body.seguroEmp
        const idAre = req.body.idArea
        const idPue = req.body.idPuesto
        const idJef = req.body.idJefe
        const codJef = req.body.codigoJefe
        const nombre = nombreEm.substring(0,3)
        const fecha = moment(fechaNacEm).format("DDMMYY")
        const nompu = await ModelPuestos.findAll({
            where:{idPuesto:idPue}
        })
        const puesto = nompu[0].dataValues.nombrePuesto        
        const puestoEmp= puesto.substring(0,3)
        const codEmp = puestoEmp + nombre + fecha
        const resultado = await ModelEmpleados.findAll({
            where:{codigoEmp:codEmp}
        })

        console.log(codEmp)
        
        if(resultado.length === 0){
            await ModelEmpleados.create({idEmpleado: lastId + 1,
                codigoEmp: codEmp, nombreEmp: nombreEm, 
                apellidoPaternoEmp: apePatEm, 
                apellidoMaternoEmp: apeMatEm,
                correoEmp: correoEm,
                telefonoEmp: telEm,
                fechaNacEmp: fechaNacEm,
                sexoEmp: sexEm,
                sueldoEmp: sueldoEm,
                seguroEmp: seguroEm,
                idArea: idAre,
                idPuesto: idPue,
                idJefe: idJef,
                codigoJefe: codJef,
                estadoEmp:1})
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

export const updateEmpleado = async (req, res) => {
    try{
        const nombreEm = req.body.nombreEmp
        const apePatEm = req.body.apellidoPaternoEmp
        const apeMatEm = req.body.apellidoMaternoEmp
        const correoEm = req.body.correoEmp
        const telEm = req.body.telefonoEmp
        const fechaNacEm = req.body.fechaNacEmp
        const sexEm = req.body.sexoEmp
        const sueldoEm = req.body.sueldoEmp
        const seguroEm = req.body.seguroEmp
        const idAre = req.body.idArea
        const idPue = req.body.idPuesto
        const idJef = req.body.idJefe
        const codJef = req.body.codigoJefe
        const nombre = nombreEm.substring(0,3)
        const fecha = moment(fechaNacEm).format("DDMMYY")
        const nompu = await ModelPuestos.findAll({
            where:{idPuesto:idPue}
        })
        const puesto = nompu[0].dataValues.nombrePuesto        
        const puestoEmp= puesto.substring(0,3)
        const codEmp = puestoEmp + nombre + fecha
        const resultado = await ModelEmpleados.findAll({
            where:{codigoEmp:codEmp}
        })
        
        if(resultado.length === 0){
            await ModelEmpleados.update({
                codigoEmp: codEmp, nombreEmp: nombreEm, 
                apellidoPaternoEmp: apePatEm, 
                apellidoMaternoEmp: apeMatEm,
                correoEmp: correoEm,
                telefonoEmp: telEm,
                fechaNacEmp: fechaNacEm,
                sexoEmp: sexEm,
                sueldoEmp: sueldoEm,
                seguroEmp: seguroEm,
                idArea: idAre,
                idPuesto: idPue,
                idJefe: idJef,
                codigoJefe: codJef},{
                    where:{idEmpleado:req.params.id}
                })
            res.json({
                "message": "¡Registro creado correctamente!"
            })
            
        }else{
            const resul = await ModelEmpleados.findAll({
                where:{idEmpleado:req.params.id}
            })
            if(resul[0].dataValues.codigoEmp === codEmp){
                const re = await ModelEmpleados.update({
                    nombreEmp: nombreEm, 
                    apellidoPaternoEmp: apePatEm, 
                    apellidoMaternoEmp: apeMatEm,
                    correoEmp: correoEm,
                    telefonoEmp: telEm,
                    fechaNacEmp: fechaNacEm,
                    sexoEmp: sexEm,
                    sueldoEmp: sueldoEm,
                    seguroEmp: seguroEm,
                    idArea: idAre,
                    idPuesto: idPue,
                    idJefe: idJef,
                    codigoJefe: codJef},{
                        where:{idEmpleado:req.params.id}
                    })
                    res.json({
                        "message": "¡Registro creado correctamente!"
                    })                                
            }else{
                 res.json({
                "message": "Ya existe"
            })
            }
           
        }
        /*await ModelEmpleados.update(req.body, {
            where:{idEmpleado:req.params.id}
        })        
        res.json({
            "message": "¡Registro actualizado correctamente!"
        })*/
    } catch (error){
        res.json({message: error.message})        
    }
}

export const deleteEmpleado = async (req, res) => {
    try{
        await ModelEmpleados.update({estadoEmp:0}, {
            where:{idEmpleado:req.params.id}
        })
        res.json({
            "message": "¡Registro eliminado correctamente!"
        })
    } catch (error){
        res.json({message: error.message})
    }
}
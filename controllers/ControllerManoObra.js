import { ManoObra, Obras } from "../models/Models.js";
import db from "../database/db.js";

export const getAllManoObra = async (req,res) =>{
    try{
        const empleados = await ManoObra.findAll()
        if(empleados.length === 0){
            const salidas = await db.query(
                `SELECT e.idEmpleado, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp, p.nombrePuesto FROM empleados e JOIN areas a ON a.idArea = e.idArea JOIN puestos p ON p.idPuesto = e.idPuesto WHERE a.nombreArea = 'campo' AND p.nombrePuesto != 'residente' AND e.estadoEmp = 1 ORDER BY e.nombreEmp ASC`,
                {type: db.QueryTypes.SELECT}
            )
            res.json(salidas)
            console.log(salidas)
        }else{
            const salidas = await db.query(
                `SELECT e.idEmpleado, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp, p.nombrePuesto FROM empleados e JOIN areas a ON a.idArea = e.idArea JOIN puestos p ON p.idPuesto = e.idPuesto WHERE a.nombreArea = 'campo' AND p.nombrePuesto != 'residente' AND e.estadoEmp = 1 AND e.idEmpleado NOT IN (SELECT idEmpleado FROM obra_empleados) ORDER BY e.nombreEmp ASC`,
                {type: db.QueryTypes.SELECT}
            )
            res.json(salidas)   
        }
    }catch (error){
        res.json({message: error.message})
    }
}

export const getResidentes = async (req,res) => {
    try{
        const residentes = await db.query(
            `SELECT e.idEmpleado, e.codigoEmp, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM empleados e JOIN puestos p ON e.idPuesto = p.idPuesto WHERE nombrePuesto = 'residente' AND e.estadoEmp = 1 `,
            {type: db.QueryTypes.SELECT}
        )
        res.json(residentes)
    }catch (error){
        res.json({message: error.message})
    }
}

export const addResidente = async (req,res) =>{
    try{
        const residente = req.body.idResidente
        const obra = req.body.idObra
        await Obras.update({residente: residente},
            {where:{idObra:obra}}) 
        res.json({
            "message": "¡RESIDENTE AGREGADO!"
        })
    }catch (error){
        res.json({message: error.message})
    }
}

export const getResidente = async (req,res) => {
    try{
        const obra = req.params.id
        const residentes = await db.query(
            `SELECT o.residente, e.codigoEmp, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM empleados e JOIN obras o ON e.idEmpleado = o.residente WHERE o.idObra = ${obra} AND e.estadoEmp = 1`,
            {type: db.QueryTypes.SELECT}
        )
        res.json(residentes)
    }catch (error){
        res.json({message: error.message})
    }
}

export const getPersonal = async (req,res) =>{
    try{
        const obra = req.params.id
        const personal = await db.query(
            `SELECT mo.idObra, mo.idEmpleado, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp, p.nombrePuesto FROM obra_empleados mo JOIN empleados e ON mo.idEmpleado = e.idEmpleado JOIN puestos p ON p.idPuesto = e.idPuesto WHERE mo.idObra = ${obra} AND e.estadoEmp = 1`,
            {type: db.QueryTypes.SELECT}
        )
        res.json(personal)
    }catch (error){
        res.json({message: error.message})
    }
}

export const createPersonal = async (req,res) =>{
    try{
        const obra = req.body.idObra
        const lista = JSON.parse(req.body.lista)
        
        for (let i = 0; i < lista.length; i++) {
            await ManoObra.create({idObra: obra, idEmpleado:lista[i].idP})
            console.log("Empleado agregado a obra")
        }
        res.json({
            "message": "¡PERSONAL AGREGADO CORRECTAMENTE!"
        })
    }catch (error){
        res.json({message: error.message})
    }
}

export const deletePersonal = async(req,res) => {
    try{
        await ManoObra.destroy({
            where:{idObra:req.params.ido, idEmpleado:req.params.ide}
        })
        
        res.json({
            "message": "¡EMPLEADO ELIMINADO CORRECTAMENTE!"
        })
    } catch (error){
        res.json({message: error.message})
    }
}
import { AsistenciaCampo } from "../models/Models.js";
import db from "../database/db.js";
import moment from "moment/moment.js";

export const getAsistencia = async (req,res) =>{
    try{
        const asistencia = await db.query(
            `SELECT ac.idObra, ac.idEmpleado, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM empleados e JOIN asistencia_obra_empleados ac ON ac.idEmpleado = e.idEmpleado ORDER BY e.nombreEmp ASC`,
            {type: db.QueryTypes.SELECT}
        )
        res.json(asistencia)
    }catch (error){
        res.json({message: error.message})
    }
}

export const getPersonalObra = async (req,res) =>{
    try{
        const obra = req.params.id
        const fecha = moment().locale('zh-mx').format('YYYY-MM-DD');
        const personal = await db.query(
            `SELECT oe.idEmpleado, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM empleados e JOIN obra_empleados oe ON oe.idEmpleado = e.idEmpleado WHERE oe.idObra = ${obra}  AND e.idEmpleado NOT IN (SELECT idEmpleado FROM asistencia_obra_empleados ao WHERE ao.asistencia = 1 AND ao.fecha = '${fecha}' ) ORDER BY e.nombreEmp ASC`,
            {type: db.QueryTypes.SELECT}
        )
        res.json(personal)
    }catch (error){
        res.json({message: error.message})
    }
}

export const createAsistencia = async (req,res) =>{
    try{
        const obra = req.body.idObra
        const lista = JSON.parse(req.body.lista)
        for (let i = 0; i < lista.length; i++) {
            const fecha = moment().locale('zh-mx').format('YYYY-MM-DD');
            await AsistenciaCampo.create({
               idObra: obra, idEmpleado: lista[i].idL,
               asistencia: 1, fecha: fecha
            })
            console.log("Asistencia agregada")
        }
        res.json({
            "message": "SE GUARDÓ ASISTENCIA CORRECTAMENTE"
        })
    }catch (error){
        res.json({message: error.message})
    }
}
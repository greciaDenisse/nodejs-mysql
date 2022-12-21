import { AsistenciaOficina } from "../models/Models.js";
import db from "../database/db.js";
import moment from "moment/moment.js";


export const getAsisOficina = async (req,res) => {
    try{
        const oficina = await db.query(
            `SELECT e.idEmpleado, e.nombreEmp,a.fecha, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM empleados e JOIN asistencia_oficinas a ON a.idEmpleado = e.idEmpleado ORDER BY e.nombreEmp ASC`,
            
            {type: db.QueryTypes.SELECT}
        )
        res.json(oficina)
   }catch(error){
           res.json({message:error.message})
   }
}


export const getEmpleadosOfi = async (req,res) =>{
    const fecha = moment().locale('zh-mx').format('YYYY-MM-DD');
    try{
            const empleados = await db.query(
                `SELECT e.idEmpleado, e.codigoEmp, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM empleados e JOIN areas a ON a.idArea = e.idArea JOIN puestos p ON p.idPuesto = e.idPuesto WHERE a.nombreArea != 'campo' AND e.idEmpleado NOT IN (SELECT idEmpleado FROM asistencia_oficinas ao WHERE ao.fecha = '${fecha}' ) ORDER BY e.nombreEmp ASC`,
                {type: db.QueryTypes.SELECT}
            )
            res.json(empleados)
        
    }catch (error){
        res.json({message: error.message})
    }
}

export const createAsisOfis = async (req,res) =>{
    try{
        const lista = JSON.parse(req.body.lista)
        for (let i = 0; i < lista.length; i++) {
            const fecha = moment().locale('zh-mx').format('YYYY-MM-DD');
            await AsistenciaOficina.create({
               idEmpleado: lista[i].idEmpleado,observacion:null,
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
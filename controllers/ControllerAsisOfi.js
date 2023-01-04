import { AsistenciaOficina } from "../models/Models.js";
import db from "../database/db.js";
import moment from "moment/moment.js";


export const getAsisOficina = async (req,res) => {
    try{
        const oficina = await db.query(
            `SELECT e.idEmpleado, e.nombreEmp,a.fecha, e.apellidoPaternoEmp, e.apellidoMaternoEmp,a.observacion,a.asistencia FROM empleados e JOIN asistencia_oficinas a ON a.idEmpleado = e.idEmpleado ORDER BY e.nombreEmp ASC`,
            
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
                `SELECT e.idEmpleado, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM empleados e JOIN areas a ON a.idArea = e.idArea JOIN puestos p ON p.idPuesto = e.idPuesto WHERE a.nombreArea != 'campo' AND e.idEmpleado NOT IN (SELECT idEmpleado FROM asistencia_oficinas ao WHERE ao.asistencia IN (1,0.5) and ao.fecha = '${fecha}' ) ORDER BY e.nombreEmp ASC`,
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
            const resultado = await db.query(
                `SELECT * FROM asistencia_oficinas WHERE idEmpleado = ${lista[i].idEmpleado} AND fecha = '${fecha}' `,
                {type: db.QueryTypes.SELECT}
            )
            var getdatetime = new Date();
            var week = moment(getdatetime,"DD-MM-YYYY").isoWeek()
            console.log(week)
            if(resultado.length === 0){
                await db.query(`INSERT INTO asistencia_oficinas (idEmpleado, asistencia, observacion, semana, fecha) VALUES (${lista[i].idEmpleado}, 1, '${lista[i].obsL}', ${week},'${fecha}');`)
                 console.log("Asistencia agregada")
            }else{
                await db.query(`UPDATE asistencia_oficinas SET asistencia = 1, observacion = '${lista[i].obsL}', semana = ${week} WHERE idEmpleado = ${lista[i].idEmpleado} AND fecha = '${fecha}'`)
                console.log("Asistencia agregada")
            }
        }   
        const fecha = moment().locale('zh-mx').format('YYYY-MM-DD');
        const personal = await db.query(
            `SELECT e.idEmpleado FROM empleados e JOIN areas a ON a.idArea = e.idArea JOIN puestos p ON p.idPuesto = e.idPuesto WHERE a.nombreArea != 'campo' AND e.idEmpleado NOT IN (SELECT idEmpleado FROM asistencia_oficinas ao WHERE ao.asistencia IN (1,0.5) and ao.fecha = '${fecha}' ) ORDER BY e.nombreEmp ASC`,
            {type: db.QueryTypes.SELECT}
        )
        console.log(personal)
        for (let j = 0; j < personal.length; j++) {
            const fechaNow = moment().locale('zh-mx').format('YYYY-MM-DD');
            const resultado = await db.query(
                `SELECT * FROM asistencia_oficinas WHERE idEmpleado = ${personal[j].idEmpleado} AND fecha = '${fecha}' `,
                {type: db.QueryTypes.SELECT}
            )
            var getdatetime = new Date();
            var week = moment(getdatetime,"DD-MM-YYYY").isoWeek()
            if(resultado.length === 0){
                await db.query(`INSERT INTO asistencia_oficinas (idEmpleado, asistencia, semana, fecha) VALUES (${personal[j].idEmpleado}, 0, ${week},'${fechaNow}');`)
                
                 console.log("Falta agregada")
            }else{
                await db.query(`UPDATE asistencia_oficinas SET asistencia = 0, semana = ${week} WHERE idEmpleado = ${personal[j].idEmpleado} AND fecha = '${fechaNow}'`)
                console.log("Falta agregada")
            }
        }
        res.json({
            "message": "SE GUARDÓ ASISTENCIA CORRECTAMENTE"
        })

    }catch (error){
        res.json({message: error.message})
    }
}

export const updateAsisOfi = async (req,res) =>{
    try{
        
        const empleado = req.params.ide
        const fecha = req.body.fecha
        const asistencia = req.body.asistencia
       
        await db.query(`UPDATE asistencia_oficinas SET asistencia = ${asistencia} WHERE idEmpleado = ${empleado} AND fecha = '${fecha}'`)
        res.json({
            "message": "¡Registro modificado correctamente!"
        })
        
    }catch (error){
        res.json({message: error.message})
    }
}
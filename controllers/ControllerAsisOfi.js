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

    const arr = [];
    const arrayFinal = [];

    try{
        var date = moment( new Date());
        const fecha = date.tz('America/Mexico_City').format('YYYY-MM-DD')
        const empleadosOfi= await db.query(
            `SELECT e.idEmpleado, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM empleados e JOIN areas a ON a.idArea = e.idArea JOIN puestos p ON p.idPuesto = e.idPuesto WHERE a.nombreArea != 'campo' ORDER BY e.nombreEmp ASC`,
                {
                  replacements: [req.params.id],
                  type:db.QueryTypes.SELECT
                }
            )
            for (var i = 0; i < empleadosOfi.length; i++) {
                        arr.push({idEmpleado:empleadosOfi[i].idEmpleado,nombreEmp:empleadosOfi[i].nombreEmp,apellidoPaternoEmp:empleadosOfi[i].apellidoPaternoEmp,apellidoMaternoEmp:empleadosOfi[i].apellidoMaternoEmp})
            }

            const residentes= await db.query(
                `SELECT e.idEmpleado, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM empleados e  JOIN puestos p ON p.idPuesto = e.idPuesto WHERE p.nombrePuesto = 'residente' ORDER BY e.nombreEmp ASC`,
                    {
                      replacements: [req.params.id],
                      type:db.QueryTypes.SELECT
                    }
                )
            for (var i = 0; i < residentes.length; i++) {
                    arr.push({idEmpleado:residentes[i].idEmpleado,nombreEmp:residentes[i].nombreEmp,apellidoPaternoEmp:residentes[i].apellidoPaternoEmp,apellidoMaternoEmp:residentes[i].apellidoMaternoEmp})
            }
            
            for (var i = 0; i < arr.length; i++) {
                    const asistenciaOfi= await db.query(
                        ` SELECT idEmpleado FROM asistencia_oficinas ao WHERE ao.asistencia = 1 and ao.fecha = '${fecha}'`,
                            {
                              replacements: [req.params.id],
                              type:db.QueryTypes.SELECT
                            }
                        )
                        
                    const resultado = asistenciaOfi.filter(dato => dato.idEmpleado === arr[i].idEmpleado);

                    if(resultado.length === 0){
                        arrayFinal.push({idEmpleado:arr[i].idEmpleado,nombreEmp:arr[i].nombreEmp,apellidoPaternoEmp:arr[i].apellidoPaternoEmp,apellidoMaternoEmp:arr[i].apellidoMaternoEmp})
                    }
            }

            res.json(arrayFinal)
    }catch (error){
        res.json({message: error.message})
    }
}

export const createAsisOfis = async (req,res) =>{
    const arr = [];
    const arrayFinal = [];

    try{

        const lista = JSON.parse(req.body.lista)

        for (let i = 0; i < lista.length; i++) {
            var date = moment( new Date());
            const fecha = date.tz('America/Mexico_City').format('YYYY-MM-DD')
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
        var date = moment( new Date());
        const fecha = date.tz('America/Mexico_City').format('YYYY-MM-DD')
        
        const empleadosOfi= await db.query(
            `SELECT e.idEmpleado, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM empleados e JOIN areas a ON a.idArea = e.idArea JOIN puestos p ON p.idPuesto = e.idPuesto WHERE a.nombreArea != 'campo' ORDER BY e.nombreEmp ASC`,
                {
                  replacements: [req.params.id],
                  type:db.QueryTypes.SELECT
                }
            )
            for (var i = 0; i < empleadosOfi.length; i++) {
                        arr.push({idEmpleado:empleadosOfi[i].idEmpleado,nombreEmp:empleadosOfi[i].nombreEmp,apellidoPaternoEmp:empleadosOfi[i].apellidoPaternoEmp,apellidoMaternoEmp:empleadosOfi[i].apellidoMaternoEmp})
            }

            const residentes= await db.query(
                `SELECT e.idEmpleado, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM empleados e  JOIN puestos p ON p.idPuesto = e.idPuesto WHERE p.nombrePuesto = 'residente' ORDER BY e.nombreEmp ASC`,
                    {
                      replacements: [req.params.id],
                      type:db.QueryTypes.SELECT
                    }
                )
            for (var i = 0; i < residentes.length; i++) {
                    arr.push({idEmpleado:residentes[i].idEmpleado,nombreEmp:residentes[i].nombreEmp,apellidoPaternoEmp:residentes[i].apellidoPaternoEmp,apellidoMaternoEmp:residentes[i].apellidoMaternoEmp})
            }
            
            for (var i = 0; i < arr.length; i++) {
                    const asistenciaOfi= await db.query(
                        ` SELECT idEmpleado FROM asistencia_oficinas ao WHERE ao.asistencia = 1 and ao.fecha = '${fecha}'`,
                            {
                              replacements: [req.params.id],
                              type:db.QueryTypes.SELECT
                            }
                        )
                        
                    const resultado = asistenciaOfi.filter(dato => dato.idEmpleado === arr[i].idEmpleado);

                    if(resultado.length === 0){
                        arrayFinal.push({idEmpleado:arr[i].idEmpleado,nombreEmp:arr[i].nombreEmp,apellidoPaternoEmp:arr[i].apellidoPaternoEmp,apellidoMaternoEmp:arr[i].apellidoMaternoEmp})
                    }
            }
        
        for (let j = 0; j < arrayFinal.length; j++) {
            var date = moment( new Date());
            const fechaNow = date.tz('America/Mexico_City').format('YYYY-MM-DD')
            const resultado = await db.query(
                `SELECT * FROM asistencia_oficinas WHERE idEmpleado = ${arrayFinal[j].idEmpleado} AND fecha = '${fecha}' `,
                {type: db.QueryTypes.SELECT}
            )
            var getdatetime = new Date();
            var week = moment(getdatetime,"DD-MM-YYYY").isoWeek()
            if(resultado.length === 0){
                await db.query(`INSERT INTO asistencia_oficinas (idEmpleado, asistencia, semana, fecha) VALUES (${arrayFinal[j].idEmpleado}, 0, ${week},'${fechaNow}');`)
                
                 console.log("Falta agregada")
            }else{
                await db.query(`UPDATE asistencia_oficinas SET asistencia = 0, semana = ${week} WHERE idEmpleado = ${arrayFinal[j].idEmpleado} AND fecha = '${fechaNow}'`)
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
        var date = moment( new Date());
        const fecha = date.tz('America/Mexico_City').format('YYYY-MM-DD')
        const asistencia = req.body.asistencia
        const extra = req.body.extra

        await db.query(`UPDATE asistencia_oficinas SET asistencia = ${asistencia} WHERE idEmpleado = ${empleado} AND fecha = '${fecha}'`)
        res.json({
            "message": "¡Registro modificado correctamente!"
        })
        
    }catch (error){
        res.json({message: error.message})
    }
}
import { AsistenciaCampo } from "../models/Models.js";
import db from "../database/db.js";
import moment from "moment/moment.js";

export const getAsistencia = async (req,res) =>{
    try{
        const asistencia = await db.query(
            `SELECT ac.idObra, ac.idEmpleado, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM empleados e JOIN asistencia_obra_empleados ac ON ac.idEmpleado = e.idEmpleado WHERE e.estadoEmp = 1 ORDER BY e.nombreEmp ASC`,
            {type: db.QueryTypes.SELECT}
        )
        //const hora = moment().locale('zh-mx').format('HH:mm:ss');
        res.json(asistencia)
        //console.log(hora.tz('America/Mexico_City').format('ha z'))
        //const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        //console.log(timezone); // Asia/Karachi
        //let datetime = new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" });
        //const hours = datetime.getHours();
        let getdatetime = new Date();
        const datetime = getdatetime.toLocaleString({ timeZone: "America/Mexico_City" })
        console.log(getdatetime);
        //console.log(datetime);
        //const datetime2 = moment(getdatetime).format()
        console.log(datetime)
        //console.log(datetime2.getDay())
        console.log(moment(getdatetime).format())
        console.log(moment(getdatetime).format('YYYY-MM-DD'))
        console.log(moment(getdatetime).format('HH:mm:ss'))
        
        //console.log(datetime.getDay());
        //console.log(hours);
    }catch (error){
        res.json({message: error.message})
    }
}

export const getAsistenciaTomada = async (req,res) =>{
    try{
        const obra = req.params.id
        const listaAsistencia = await db.query(
            `SELECT a.idObra, a.idEmpleado, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp, a.asistencia, a.observacion, a.extra, a.fecha FROM empleados e JOIN asistencia_obra_empleados a ON a.idEmpleado = e.idEmpleado WHERE a.idObra = ${obra} AND e.estadoEmp = 1 ORDER BY a.fecha DESC`,
            {type: db.QueryTypes.SELECT}
        )
        res.json(listaAsistencia)
        
    }catch (error){
        res.json({message: error.message})
    }
}

export const getPersonalObra = async (req,res) =>{
    try{
        const obra = req.params.id
        const fecha = moment().locale('zh-mx').format('YYYY-MM-DD');
        const personal = await db.query(
            `SELECT oe.idEmpleado, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM empleados e JOIN obra_empleados oe ON oe.idEmpleado = e.idEmpleado WHERE oe.idObra = ${obra} AND e.estadoEmp = 1 AND e.idEmpleado NOT IN (SELECT idEmpleado FROM asistencia_obra_empleados ao WHERE ao.asistencia IN (1,0.5) AND ao.fecha = '${fecha}' ) ORDER BY e.nombreEmp ASC`,
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
            const resultado = await db.query(
                `SELECT * FROM asistencia_obra_empleados WHERE idObra = ${obra} AND idEmpleado = ${lista[i].idL} AND fecha = '${fecha}' `,
                {type: db.QueryTypes.SELECT}
            )
            var getdatetime = new Date();
            var week = moment(getdatetime,"DD-MM-YYYY").isoWeek()
            console.log(week)
            if(resultado.length === 0){
                await db.query(`INSERT INTO asistencia_obra_empleados (idObra, idEmpleado, asistencia, observacion, extra, semana, fecha) VALUES (${obra}, ${lista[i].idL}, 1, '${lista[i].obsL}', 0, ${week},'${fecha}');`)
                /*await AsistenciaCampo.create({
                    idObra: obra, idEmpleado: lista[i].idL,
                    asistencia: 1, observacion: lista[i].obsL, semana: week, fecha: fecha
                 })*/
                 console.log("Asistencia agregada")
            }else{
                await db.query(`UPDATE asistencia_obra_empleados SET asistencia = 1, observacion = '${lista[i].obsL}', semana = ${week} WHERE idObra = ${obra} AND idEmpleado = ${lista[i].idL} AND fecha = '${fecha}'`)
                console.log("Asistencia agregada")
            }
        }
        
        const fecha = moment().locale('zh-mx').format('YYYY-MM-DD');
        const personal = await db.query(
            `SELECT oe.idEmpleado, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM empleados e JOIN obra_empleados oe ON oe.idEmpleado = e.idEmpleado WHERE oe.idObra = ${obra} AND e.estadoEmp = 1 AND e.idEmpleado NOT IN (SELECT idEmpleado FROM asistencia_obra_empleados ao WHERE ao.asistencia IN (1,0.5) AND ao.fecha = '${fecha}' ) ORDER BY e.nombreEmp ASC`,
            {type: db.QueryTypes.SELECT}
        )
        console.log(personal)
        for (let j = 0; j < personal.length; j++) {
            const fechaNow = moment().locale('zh-mx').format('YYYY-MM-DD');
            const resultado = await db.query(
                `SELECT * FROM asistencia_obra_empleados WHERE idObra = ${obra} AND idEmpleado = ${personal[j].idEmpleado} AND fecha = '${fecha}' `,
                {type: db.QueryTypes.SELECT}
            )
            var getdatetime = new Date();
            var week = moment(getdatetime,"DD-MM-YYYY").isoWeek()
            if(resultado.length === 0){
                await db.query(`INSERT INTO asistencia_obra_empleados (idObra, idEmpleado, asistencia, extra, semana, fecha) VALUES (${obra}, ${personal[j].idEmpleado}, 0, 0, ${week},'${fechaNow}');`)
                /*await AsistenciaCampo.create({
                    idObra: obra, idEmpleado: personal[j].idEmpleado,
                    asistencia: 0, observacion: null, semana:week, fecha: fechaNow
                 })*/
                 console.log("Falta agregada")
            }else{
                await db.query(`UPDATE asistencia_obra_empleados SET asistencia = 0, semana = ${week} WHERE idObra = ${obra} AND idEmpleado = ${personal[j].idEmpleado} AND fecha = '${fecha}'`)
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

export const deleteAsistencia = async (req,res) =>{
    try{
        const obra = req.params.ido
        const empleado = req.params.ide
        const fecha = req.body.fecha
        await db.query(`DELETE FROM asistencia_obra_empleados WHERE idObra = ${obra} AND idEmpleado = ${empleado} AND fecha = '${fecha}'`)
        res.json({
            "message": "¡Registro eliminado correctamente!"
        })
        
    }catch (error){
        res.json({message: error.message})
    }
}

export const updateAsistencia = async (req,res) =>{
    try{
        const obra = req.params.ido
        const empleado = req.params.ide
        const fecha = req.body.fecha
        const asistencia = req.body.asistencia
        const extra = req.body.extra
        await db.query(`UPDATE asistencia_obra_empleados SET asistencia = ${asistencia}, extra = ${extra} WHERE idObra = ${obra} AND idEmpleado = ${empleado} AND fecha = '${fecha}'`)
        res.json({
            "message": "¡Registro modificado correctamente!"
        })
        
    }catch (error){
        res.json({message: error.message})
    }
}

export const getListaPersonal = async (req,res) =>{
    try{
        const obra = req.params.id
        const personal = await db.query(
            `SELECT oe.idEmpleado, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM obra_empleados oe JOIN empleados e ON oe.idEmpleado = e.idEmpleado WHERE oe.idObra = ${obra} ORDER BY e.nombreEmp ASC;`,
            {type: db.QueryTypes.SELECT}
        )
        res.json(personal)
    }catch (error){
        res.json({message: error.message})
    }
}

export const createAsistenciaAtrasada = async (req,res) =>{
    try{
        const obra = req.body.idObra
        const empleado = req.body.idEmpleado
        const asistencia = req.body.asistencia
        const fecha = req.body.fecha
        const observacion = req.body.observacion
        console.log(obra,empleado,asistencia,fecha, observacion)
        var getdatetime = new Date();
        var week1 = moment(getdatetime,"DD-MM-YYYY").isoWeek()
        const week2 = moment(fecha,"YYYY-MM-DD").isoWeek()
        if(week1 === week2){
            const resultado = await db.query(
                `SELECT * FROM asistencia_obra_empleados WHERE idObra = ${obra} AND idEmpleado = ${empleado} AND fecha = '${fecha}' `,
                {type: db.QueryTypes.SELECT}
            )
            if(resultado.length === 0){
                await db.query(`INSERT INTO asistencia_obra_empleados (idObra, idEmpleado, asistencia, observacion, semana, fecha) VALUES (${obra}, ${empleado}, ${asistencia}, '${observacion}', ${week1},'${fecha}');`)
                console.log("Asistencia agregada")
                res.json({
                    "message": "SE GUARDÓ ASISTENCIA CORRECTAMENTE"
                })
            }else{
                res.json({
                    "message": "ASISTENCIA YA REGISTRADA..."
                })
            }
        }else{
            res.json({
                "message": "LA ASISTENCIA DEBE SER DE ESTA SEMANA"
            })
        }
    }catch (error){
        res.json({message: error.message})
    }
}
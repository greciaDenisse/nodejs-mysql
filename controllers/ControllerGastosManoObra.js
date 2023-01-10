import db from "../database/db.js";
import moment from "moment/moment.js";

export const getGastosManoObra = async (req,res) =>{
    try{
        const obra = req.params.id
        var getdatetime = new Date();
        var week = moment(getdatetime,"DD-MM-YYYY").isoWeek()
        const gastos = await db.query(
            `SELECT a.idEmpleado, e.codigoEmp, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp, SUM(a.asistencia) AS dias, CAST(SUM(a.extra) AS SIGNED)  AS extras, TRUNCATE(e.sueldoEmp/6,2) AS precio, CAST(TRUNCATE((e.sueldoEmp/6)*SUM(a.asistencia),2) AS FLOAT) AS total FROM asistencia_obra_empleados a JOIN empleados e ON a.idEmpleado = e.idEmpleado WHERE a.idObra = ${obra} AND a.semana = ${week} GROUP BY a.idEmpleado;`,
            {type: db.QueryTypes.SELECT}
        )
        res.json(gastos)
    } catch (error){
        res.json({message: error.message})
    }
}

export const getGastosRegistrados = async (req,res) =>{
    try{
        const obra = req.params.id
        const gastos = await db.query(
            `SELECT g.idEmpleado, e.codigoEmp, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp, g.dias, g.precio, g.extra, g.total, g.fecha, g.totalSemana FROM gasto_mano_obras g JOIN empleados e ON g.idEmpleado = e.idEmpleado WHERE g.idObra = ${obra} ORDER BY g.semana DESC `,
            {type: db.QueryTypes.SELECT}
        )
        res.json(gastos)
    } catch (error){
        res.json({message: error.message})
    }
}

export const createGastosObra = async (req,res) =>{
    try{
        const obra = req.body.idObra
        const lista = JSON.parse(req.body.lista)
        console.log(lista)
        var date = moment( new Date());
        const fecha = date.tz('America/Mexico_City').format('YYYY-MM-DD')
        var getdatetime = new Date();
        var week = moment(getdatetime,"DD-MM-YYYY").isoWeek()
        const resultado = await db.query(
            `SELECT * FROM gasto_mano_obras WHERE idObra = ${obra} AND fecha = '${fecha}' AND semana = ${week} `,
            {type: db.QueryTypes.SELECT}
        )
        if(resultado.length === 0){
            var total = 0;
            for (let i = 0; i < lista.length; i++){
                if(i === (lista.length - 1)){
                    total += lista[i].totL
                    await db.query(`INSERT INTO gasto_mano_obras (idObra, idEmpleado, dias, precio, extra, total, semana, fecha, totalSemana) VALUES (${obra}, ${lista[i].idL}, ${lista[i].diasL}, ${lista[i].preL}, ${lista[i].canExt}, ${lista[i].totL}, ${week},'${fecha}', ${total});`)
                }else{
                    total += lista[i].totL
                    await db.query(`INSERT INTO gasto_mano_obras (idObra, idEmpleado, dias, precio, extra, total, semana, fecha) VALUES (${obra}, ${lista[i].idL}, ${lista[i].diasL}, ${lista[i].preL}, ${lista[i].canExt}, ${lista[i].totL}, ${week},'${fecha}');`)
                }
            }
            res.json({
                "message": "SE GUARDÓ EL REGISTRO CORRECTAMENTE"
            })
        }else{
            res.json({
                "message": "YA ESTÁ REGISTRADO..."
            })
        }
        
        
    } catch (error){
        res.json({message: error.message})
    }
}

export const getGastoTotalManoObra = async (req,res) =>{
    try{
        const obra = req.params.id
        var getdatetime = new Date();
        var week = moment(getdatetime,"DD-MM-YYYY").isoWeek()
        const gastos = await db.query(
            `SELECT CAST(TRUNCATE(SUM(g.total),2) AS FLOAT) AS total FROM gasto_mano_obras g WHERE idObra = ${obra}; `,
            {type: db.QueryTypes.SELECT}
        )
        res.json(gastos)
    } catch (error){
        res.json({message: error.message})
    }
}

//`SELECT CAST(TRUNCATE(SUM(g.total),2) AS FLOAT) AS total FROM gasto_mano_obras g WHERE idObra = ${obra} AND semana = ${week}; `,
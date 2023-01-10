import db from "../database/db.js";
import moment from "moment/moment.js";

export const getPagOficina = async (req,res) =>{
    try{
        var getdatetime = new Date();
        var week = moment(getdatetime,"DD-MM-YYYY").isoWeek()
        const gastos = await db.query(
            `SELECT a.idEmpleado, e.codigoEmp, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp,p.nombrePuesto ,CAST(SUM(a.asistencia) AS SIGNED) AS dias, TRUNCATE(e.sueldoEmp/6,2) AS precio, round(CAST(TRUNCATE((e.sueldoEmp/6)*SUM(a.asistencia),2) AS DOUBLE)) AS total FROM asistencia_oficinas a JOIN empleados e ON a.idEmpleado = e.idEmpleado JOIN puestos p ON p.idPuesto = e.idPuesto WHERE a.semana = ${week} AND p.nombrePuesto != 'residente' GROUP BY a.idEmpleado;`,
            {type: db.QueryTypes.SELECT}
        )
        console.log(moment("25-12-2022","DD-MM-YYYY").isoWeek())
        res.json(gastos)
    } catch (error){
        res.json({message: error.message})
    }
}

export const createGastOfi = async  (req,res) =>{
    try{
        const lista = JSON.parse(req.body.lista)
        console.log(lista)
        const fecha = moment().locale('zh-mx').format('YYYY-MM-DD');
        var getdatetime = new Date();
        var week = moment(getdatetime,"DD-MM-YYYY").isoWeek()
        const resultado = await db.query(
            `SELECT * FROM gasto_oficinas WHERE fecha = '${fecha}' AND semana = ${week} `,
            {type: db.QueryTypes.SELECT}
        )
        if(resultado.length === 0){
            var total2 = 0;
            for (let i = 0; i < lista.length; i++){
                if(i === (lista.length - 1)){
                    total2 += lista[i].total
                    await db.query(`INSERT INTO gasto_oficinas (idEmpleado, dias, precio,  total, semana, fecha, totalSemana,extra) VALUES (${lista[i].idEmpleado}, ${lista[i].dias}, ${lista[i].precio}, ${lista[i].total}, ${week},'${fecha}', ${total2},${lista[i].extra});`)
                }else{
                    total2 += lista[i].total
                    console.log(total2)
                    await db.query(`INSERT INTO gasto_oficinas (idEmpleado, dias, precio,  total, semana, fecha,totalSemana,extra) VALUES (${lista[i].idEmpleado}, ${lista[i].dias}, ${lista[i].precio}, ${lista[i].total}, ${week},'${fecha}',0,${lista[i].extra});`)
                   
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

export const getGastosOficina = async (req,res) =>{
    try{
        const gastos = await db.query(
            `SELECT g.idEmpleado, e.codigoEmp, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp, g.dias, g.precio,g.total, g.fecha, g.totalSemana,g.extra FROM gasto_oficinas g JOIN empleados e ON g.idEmpleado = e.idEmpleado  ORDER BY g.semana DESC `,
            {type: db.QueryTypes.SELECT}
        )
        res.json(gastos)
    } catch (error){
        res.json({message: error.message})
    }
}

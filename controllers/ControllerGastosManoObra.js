import db from "../database/db.js";
import moment from "moment/moment.js";

export const getGastosManoObra = async (req,res) =>{
    try{
        const obra = req.params.id
        var getdatetime = new Date();
        var week = moment(getdatetime,"DD-MM-YYYY").isoWeek()
        const gastos = await db.query(
            `SELECT a.idEmpleado, e.codigoEmp, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp, SUM(a.asistencia) AS dias, COUNT(a.extra) AS extras, FORMAT(e.sueldoEmp/6,2) AS precio, FORMAT((e.sueldoEmp/6)*SUM(a.asistencia),2) AS total FROM asistencia_obra_empleados a JOIN empleados e ON a.idEmpleado = e.idEmpleado WHERE a.idObra = ${obra} AND a.semana = ${week} GROUP BY a.idEmpleado;`,
            {type: db.QueryTypes.SELECT}
        )
        res.json(gastos)
    } catch (error){
        res.json({message: error.message})
    }
}
import { ModelSalidaHerramientas } from "../models/Models.js";
import db from "../database/db.js";

export const getAllSalidasHerramientas = async (req,res) =>{
    try{
        const salidas = await db.query(
            'SELECT sh.idSalHer, h.nombreHer, e.nombreEmp as recibe, e.nombreEmp as entrega, sh.horaSalHer, sh.fechaSalHer FROM salida_herramientas sh JOIN herramientas h ON h.idHerramienta = sh.idHerramienta JOIN empleados e ON e.idEmpleado = sh.idEntrega AND e.idEmpleado = sh.idRecibe ORDER BY idSalHer DESC ',
            {type: db.QueryTypes.SELECT}
        )
        res.json(salidas)
    }catch (error){
        res.json({message: error.message})
    }
}

export const createSalidaHerramientas = async (req, res) => {
    try{
        await ModelSalidaHerramientas.create(req.body)
        req.json({
            "message": "¡Registro creado correctamente!"
        })
    }catch (error){
        res.json({message: error.message})
    }
}

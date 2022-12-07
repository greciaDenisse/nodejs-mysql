import { ManoObra } from "../models/Models.js";
import db from "../database/db.js";

export const getAllManoObra = async (req,res) =>{
    try{
        const empleados = await ManoObra.findAll()
        if(empleados.length === 0){
            const salidas = await db.query(
                `SELECT e.idEmpleado, e.codigoEmp, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM empleados e JOIN areas a ON a.idArea = e.idArea JOIN puestos p ON p.idPuesto = e.idPuesto WHERE a.nombreArea = 'campo' AND p.nombrePuesto != 'residente' ORDER BY e.nombreEmp ASC`,
                {type: db.QueryTypes.SELECT}
            )
            res.json(salidas)
            console.log(salidas)
        }else{
            const salidas = await db.query(
                `SELECT e.idEmpleado, e.codigoEmp, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM empleados e JOIN areas a ON a.idArea = e.idArea JOIN puestos p ON p.idPuesto = e.idPuesto WHERE a.nombreArea = 'campo' AND p.nombrePuesto != 'residente' AND e.idEmpleado NOT IN (SELECT idEmpleado FROM obra_empleados) ORDER BY e.nombreEmp ASC`,
                {type: db.QueryTypes.SELECT}
            )
            res.json(salidas)
            
        }
       
       
    }catch (error){
        res.json({message: error.message})
    }
}

export const getPersonal = async (req,res) =>{
    try{
        const obra = req.params.id
        const personal = await db.query(
            `SELECT mo.idObra, mo.idEmpleado, e.codigoEmp, e.nombreEmp, e.apellidoPaternoEmp, e.apellidoMaternoEmp FROM obra_empleados mo JOIN empleados e ON mo.idEmpleado = e.idEmpleado WHERE mo.idObra = ${obra} `,
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
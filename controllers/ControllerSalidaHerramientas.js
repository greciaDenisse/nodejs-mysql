import { ModelSalidaHerramientas, CartHerramientas } from "../models/Models.js";
import db from "../database/db.js";
import { Sequelize } from "sequelize";
import moment from "moment/moment.js";

export const getAllSalidasHerramientas = async (req,res) =>{
    try{
        const obra = req.params.id
        const salidas = await db.query(
            `SELECT sh.idSalHer,  sh.horaSalHer, sh.fechaSalHer, sh.estadoSal, h.nombreHer, e.nombreEmp as recibe, em.nombreEmp as entrega FROM salida_herramientas sh JOIN herramientas h ON sh.idHerramienta = h.idHerramienta JOIN empleados e ON sh.idRecibe = e.idEmpleado JOIN empleados em ON sh.idEntrega = em.idEmpleado WHERE sh.idObra = ${obra} ORDER BY sh.idSalHer DESC`,
            {type: db.QueryTypes.SELECT}
        )
        res.json(salidas)
    }catch (error){
        res.json({message: error.message})
    }
}

export const getAllSalidaHerramienta = async (req,res) => {
    try{
        const obra = req.params.id
        const salidas = await db.query(
            `SELECT sh.idSalHer, sh.idHerramienta, sh.estadoSal, h.nombreHer, h.codigoHer FROM salida_herramientas sh JOIN herramientas h ON sh.idHerramienta = h.idHerramienta  WHERE sh.idObra = ${obra} `,
            {type: db.QueryTypes.SELECT}
        )
        res.json(salidas)
    }catch (error){
        res.json({message: error.message})
    }
} 

export const createSalidaHerramientas = async (req, res) => {
    try{
        const obra = req.body.idObra
        const recibe = req.body.idRecibe
        const entrega =req.body.idEntrega
        const lista = await db.query(
            `SELECT idHerramienta FROM cart_herramientas WHERE idObra = ${obra} `,
            {type: db.QueryTypes.SELECT}
        )
        for (let i = 0; i < lista.length; i++) {
            const idSH = await ModelSalidaHerramientas.findAll({
                attributes:[[Sequelize.fn('MAX', Sequelize.col('idSalHer')), 'maxId']],
                raw: true,
            })
            const lastId = idSH[0]["maxId"];
            const hora = moment().locale('zh-mx').format('HH:mm:ss');
            const fecha = moment().locale('zh-mx').format('YYYY-MM-DD');
            await ModelSalidaHerramientas.create({
                idSalHer: lastId + 1, idHerramienta: lista[i].idHerramienta,
                idObra: obra, idRecibe: recibe, idEntrega:entrega,
                horaSalHer: hora, fechaSalHer: fecha, estadoSal:"prestado"
            })
            console.log("Herramienta agregada a salidas")
        }
        /*await ModelSalidaHerramientas.create({
            idSalHer: lastId + 1, idHerramienta: herramienta,
            idObra: obra, idRecibe: recibe, idEntrega:entrega,
            horaSalHer: hora, fechaSalHer: fecha
        })*/
        await CartHerramientas.destroy({truncate: true})
        res.json({
            "message": "¡Herramientas agregadas!"
        })
    }catch (error){
        res.json({message: error.message})
    }
}

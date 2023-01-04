import { GastoAdicionalObra } from "../models/Models.js";
import { Sequelize } from "sequelize";
import db from "../database/db.js";
import moment from "moment/moment.js";

export const getGastosAdicionales = async (req,res) =>{
    try{
        const obra = req.params.id
        const gastos = await db.query(
            `SELECT g.idGasto, g.idAdicional, a.nombreAdicional, g.unidad, g.cantidad, g.precio, g.total, g.fecha FROM gastos_obras_adicionales g JOIN adicionales a ON g.idAdicional = a.idAdicional WHERE g.idObra = ${obra} ORDER BY g.fecha DESC; `,
            {type: db.QueryTypes.SELECT}
        )
        res.json(gastos)
    } catch (error){
        res.json({message: error.message})
    }
}

export const createGastoAdicional = async (req,res) =>{
    try{
        const obra = req.body.idObra
        const adicional = req.body.idAdicional
        const unidad = req.body.unidad
        const cantidad = req.body.cantidad
        const precio = req.body.precio
        const fecha = req.body.fecha
        const total = cantidad * precio
        const idGas = await GastoAdicionalObra.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idGasto')), 'maxId']],
            raw: true,
        })
        const lastId = idGas[0]["maxId"];
        const id = lastId + 1;
        var week = moment(fecha,"YYYY-MM-DD").isoWeek()
        //const fecha = moment().locale('zh-mx').format('YYYY-MM-DD');
        await db.query(`INSERT INTO gastos_obras_adicionales (idGasto, idObra, idAdicional, unidad, cantidad, precio, total, semana, fecha) VALUES (${id}, ${obra}, ${adicional}, '${unidad}', ${cantidad}, ${precio}, ${total}, ${week}, '${fecha}');`)        
        res.json({
            "message": "SE GUARDÓ EL REGISTRO CORRECTAMENTE"
        })
        
    } catch (error){
        res.json({message: error.message})
    }
}

export const getGastoTotalAdicionales = async (req,res) =>{
    try{
        const obra = req.params.id
        const gastos = await db.query(
            `SELECT CAST(TRUNCATE(SUM(g.total),2) AS FLOAT) AS total FROM gastos_obras_adicionales g WHERE idObra = ${obra} `,
            {type: db.QueryTypes.SELECT}
        )
        res.json(gastos)
    } catch (error){
        res.json({message: error.message})
    }
}
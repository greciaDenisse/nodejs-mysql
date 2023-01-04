import { GastoTramitesObra } from "../models/Models.js";
import { Sequelize } from "sequelize";
import db from "../database/db.js";
import moment from "moment/moment.js";

export const getGastosTramites = async (req,res) =>{
    try{
        const obra = req.params.id
        const gastos = await db.query(
            `SELECT g.idGasto, g.idTramite, t.nombreTramite, g.cantidad, g.precio, g.total, g.fecha FROM gastos_tramites g JOIN tramites t ON g.idTramite = t.idTramite WHERE g.idObra = ${obra} ORDER BY g.fecha DESC; `,
            {type: db.QueryTypes.SELECT}
        )
        res.json(gastos)
    } catch (error){
        res.json({message: error.message})
    }
}

export const createGastoTramite = async (req,res) =>{
    try{
        const obra = req.body.idObra
        const tramite = req.body.idTramite
        const cantidad = req.body.cantidad
        const precio = req.body.precio
        const fecha = req.body.fecha
        const total = cantidad * precio
        const idGas = await GastoTramitesObra.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idGasto')), 'maxId']],
            raw: true,
        })
        const lastId = idGas[0]["maxId"];
        const id = lastId + 1;
        var week = moment(fecha,"YYYY-MM-DD").isoWeek()
        //const fecha = moment().locale('zh-mx').format('YYYY-MM-DD');
        await db.query(`INSERT INTO gastos_tramites (idGasto, idObra, idTramite, cantidad, precio, total, semana, fecha) VALUES (${id}, ${obra}, ${tramite}, ${cantidad}, ${precio}, ${total}, ${week}, '${fecha}');`)
        res.json({
            "message": "SE GUARDÓ EL REGISTRO CORRECTAMENTE"
        })
        
    } catch (error){
        res.json({message: error.message})
    }
}

export const getGastoTotalTramites = async (req,res) =>{
    try{
        const obra = req.params.id
        const gastos = await db.query(
            `SELECT CAST(TRUNCATE(SUM(g.total),2) AS FLOAT) AS total FROM gastos_tramites g WHERE idObra = ${obra} `,
            {type: db.QueryTypes.SELECT}
        )
        res.json(gastos)
    } catch (error){
        res.json({message: error.message})
    }
}
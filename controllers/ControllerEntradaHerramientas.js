import { ModelEntradaHerramientas, ModelSalidaHerramientas, ModelHerramientas, ModelEmpleados } from "../models/Models.js";
import db from "../database/db.js";
import { Sequelize } from "sequelize";
import moment from "moment/moment.js";

export const getAllEntradasHerramientas = async (req,res) =>{
    try{
        const obra = req.params.id
        const entrdas = await db.query(
            `SELECT eh.idEntHer,  eh.horaEntHer, eh.fechaEntHer, h.nombreHer, h.codigoHer, e.nombreEmp as recibe, em.nombreEmp as entrega FROM entrada_herramientas eh JOIN herramientas h ON eh.idHerramienta = h.idHerramienta JOIN empleados e ON eh.idRecibe = e.idEmpleado JOIN empleados em ON eh.idEntrega = em.idEmpleado WHERE eh.idObra = ${obra} ORDER BY eh.idEntHer DESC`,
            {type: db.QueryTypes.SELECT}
        )
        res.json(entrdas)
    }catch (error){
        res.json({message: error.message})
    }
}

export const createEntradaHerramientas = async (req, res) => {
    try{
        const obra = req.body.idObra
        const recibe = req.body.idRecibe
        const entrega =req.body.idEntrega
        const pin = req.body.pinEmp
        const lista = JSON.parse(req.body.lista)
        const pinEmpleado = await ModelEmpleados.findAll({
            where:{idEmpleado:entrega}
        })
        if(pinEmpleado[0].dataValues.pinEmp === pin){
            for (let i = 0; i < lista.length; i++){
                if(lista[i].danL === "si"){
                    await ModelHerramientas.update({statusHer:"en mantenimiento", observacionHer:lista[i].notaL}, {
                        where:{idHerramienta:lista[i].idL}
                    })
                    console.log("Estado modificado")
                }else{
                    await ModelHerramientas.update({statusHer:"disponible"}, {
                        where:{idHerramienta:lista[i].idL}
                    })
                    console.log("Estado modificado")
                }
                
                const idEH = await ModelEntradaHerramientas.findAll({
                    attributes:[[Sequelize.fn('MAX', Sequelize.col('idEntHer')), 'maxId']],
                    raw: true,
                })
                const lastId = idEH[0]["maxId"];
                var date = moment( new Date());
                const hora = date.tz('America/Mexico_City').format('HH:mm:ss')
                const fecha = date.tz('America/Mexico_City').format('YYYY-MM-DD')
                await ModelEntradaHerramientas.create({
                    idEntHer: lastId + 1, idHerramienta: lista[i].idL,
                    idObra: obra, idEntrega:entrega, idRecibe: recibe, 
                    horaEntHer: hora, fechaEntHer: fecha
                })
                console.log("Herramienta agregada a entradas")
                await ModelSalidaHerramientas.update({estadoSal:"devuelto"}, {
                    where:{idSalHer:lista[i].idsL}
                })
            }
            res.json({
                "message": "¡Herramientas agregadas!"
            })
        }else{
            res.json({
                "message": "EL PIN NO COINCIDE..."
            })
        }
        
        /*const lista = await db.query(
            `SELECT idHerramienta FROM cartentrada_herramientas WHERE idObra = ${obra} `,
            {type: db.QueryTypes.SELECT}
        )
        for (let i = 0; i < lista.length; i++) {
            const idEH = await ModelEntradaHerramientas.findAll({
                attributes:[[Sequelize.fn('MAX', Sequelize.col('idEntHer')), 'maxId']],
                raw: true,
            })
            const lastId = idEH[0]["maxId"];
            const hora = moment().locale('zh-mx').format('HH:mm:ss');
            const fecha = moment().locale('zh-mx').format('YYYY-MM-DD');
            await ModelEntradaHerramientas.create({
                idEntHer: lastId + 1, idHerramienta: lista[i].idHerramienta,
                idObra: obra, idRecibe: recibe, idEntrega:entrega,
                horaEntHer: hora, fechaEntHer: fecha
            })
            console.log("Herramienta agregada a entradas")
            await ModelHerramientas.update({statusHer:"disponible"}, {
                where:{idHerramienta:lista[i].idHerramienta}
            })
           console.log("Estado modificado") 
        }
        await CartHerramientasEnt.destroy({truncate: true})
        res.json({
            "message": "¡Herramientas agregadas!"
        })*/
    }catch (error){
        res.json({message: error.message})
    }
}

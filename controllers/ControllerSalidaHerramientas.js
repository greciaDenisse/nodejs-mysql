import { ModelSalidaHerramientas, ModelEmpleados, ModelHerramientas } from "../models/Models.js";
import db from "../database/db.js";
import { Sequelize } from "sequelize";
import moment from "moment/moment.js";


export const getAllSalidasHerramientas = async (req,res) =>{
    try{
        const obra = req.params.id
        const salidas = await db.query(
            `SELECT sh.idSalHer,  sh.horaSalHer, sh.fechaSalHer, sh.estadoSal, h.nombreHer, h.codigoHer, e.nombreEmp as recibe, em.nombreEmp as entrega FROM salida_herramientas sh JOIN herramientas h ON sh.idHerramienta = h.idHerramienta JOIN empleados e ON sh.idRecibe = e.idEmpleado JOIN empleados em ON sh.idEntrega = em.idEmpleado WHERE sh.idObra = ${obra} ORDER BY sh.idSalHer DESC`,
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
            `SELECT sh.idSalHer, sh.idHerramienta, sh.estadoSal, sh.idRecibe, e.nombreEmp, h.nombreHer, h.codigoHer FROM salida_herramientas sh JOIN herramientas h ON sh.idHerramienta = h.idHerramienta JOIN empleados e ON sh.idRecibe = e.idEmpleado WHERE sh.idObra = ${obra} `,
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
        const entrega = req.body.idEntrega
        const pin = req.body.pinEmp
        const lista = JSON.parse(req.body.lista)
        var mensaje = ""
        var herramienta = ""
        const pinEmpleado = await ModelEmpleados.findAll({
            where:{idEmpleado:recibe}
        })
        if(pinEmpleado[0].dataValues.pinEmp === pin){
            for (let i = 0; i < lista.length; i++) {
                const res = await ModelHerramientas.findAll({
                    where:{idHerramienta:lista[i].idL}
                })
                if(res[0].dataValues.statusHer === "disponible"){
                    console.log(res[0].dataValues.statusHer)
                }else{
                    console.log(res[0].dataValues.statusHer)
                    mensaje = "No disponible"
                    herramienta = res[0].dataValues.nombreHer
                    break;
                }  
            }
            if(mensaje === "No disponible" ){
                res.json({
                    "message": "La herramienta " + herramienta + " no está disponible"
                })
            }else{
                for (let h = 0; h < lista.length; h++) {
                    await ModelHerramientas.update({statusHer:"no disponible"}, {
                        where:{idHerramienta:lista[h].idL}
                    })
                    console.log("Estado modificado")
                    const idSH = await ModelSalidaHerramientas.findAll({
                        attributes:[[Sequelize.fn('MAX', Sequelize.col('idSalHer')), 'maxId']],
                        raw: true,
                    })
                    const lastId = idSH[0]["maxId"];
                    var date = moment( new Date());
                    const hora = date.tz('America/Mexico_City').format('HH:mm:ss')
                    const fecha = date.tz('America/Mexico_City').format('YYYY-MM-DD')
                    await ModelSalidaHerramientas.create({
                        idSalHer: lastId + 1, idHerramienta: lista[h].idL,
                        idObra: obra, idRecibe: recibe, idEntrega:entrega,
                        horaSalHer: hora, fechaSalHer: fecha, estadoSal:"prestado"
                    })
                    console.log("Herramienta agregada a salidas")
                }
                res.json({
                    "message": "¡Herramientas agregadas!"
                })
            }
        }else{
            res.json({
                "message": "EL PIN NO COINCIDE..."
            })
        }
        
        /*const lista = await db.query(
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
       
        await CartHerramientas.destroy({truncate: true})
        res.json({
            "message": "¡Herramientas agregadas!"
        })*/
    }catch (error){
        res.json({message: error.message})
        console.log(error)
    }
}

 /*await ModelSalidaHerramientas.create({
            idSalHer: lastId + 1, idHerramienta: herramienta,
            idObra: obra, idRecibe: recibe, idEntrega:entrega,
            horaSalHer: hora, fechaSalHer: fecha
        })*/
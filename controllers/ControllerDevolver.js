import {Entrada, Prestamos,Salidas,Materiales} from "../models/Models.js";
import { Sequelize} from "sequelize";
import db from "../database/db.js";

export const devolver = async (req, res) => {

    const cantEnt=req.body.cantidad
    const fecha = req.body.fecha;
    const precio = req.body.precio;

    try{    
        const resultado = await Prestamos.findAll({
            where:{idPrestamo:req.params.id}
        })

        const material = resultado[0].dataValues.idMaterial;
        const original = resultado[0].dataValues.obraOriginal;
        const entrada = resultado[0].dataValues.idEntMat;
        const cantidadSalida= resultado[0].dataValues.cantSalMat;

        const idEntrada = await Entrada.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idEntMat')), 'maxId']],
            raw: true,
        })
        const lastId = idEntrada[0]["maxId"];  

        await Entrada.create({idEntMat: lastId + 1,cantEntMat:cantEnt,
            precioUni:0,idMaterial:material,
            idObra:original,idBodega:null,fechaEntMat:fecha,flete:0,estadoEntrada:0})
        
        await Entrada.update({precioUni:precio},{
             where:{
                    idEntMat:entrada}
        })

        const resultadoMat = await Materiales.findAll({
            where:{idMaterial: material}
        })
        
        //console.log("stock:  "+resultado[0].stockMat + " idMat " + resultado[0].idMaterial)
        let totalMat = resultadoMat[0].stockMat
        let stockFinal= totalMat+parseInt(cantEnt)
        //console.log(totalMat)
        //console.log(stockFinal)
        //await ModelCategoria.create(req.body)
            await Materiales.update({stockMat:stockFinal},{
                where:{
                    idMaterial:material}
            })

        const resta = cantidadSalida-(cantEnt);

        await Prestamos.update({cantSalMat:resta},{
                where:{idPrestamo:req.params.id}
       })

       res.json({
        "message": "Registro creado correctamente"
    })

        
    } catch (error){
        res.json({message: error.message})
    }
}
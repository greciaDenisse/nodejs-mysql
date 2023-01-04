import {Entrada, Materiales} from "../models/Models.js";
import { Sequelize } from "sequelize";
import db from "../database/db.js";


export const getAllEntradas = async (req,res) => {
    try{
        const entradaMat= await db.query(
            'SELECT e.idObra, e.cantEntMat,e.precioUni,e.estadoEntrada,m.idCatMat, m.nombreMat,b.nombreBod, e.fechaEntMat from  entrada_materiales e JOIN materiales m ON m.idMaterial=e.idMaterial JOIN bodegas_materiales b ON b.idBodega=e.idBodega ORDER BY e.idEntMat DESC'
            ,{type:db.QueryTypes.SELECT}
        )
        res.json(entradaMat)
    }catch(error){
            res.json({message:error.message})
    }
}

export const createEntrada = async  (req,res) =>{

    const materials = JSON.parse(req.body.listaCarrito);
    const numObra = req.body.idObra;
    const fecha = moment().locale('zh-mx').format('YYYY-MM-DD');
    const bodega = req.body.bodega;

    try {
        for (var i = 0; i < materials.length; i++) {
        const idEntrada = await Entrada.findAll({
            attributes:[[Sequelize.fn('MAX', Sequelize.col('idEntMat')), 'maxId']],
            raw: true,
        })
        const lastId = idEntrada[0]["maxId"];   
       

        const resultado = await Materiales.findAll({
            where:{idMaterial: materials[i].material}
        })
        
        //console.log("stock:  "+resultado[0].stockMat + " idMat " + resultado[0].idMaterial)
        let totalMat = resultado[0].stockMat
        let cantidad = parseInt(materials[i].cantidad)
        let stockFinal= totalMat+(cantidad)
        //console.log(totalMat)
        //console.log(stockFinal)
        //await ModelCategoria.create(req.body)
            await Materiales.update({stockMat:stockFinal},{
                where:{
                    idMaterial:materials[i].material}
            })

            await Entrada.create({idEntMat: lastId + 1,cantEntMat:materials[i].cantidad,
            precioUni:materials[i].precio,idMaterial:materials[i].material,
            idObra:numObra,idBodega:bodega,fechaEntMat:fecha,flete:0,estadoEntrada:1})
        }
            res.json({
                "message": "Registro creado correctamente"
                
            })
        

            } catch (error) {
                res.json({message:error.message})
            }
}
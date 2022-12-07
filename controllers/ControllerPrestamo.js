import {Entrada, Prestamos,Salidas,Materiales} from "../models/Models.js";
import { Sequelize} from "sequelize";
import db from "../database/db.js";

//**mostrar todo **/

export const getAllPrestamos = async (req,res) => {
    try{
        const prestamos = await db.query(
            'SELECT o.nombreObra as original,ob.nombreObra as nueva,p.idMaterial, m.nombreMat,p.idEntMat,p.idPrestamo,p.cantSalMat from prestamos p JOIN materiales m ON m.idMaterial=p.idMaterial JOIN obras o ON  o.idObra=p.obraOriginal JOIN obras ob ON ob.idObra = p.obraNueva where p.cantSalMat>0',
            {type: db.QueryTypes.SELECT}
        )
        res.json(prestamos)
    } catch (error){
        res.json({message: error.message})
    }
}

export const getPrestamo = async (req, res) => {
    try{
        const prestamo = await Prestamos.findAll({
            where:{idPrestamo:req.params.id}
        })
        res.json(prestamo[0])
    } catch (error){
        res.json({message: error.message})
    }
}

export const createPrestamo = async  (req,res) =>{
    //console.log("Body de la respuesta : ",req.body);
    const carrito = JSON.parse(req.body.listaCarrito);
    const numObraOriginal = req.body.idObraOriginal;
    const numObraNueva = req.body.idObraNueva;
    const fecha = req.body.fecha;
    //console.log(materials)
    console.log(numObraOriginal)
    console.log(numObraNueva)

    try{
        for (var i = 0; i < carrito.length; i++) {

            const salidaId = await Salidas.findAll({
                attributes:[[Sequelize.fn('MAX', Sequelize.col('idSalMat')), 'maxId']],
                raw: true,
            })
            const lastId = salidaId[0]["maxId"];  

           await Salidas.create({idSalMat: lastId + 1, 
                cantSalMat: carrito[i].cantidad,fechaSalMat:fecha,
                flete:0,idMaterial:carrito[i].idMaterial,idObra:numObraOriginal,
                estadoSalida:0})
            
           const precioMax = await db.query(
                    'SELECT precioUni,idBodega FROM entrada_materiales WHERE idMaterial=? ORDER BY idEntMat DESC LIMIT 1',
                    {
                        replacements: [carrito[i].idMaterial],
                        type:db.QueryTypes.SELECT
                    }
            )
            const precioFinal = precioMax[0].precioUni;
            const bodegaFinal = precioMax[0].idBodega;
            
                //console.log(precioFinal)
                //console.log(bodegaFinal)

            const idEntrada = await Entrada.findAll({
                attributes:[[Sequelize.fn('MAX', Sequelize.col('idEntMat')), 'maxId']],
                raw: true,
            })
            const lastEntrada = idEntrada[0]["maxId"]; 

            await Entrada.create({idEntMat: lastEntrada+ 1,cantEntMat:carrito[i].cantidad,
                precioUni:precioFinal,idMaterial:carrito[i].idMaterial,estadoEntrada:1,
                idObra:numObraNueva,idBodega:bodegaFinal,fechaEntMat:fecha})
            //segunda salida (nueva obra)

            {/*const resultado2 = await Materiales.findAll({
                where:{idMaterial: carrito[i].idMaterial}
            })
            //console.log("stock:  "+resultado[0].stockMat + " idMat " + resultado[0].idMaterial)
            let totalMat2 = resultado2[0].stockMat
            let cantidad2 = parseInt(carrito[i].cantidad)
            let stockFinal2= totalMat2-(cantidad2)
            //console.log(totalMat)
            //console.log(stockFinal)
            //await ModelCategoria.create(req.body)
            await Materiales.update({stockMat:stockFinal2},{
                    where:{
                    idMaterial: carrito[i].idMaterial}
            })*/}

            const prestamoId = await Prestamos.findAll({
                attributes:[[Sequelize.fn('MAX', Sequelize.col('idPrestamo')), 'maxId']],
                raw: true,
            })
            const lastIdPrestamo = prestamoId[0]["maxId"];  
            console.log(lastEntrada)
           await Prestamos.create({idPrestamo: lastIdPrestamo + 1, 
                cantSalMat: carrito[i].cantidad,
                idMaterial:carrito[i].idMaterial,obraOriginal:numObraOriginal,
                obraNueva:numObraNueva,idEntMat:lastEntrada+1})
            //console.log("registrado")
        }
        res.json({
            "message": "Registro creado correctamente"
            
        })
            } catch (error) {
                res.json({message:error.message})
        }
}


import {Entrada, Prestamos,Salidas,Materiales} from "../models/Models.js";
import { Sequelize} from "sequelize";
import db from "../database/db.js";
import moment from "moment/moment.js";

//**mostrar todo **/

export const getAllPrestamos = async (req,res) => {
    try{
        const prestamos = await db.query(
            'SELECT o.nombreObra as original,p.prestamoCant,ob.nombreObra as nueva,p.idMaterial,p.horaPrestamo,p.fechaPrestamo,m.nombreMat,p.idEntMat,p.idPrestamo,p.cantSalMat from prestamos p JOIN materiales m ON m.idMaterial=p.idMaterial JOIN obras o ON  o.idObra=p.obraOriginal JOIN obras ob ON ob.idObra = p.obraNueva',
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
    var date = moment( new Date());
    const fecha = date.tz('America/Mexico_City').format('YYYY-MM-DD')

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
                precioUni:precioFinal,idMaterial:carrito[i].idMaterial,estadoEntrada:2,
                idObra:numObraNueva,idBodega:bodegaFinal,fechaEntMat:fecha})

            const prestamoId = await Prestamos.findAll({
                attributes:[[Sequelize.fn('MAX', Sequelize.col('idPrestamo')), 'maxId']],
                raw: true,
            })
            const lastIdPrestamo = prestamoId[0]["maxId"];  
            

            var date1 = moment( new Date());
            const hora = date1.tz('America/Mexico_City').format('HH:mm:ss')
            const fechaPrestamo = date1.tz('America/Mexico_City').format('YYYY-MM-DD')

           await Prestamos.create({idPrestamo: lastIdPrestamo + 1, 
                cantSalMat: carrito[i].cantidad,prestamoCant: carrito[i].cantidad,horaPrestamo:hora,fechaPrestamo:fechaPrestamo,
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


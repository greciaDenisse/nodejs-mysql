import {CarritoSalidaMat, Entrada, Materiales, Salidas} from "../models/Models.js";
import { Sequelize} from "sequelize";
import db from "../database/db.js";


export const stock = async (req,res) => {

    const arr = [];
    let resta=0;

    try{
        const matEntrada= await db.query(
            'SELECT SUM(cantEntMat) As TotalMat ,m.idCatMat,e.idMaterial,e.idObra,o.nombreObra, m.nombreMat from entrada_materiales e JOIN materiales m ON e.idMaterial = m.idMaterial JOIN obras o ON o.idObra = e.idObra where e.idObra=? GROUP BY idMaterial;',
            {
              replacements: [req.params.id],
              type:db.QueryTypes.SELECT
            }
        )

        for (var i = 0; i < matEntrada.length; i++) {

            const matSalida= await db.query(
                'SELECT SUM(cantSalMat) As TotalSal ,e.idMaterial,e.idObra,o.nombreObra, m.nombreMat from salida_materiales e JOIN materiales m ON e.idMaterial = m.idMaterial JOIN obras o ON o.idObra = e.idObra where e.idObra=? GROUP BY idMaterial;',
                {
                  replacements: [req.params.id],
                  type:db.QueryTypes.SELECT
                }
            )

            const resultado = matSalida.filter(dato => dato.idMaterial === matEntrada[i].idMaterial);
                //console.log(resultado)
               if(resultado.length ===0){
                    arr.push({TotalMat:parseInt(matEntrada[i].TotalMat),idMaterial:matEntrada[i].idMaterial,nombreMat:matEntrada[i].nombreMat,categoria:matEntrada[i].idCatMat})
                }else{
                        resta= matEntrada[i].TotalMat-(resultado[0].TotalSal);
                        arr.push({TotalMat:resta,idMaterial:matEntrada[i].idMaterial,nombreMat:matEntrada[i].nombreMat,categoria:matEntrada[i].idCatMat})
                }
                //console.log(resultado)
        }
        console.log(arr)
    
        res.json(arr)
        
    }catch(error){
            res.json({message:error.message})
    }
}

export const getAllSalidas = async (req,res) => {
    try{
        const matSalida= await db.query(
            'select s.idMaterial,s.cantSalMat,s.estadoSalida,s.fechaSalMat,s.estadoSalida,s.idObra,m.nombreMat from materiales m JOIN salida_materiales s ON s.idMaterial = m.idMaterial where s.idObra=?',
            {
              replacements: [req.params.id],
              type:db.QueryTypes.SELECT
            }
        )
        res.json(matSalida)
    } catch (error){
        res.json({message: error.message})
    }
}

export const createSalida = async  (req,res) =>{
    //console.log("Body de la respuesta : ",req.body);
    const materials = JSON.parse(req.body.listaCarrito);
    const numObra = req.body.idObra;
    const fecha = moment().locale('zh-mx').format('YYYY-MM-DD');
    //console.log(materials)
    //console.log(numObra)
   
        try{
        for (var i = 0; i < materials.length; i++) {

            const salidaId = await Salidas.findAll({
                attributes:[[Sequelize.fn('MAX', Sequelize.col('idSalMat')), 'maxId']],
                raw: true,
            })
            const lastId = salidaId[0]["maxId"];  

            await Salidas.create({idSalMat: lastId + 1, 
                cantSalMat:materials[i].cantidad,fechaSalMat:fecha,
                flete:0,idMaterial:materials[i].idMaterial,idObra:numObra,
                estadoSalida:1})
        
            const resultado1 = await Materiales.findAll({
                where:{idMaterial: materials[i].idMaterial}
            })

            //console.log("stock:  "+resultado[0].stockMat + " idMat " + resultado[0].idMaterial)
            let totalMat = resultado1[0].stockMat
            let cantidad = parseInt(materials[i].cantidad)
            let stockFinal= totalMat-(cantidad)
            //console.log(totalMat)
            //console.log(stockFinal)
            //await ModelCategoria.create(req.body)
            await Materiales.update({stockMat:stockFinal},{
                    where:{
                    idMaterial:materials[i].idMaterial}
            })
            }  res.json({
                "message": "Registro creado correctamente"
            })
            } catch (error) {
                res.json({message:error.message})
        }
    

    {/*try {
       
        const registroCarritos= await db.query(
            'select idObraOriginal,idObraNueva,idMaterial,cantSalida from carsalida_materiales',
            {type:db.QueryTypes.SELECT}
        )

        for (var i = 0; i < registroCarritos.length; i++) {
            const salidaId = await Salidas.findAll({
                attributes:[[Sequelize.fn('MAX', Sequelize.col('idSalMat')), 'maxId']],
                raw: true,
            })
            const lastId = salidaId[0]["maxId"];   
            
            console.log("original" + registroCarritos[i].idObraOriginal)
            console.log("nueva" + registroCarritos[i].idObraNueva)

                if (registroCarritos[i].idObraOriginal===registroCarritos[i].idObraNueva){
                    await Salidas.create({idSalMat: lastId + 1, 
                        cantSalMat:registroCarritos[i].cantSalida,fechaSalMat:null,
                        flete:0,idMaterial:registroCarritos[i].idMaterial,idObra:registroCarritos[i].idObraOriginal,precio:0})
                   
                    const resultado1 = await Materiales.findAll({
                        where:{idMaterial: registroCarritos[i].idMaterial}
                    })

                    //console.log("stock:  "+resultado[0].stockMat + " idMat " + resultado[0].idMaterial)
                    let totalMat = resultado1[0].stockMat
                    let cantidad = parseInt(registroCarritos[i].cantSalida)
                    let stockFinal= totalMat-(cantidad)
                    //console.log(totalMat)
                    //console.log(stockFinal)
                    //await ModelCategoria.create(req.body)
                    await Materiales.update({stockMat:stockFinal},{
                            where:{
                            idMaterial:registroCarritos[i].idMaterial}
                    })
                    console.log("registrado")

                }else{

                    await Salidas.create({idSalMat: lastId + 1, 
                        cantSalMat: registroCarritos[i].cantSalida,fechaSalMat:null,
                        flete:0,idMaterial:registroCarritos[i].idMaterial,idObra:registroCarritos[i].idObraOriginal})
                    
                    const precioMax = await db.query(
                            'SELECT precioUni,idBodega FROM entrada_materiales WHERE idMaterial=? ORDER BY idEntMat DESC LIMIT 1',
                            {
                                replacements: [registroCarritos[i].idMaterial],
                                type:db.QueryTypes.SELECT
                            }
                    )

                    const precioFinal = precioMax[0].precioUni;
                    const bodegaFinal = precioMax[0].idBodega;
                    
                    console.log(precioFinal)
                    console.log(bodegaFinal)

                    const idEntrada = await Entrada.findAll({
                        attributes:[[Sequelize.fn('MAX', Sequelize.col('idEntMat')), 'maxId']],
                        raw: true,
                    })
                    const lastEntrada = idEntrada[0]["maxId"]; 

                    await Entrada.create({idEntMat: lastEntrada+ 1,cantEntMat:registroCarritos[i].cantSalida,
                        precioUni:0,idMaterial:registroCarritos[i].idMaterial,
                        idObra:registroCarritos[i].idObraNueva,idBodega:bodegaFinal,fechaEntMat:null})
                    //segunda salida (nueva obra)
                    const salidaId2 = await Salidas.findAll({
                            attributes:[[Sequelize.fn('MAX', Sequelize.col('idSalMat')), 'maxId']],
                            raw: true,
                    })
                    const lastIdSa = salidaId2[0]["maxId"];   

                    await Salidas.create({idSalMat: lastIdSa+ 1, 
                    cantSalMat:registroCarritos[i].cantSalida,fechaSalMat:null,
                    flete:0,idMaterial:registroCarritos[i].idMaterial,idObra:registroCarritos[i].idObraNueva})

                    const resultado2 = await Materiales.findAll({
                        where:{idMaterial: registroCarritos[i].idMaterial}
                    })
                    //console.log("stock:  "+resultado[0].stockMat + " idMat " + resultado[0].idMaterial)
                    let totalMat2 = resultado2[0].stockMat
                    let cantidad2 = parseInt(registroCarritos[i].cantSalida)
                    let stockFinal2= totalMat2-(cantidad2)
                    //console.log(totalMat)
                    //console.log(stockFinal)
                    //await ModelCategoria.create(req.body)
                    await Materiales.update({stockMat:stockFinal2},{
                            where:{
                            idMaterial: registroCarritos[i].idMaterial}
                    })
                    console.log("registrado")
                }
         }
         res.json({
            "message": "¡Registro creado correctamente!"
            
        })
        
            } catch (error) {
                res.json({message:error.message})
            }*/}
    
}
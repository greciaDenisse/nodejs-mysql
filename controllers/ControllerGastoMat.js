import { Sequelize} from "sequelize";
import db from "../database/db.js"

export const getGastosMat = async (req,res) =>{
        const obra = req.params.idO

    const gastos= await db.query(
            `select e.cantEntMat,e.precioUni,e.fechaEntMat,e.idMaterial,e.idObra,e.idBodega,m.codigoMat,m.nombreMat,m.idCatMat,m.idUnidad,c.nombreCatMat,u.nombreUnidad,
            FORMAT(cantEntMat*precioUni,2) as total from entrada_materiales e JOIN materiales m ON e.idMaterial=m.idMaterial JOIN categoria_materiales c ON c.idCatMat= m.idCatMat JOIN unidades_materiales u ON m.idUnidad=u.idUnidad where
                idObra=${obra} and cantEntMat != 0 and precioUni != 0`,
            {type: db.QueryTypes.SELECT}
        )

        res.json(gastos)
}

export const totalGastos = async (req,res) =>{
        const obra = req.params.idO
        try{
                const gastos = await db.query(
                    `SELECT CAST(TRUNCATE(SUM((e.cantEntMat*e.precioUni)),2) AS FLOAT) AS total FROM entrada_materiales e WHERE idObra= ${obra} `,
                    {type: db.QueryTypes.SELECT}
                )
                console.log(gastos)
                res.json(gastos)
            } catch (error){
                res.json({message: error.message})
            }
}
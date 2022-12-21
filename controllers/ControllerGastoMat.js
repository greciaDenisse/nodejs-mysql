import { Sequelize} from "sequelize";
import db from "../database/db.js"

export const getGastosMat = async (req,res) =>{
        const fechaInicio = req.params.idI
        const fechaFinal = req.params.idF
        const obra = req.params.idO

    const gastos= await db.query(
            `select e.cantEntMat,e.precioUni,e.fechaEntMat,e.idMaterial,e.idObra,e.idBodega,m.codigoMat,m.nombreMat,m.idCatMat,m.idUnidad,c.nombreCatMat,u.nombreUnidad,
            FORMAT(cantEntMat*precioUni,2) as total from entrada_materiales e JOIN materiales m ON e.idMaterial=m.idMaterial JOIN categoria_materiales c ON c.idCatMat= m.idCatMat JOIN unidades_materiales u ON m.idUnidad=u.idUnidad where
             fechaEntMat BETWEEN '${fechaInicio}' and '${fechaFinal}' AND idObra=${obra} and cantEntMat != 0 and precioUni != 0`,
            {type: db.QueryTypes.SELECT}
        )

        res.json(gastos)
}
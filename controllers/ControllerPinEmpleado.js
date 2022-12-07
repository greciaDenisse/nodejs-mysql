import { ModelEmpleados } from "../models/Models.js";

export const updatePin = async (req,res) =>{
    try{
        const pin = req.body.pinEmp
        const nuevo = req.body.pinNuevo
        const pinEmpleado = await ModelEmpleados.findAll({
            where:{idEmpleado:req.params.id}
        })
        console.log(pinEmpleado[0].dataValues.pinEmp)
        if(pinEmpleado[0].dataValues.pinEmp === pin){
            await ModelEmpleados.update({pinEmp: nuevo},{
                    where:{idEmpleado:req.params.id}
                })
            res.json({
                "message": "¡Pin modificado!"
            })
        }else{
            res.json({
                "message": "No coincide Pin actual..."
            })
        }
        
    } catch (error){
        res.json({message: error.message})
    }

}
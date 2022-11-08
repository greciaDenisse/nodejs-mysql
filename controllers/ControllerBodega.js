import { Bodegas } from "../models/Modelos.js"


export const getAllBodegas = async (req,res) => {
    try{
        const bodegas= await Bodegas.findAll()
        res.json(bodegas)
   }catch(error){
           res.json({message:error.message})
   }
}
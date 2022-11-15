import { Bodegas } from "../models/Models.js"


export const getAllBodegas = async (req,res) => {
    try{
        const bodegas= await Bodegas.findAll()
        res.json(bodegas)
   }catch(error){
           res.json({message:error.message})
   }
}
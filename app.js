import express from "express";
import cors from 'cors'
import db from "./database/db.js";
import catRoutes from "./routes/routes.js";
import { PORT } from "./config.js";

const app=express()

app.use(cors())
app.use(express.json())
app.use('/rosmo',catRoutes)
app.use("/images",express.static("./images"))


try {
    await db.authenticate()
    console.log("conexion exitosa")
} catch (error) {
    console.log(`El error de conexion es: ${error}`)
}

/*app.get('/',(req,res)=>{
    res.send("hola mundo")
})*/

app.listen(PORT,()=>{
    console.log("server up running",PORT)
})
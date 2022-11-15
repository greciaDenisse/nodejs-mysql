import express from "express";
import cors from 'cors';
import db from "./database/db.js";
import rosmoRoutes from "./routes/Routes.js";
import * as dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT;

app.use(cors())
app.use(express.json())
app.use('/rosmo', rosmoRoutes)

app.use("/images",express.static("./images"))

try{
    await db.authenticate()
    console.log('Conexion exitosa a la base de datos')
    app.get('/', (req, res)=>{
        res.send('WELCOME')
    })
} catch(error){
    console.log(`El error de conexion es: ${error}`)
    app.get('/', (req, res)=>{
        res.send('CONNECTION ERROR')
    })
}



app.listen(PORT, ()=>{
    console.log(`Server UP running in http://localhost:${PORT}`)
})
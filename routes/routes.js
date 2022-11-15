import express from 'express';
import { createCatHer, deleteCatHer, getAllCatHer, getCatHer, updateCatHer, uploadcather} from '../controllers/ControllerCatHer.js';
import { getAllAreas, getArea, createArea, updateArea, deleteArea} from '../controllers/ControllerAreas.js';
import { getAllPuestos, getPuesto, createPuesto, updatePuesto, deletePuesto} from '../controllers/ControllerPuestos.js';
import { getAllHerramientas, getHerramienta, createHerramienta, updateHerramienta, deleteHerramienta} from '../controllers/ControllerHerramientas.js';
import { getAllEmpleados, getEmpleado, createEmpleado, updateEmpleado, deleteEmpleado} from '../controllers/ControllerEmpleados.js';
import { getAllTipo, getTipo, createTipo,updateTipo,deleteTipo } from '../controllers/ControllerTipObra.js'; 
import { getAllMarcas, getMarca, createMarca, updateMarca, deleteMarca } from '../controllers/ControllerMarcas.js';
import { getAllCat,createCat,deleteCat,getCat,updateCat ,upload}from "../controllers/ControllerCatMat.js";
import { createMat,deleteMat,updateMat,getMat,getMatActivo } from "../controllers/ControllerMaterial.js";
import {getAllObras,getObra,updateObra,deleteObra,createObra, uploadObra } from "../controllers/ControllerObras.js";
import { getAllEntradas,createEntrada } from "../controllers/ControllerEntrada.js";
import { getAllBodegas } from "../controllers/ControllerBodega.js";

const router = express.Router();

//Categorias Herramientas
router.get('/cather/', getAllCatHer)
router.get('/cather/:id', getCatHer)
router.post('/cather/', uploadcather.single('image'), createCatHer)
router.put('/cather/:id', uploadcather.single('image'), updateCatHer)
router.delete('/cather/:id', deleteCatHer)

//Areas
router.get('/areas/', getAllAreas)
router.get('/areas/:id', getArea)
router.post('/areas/', createArea)
router.put('/areas/:id', updateArea)
router.delete('/areas/:id', deleteArea)

//Puestos
router.get('/puestos/', getAllPuestos)
router.get('/puestos/:id', getPuesto)
router.post('/puestos/', createPuesto)
router.put('/puestos/:id', updatePuesto)
router.delete('/puestos/:id', deletePuesto)

//Marcas
router.get('/marcas/', getAllMarcas)
router.get('/marcas/:id', getMarca)
router.post('/marcas/', createMarca)
router.put('/marcas/:id', updateMarca)
router.delete('/marcas/:id', deleteMarca)

//Herramientas
router.get('/herramientas/', getAllHerramientas)
router.get('/herramientas/:id', getHerramienta)
router.post('/herramientas/', createHerramienta)
router.put('/herramientas/:id', updateHerramienta)
router.delete('/herramientas/:id', deleteHerramienta)

//Empleados
router.get('/empleados/', getAllEmpleados)
router.get('/empleados/:id', getEmpleado)
router.post('/empleados/', createEmpleado)
router.put('/empleados/:id', updateEmpleado)
router.delete('/empleados/:id', deleteEmpleado)

//Categoria Materiales
router.get('/catmat/',getAllCat)
router.get('/catmat/:id',getCat)
router.post('/catmat/',upload.single('image'),createCat)
router.put('/catmat/:id',upload.single('image'),updateCat)
router.delete('/catmat/:id',deleteCat)

//Materiales
router.get('/mat/',getMatActivo)
router.get('/mat/:id',getMat)
router.post('/mat/',createMat)
router.put('/mat/:id',updateMat)
router.delete('/mat/:id',deleteMat)

//Obras
router.get('/obras/',getAllObras)
router.get('/obras/:id',getObra)
router.post('/obras/',uploadObra.single('image'),createObra)
router.put('/obras/:id',uploadObra.single('image'),updateObra)
router.delete('/obras/:id',deleteObra)

//Tipos de obra
router.get('/tiposObra/',getAllTipo)
router.get('/tiposObra/:id',getTipo)
router.post('/tiposObra/',createTipo)
router.put('/tiposObra/:id',updateTipo)
router.delete('/tiposObra/:id',deleteTipo)

//Entradas
router.get('/entradas/',getAllEntradas)
router.post('/entradas/',createEntrada)

//Bodegas
router.get('/bodegas/',getAllBodegas)


export default router;
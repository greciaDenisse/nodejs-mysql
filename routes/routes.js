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
import { getUnidad,createUnidad,updateUnidad,deleteUnidad,getAllUnidades} from "../controllers/ControllerUnidad.js";
import { getAllBodegas,createBodega,deleteBodega,getBodega,updateBodega } from "../controllers/ControllerBodega.js";
import { createSalida,getAllSalidas, stock} from '../controllers/ControllerSalida.js';
import { createCarritoMat,getAllCarritoMat } from '../controllers/ControllerCarritoMat.js';
import { getAllPrestamos,createPrestamo , getPrestamo} from '../controllers/ControllerPrestamo.js';
import { getAllSalidasHerramientas,createSalidaHerramientas, getAllSalidaHerramienta } from '../controllers/ControllerSalidaHerramientas.js';
import { getLista, createLista, deleteHer, deleteList} from '../controllers/ControllerCartHerramienta.js';
import { getAllEntradasHerramientas, createEntradaHerramientas } from '../controllers/ControllerEntradaHerramientas.js';
import { getListaEnt,createListaEnt, deleteHerEnt, deleteListEnt } from '../controllers/ControllerCartHerramientasEntrada.js';
import { devolver } from '../controllers/ControllerDevolver.js';
import { updatePin } from '../controllers/ControllerPinEmpleado.js';
import { getAllManoObra, createPersonal, getPersonal, deletePersonal, getResidentes, addResidente, getResidente } from '../controllers/ControllerManoObra.js';
import { getAsisOficina,getEmpleadosOfi,createAsisOfis } from '../controllers/ControllerAsisOfi.js';
import { getGastosMat } from '../controllers/ControllerGastoMat.js';
import { getAsistencia, getPersonalObra, createAsistencia, getAsistenciaTomada, updateAsistencia } from '../controllers/ControllerAsistenciaCampo.js';
import { getGastosManoObra, createGatosObra, getGastosRegistrados } from '../controllers/ControllerGastosManoObra.js';


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

//Salida de herramientas
router.get('/salidaherramientas/:id',getAllSalidasHerramientas)
router.post('/salidaherramientas/',createSalidaHerramientas)
router.get('/herramientasalida/:id',getAllSalidaHerramienta)

//Entrada de herramientas
router.get('/entradaherramientas/:id',getAllEntradasHerramientas)
router.post('/entradaherramientas/',createEntradaHerramientas)

//Bodegas
router.get('/bodegas/',getAllBodegas)
router.get('/bodegas/:id', getBodega)
router.post('/bodegas/', createBodega)
router.put('/bodegas/:id', updateBodega)
router.delete('/bodegas/:id', deleteBodega)

//unidades
router.get('/unidad/', getAllUnidades)
router.get('/unidad/:id', getUnidad)
router.post('/unidad/', createUnidad)
router.put('/unidad/:id', updateUnidad)
router.delete('/unidad/:id', deleteUnidad)

//Salidas
router.get('/materialesEntrada/:id', stock)
router.post('/salidas/', createSalida)
router.get('/salidas/:id', getAllSalidas)

//prestamos
router.get('/prestamos/', getAllPrestamos)
router.post('/prestamos/',createPrestamo)
router.get('/prestamos/:id', getPrestamo)

//Cart Salida Herramientas
router.get('/carther/', getLista)
router.post('/carther/', createLista)
router.put('/carther/:id', deleteHer)
router.delete('/carther/:id/obra/:ido', deleteList)

//Cart Entrada Herramientas
router.get('/cartenther/', getListaEnt)
router.post('/cartenther/', createListaEnt)
router.put('/cartenther/:id', deleteHerEnt)
router.delete('/cartenther/', deleteListEnt)

//devolver
router.put('/devolver/:id', devolver)
//Pin
router.put('/pin/:id',updatePin)

//Mano de obra
router.get('/mano-obra/', getAllManoObra)
router.get('/mano-obra/:id',getPersonal)
router.post('/mano-obra/', createPersonal)
router.delete('/mano-obra/:ido/emp/:ide', deletePersonal)
router.get('/residentes/', getResidentes)
router.get('/residentes/:id', getResidente)
router.post('/residentes/', addResidente)

//Asistencia campo
router.get('/asistencia-obra/',getAsistencia)
router.get('/asistencia-obra/:id', getPersonalObra)
router.post('/asistencia-obra/', createAsistencia)

//Asistencia oficina
router.get('/asistencia-oficina/',getAsisOficina)
router.get('/empleadosOficina/',getEmpleadosOfi)
router.post('/createAsisOfis/', createAsisOfis)

//gastos
router.get('/gastosMat/:idI/fechaFin/:idF/obra/:idO', getGastosMat)

router.get('/lista-asistencia/:id', getAsistenciaTomada)
router.put('/asistencia-obra/:ido/emp/:ide', updateAsistencia)

//Gastos mano de obra
router.get('/gastos-mano-obra/:id', getGastosManoObra)
router.get('/gastos-registrados/:id', getGastosRegistrados)
router.post('/gastos-mano-obra/', createGatosObra)

export default router;
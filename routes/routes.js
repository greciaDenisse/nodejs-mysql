import express from "express";
import { getAllCat,createCat,deleteCat,getCat,updateCat ,upload}from "../controllers/ControllerCatMat.js";
import { createMat,deleteMat,updateMat,getMat,getMatActivo } from "../controllers/ControllerMaterial.js";
import {createTipo,getAllTipo,getTipo,updateTipo,deleteTipo } from "../controllers/ControllerTipObra.js";
import {getAllObras,getObra,updateObra,deleteObra,createObra, uploadObra } from "../controllers/ControllerObras.js";
import { getAllEntradas,createEntrada } from "../controllers/ControllerEntrada.js";
import { getAllBodegas } from "../controllers/ControllerBodega.js";
import { getAllAreas, getArea, createArea, updateArea, deleteArea} from '../controllers/ControllerAreas.js';

const router= express.Router()

router.get('/catmat/',getAllCat)
router.get('/catmat/:id',getCat)
router.post('/catmat/',upload.single('image'),createCat)
router.put('/catmat/:id',upload.single('image'),updateCat)
router.delete('/catmat/:id',deleteCat)

router.get('/mat/',getMatActivo)
router.get('/mat/:id',getMat)
router.post('/mat/',createMat)
router.put('/mat/:id',updateMat)
router.delete('/mat/:id',deleteMat)

router.get('/tiposObra/',getAllTipo)
router.get('/tiposObra/:id',getTipo)
router.post('/tiposObra/',createTipo)
router.put('/tiposObra/:id',updateTipo)
router.delete('/tiposObra/:id',deleteTipo)

router.get('/obras/',getAllObras)
router.get('/obras/:id',getObra)
router.post('/obras/',uploadObra.single('image'),createObra)
router.put('/obras/:id',uploadObra.single('image'),updateObra)
router.delete('/obras/:id',deleteObra)


router.get('/entradas/',getAllEntradas)
router.post('/entradas/',createEntrada)

router.get('/bodegas/',getAllBodegas)


//Areas
router.get('/areas/', getAllAreas)
router.get('/areas/:id', getArea)
router.post('/areas/', createArea)
router.put('/areas/:id', updateArea)
router.delete('/areas/:id', deleteArea)


export default router

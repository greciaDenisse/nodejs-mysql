import db from "../database/db.js";
import { and, DataTypes } from "sequelize";

export const CategoriaModel = db.define('catmateriales',{
    idCatMat:{type:DataTypes.INTEGER,primaryKey:true},
    nombreCatMat:{type: DataTypes.STRING},
    estadoCatMat:{type:DataTypes.BOOLEAN},
    imagenCatMat:{type: DataTypes.STRING}
},{
    timestamps:false
}
)

export const Materiales = db.define('materiales',{
    idMaterial:{type:DataTypes.INTEGER,primaryKey:true},
    codigoMat:{type: DataTypes.STRING},
    nombreMat:{type: DataTypes.STRING},
    estadoMat:{type:DataTypes.BOOLEAN},
    unidadMat:{type: DataTypes.STRING},
    stockMat:{type: DataTypes.STRING},
    idCatMat:{type:DataTypes.INTEGER}
},{
    timestamps:false
}
)

export const Obras = db.define('obras',{
    idObra:{type:DataTypes.INTEGER,primaryKey:true},
    nombreObra:{type: DataTypes.STRING},
    clienteObra:{type: DataTypes.STRING},
    direccionObra:{type: DataTypes.STRING},
    fechaInicio:{type: DataTypes.DATE},
    fechaFinal:{type: DataTypes.DATE},
    status :{type: DataTypes.STRING},
    idTipoObra:{type: DataTypes.INTEGER},
    residente:{type: DataTypes.INTEGER},
    imagenObra:{type: DataTypes.STRING},
    estadoObra:{type:DataTypes.BOOLEAN},
},{
    timestamps:false
}
)

export const TipObra = db.define('tiposobras',{
    idTObra:{type:DataTypes.INTEGER,primaryKey:true},
    nombreTObra:{type: DataTypes.STRING},
    estadoTObra:{type: DataTypes.BOOLEAN}
},{
    timestamps:false
}
)

//Modelo areas
export const ModelAreas = db.define('areas',{
    idArea: {type: DataTypes.INTEGER, primaryKey:true},
    nombreArea: {type: DataTypes.STRING},
    estadoArea: {type: DataTypes.STRING},
},{
    timestamps: false
})

export const Entrada = db.define('entradamateriales',{
    idEntMat:{type:DataTypes.INTEGER,primaryKey:true},
    cantEntMat:{type: DataTypes.INTEGER},
    precioUni:{type: DataTypes.DOUBLE},
    fechaEntMat:{type: DataTypes.DATE},
    idObra:{type: DataTypes.INTEGER},
    idMaterial:{type: DataTypes.INTEGER},
    idBodega:{type: DataTypes.INTEGER}
},{
    timestamps:false
}
)

export const Bodegas = db.define('bodegas',{
    idBodega:{type:DataTypes.INTEGER,primaryKey:true},
    nombreBod:{type: DataTypes.STRING},
    direccionBod:{type: DataTypes.STRING},
    estadoBod:{type: DataTypes.BOOLEAN}
},{
    timestamps:false
}
)
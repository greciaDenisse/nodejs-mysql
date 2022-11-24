import db from '../database/db.js';
import { DataTypes } from 'sequelize';

//Modelo categoria herramientas
export const ModelCatHer = db.define('categoria_herramientas',{
    idCatHer: {type: DataTypes.INTEGER, primaryKey: true},    
    nombreCatHer: {type: DataTypes.STRING},
    imagenCatHer: {type: DataTypes.STRING},
    estadoCatHer: {type: DataTypes.BOOLEAN},
},{
    timestamps: false
})

//Modelo obras

export const Obras = db.define('obras',{
    idObra:{type:DataTypes.INTEGER,primaryKey:true},
    nombreObra:{type: DataTypes.STRING},
    clienteObra:{type: DataTypes.STRING},
    direccionObra:{type: DataTypes.STRING},
    fechaInicio:{type: DataTypes.DATE},
    fechaFinal:{type: DataTypes.DATE},
    status :{type: DataTypes.STRING},
    idTObra:{type: DataTypes.INTEGER},
    administrador:{type: DataTypes.INTEGER},
    residente:{type: DataTypes.INTEGER},
    imagenObra:{type: DataTypes.STRING},
    estadoObra:{type:DataTypes.BOOLEAN},

},{
    timestamps:false
}
)

//Modelo Tipo Obra

export const TipObra = db.define('tipos_obras',{
    idTipoObra:{type:DataTypes.INTEGER,primaryKey:true},
    nombreTipoObra:{type: DataTypes.STRING},
    estadoTipoObra:{type: DataTypes.BOOLEAN}
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

//Modelo puestos
export const ModelPuestos = db.define('puestos',{
    idPuesto: {type: DataTypes.INTEGER, primaryKey:true},
    nombrePuesto: {type: DataTypes.STRING},
    estadoPuesto: {type: DataTypes.BOOLEAN},
},{
    timestamps: false
})

//Marcas
export const ModelMarcas = db.define('marcas_herramientas',{
    idMarca: {type: DataTypes.INTEGER, primaryKey:true},
    nombreMarca: {type: DataTypes.STRING},
    estadoMarca: {type: DataTypes.BOOLEAN},
},{
    timestamps: false
})

//Modelo herramientas
export const ModelHerramientas = db.define('herramientas',{
    idHerramienta: {type: DataTypes.INTEGER, primaryKey:true},
    codigoHer: {type: DataTypes.STRING},
    nombreHer: {type: DataTypes.STRING},
    idMarcaHer: {type: DataTypes.INTEGER},
    idCategoria: {type: DataTypes.INTEGER},
    statusHer: {type: DataTypes.STRING},
    estadoHer: {type: DataTypes.BOOLEAN},
},{
    timestamps: false
})

//Modelo Empleados
export const ModelEmpleados = db.define('empleados',{
    idEmpleado: {type: DataTypes.INTEGER, primaryKey:true},
    codigoEmp: {type: DataTypes.STRING},
    nombreEmp: {type: DataTypes.STRING},
    apellidoPaternoEmp: {type: DataTypes.STRING},
    apellidoMaternoEmp: {type: DataTypes.STRING},
    correoEmp: {type: DataTypes.STRING},
    telefonoEmp: {type: DataTypes.STRING},
    fechaNacEmp: {type: DataTypes.DATE},
    sexoEmp: {type: DataTypes.CHAR},
    sueldoEmp: {type: DataTypes.DOUBLE},
    seguroEmp:{type: DataTypes.CHAR},
    idArea: {type: DataTypes.INTEGER},
    idPuesto: {type: DataTypes.INTEGER},
    idJefe: {type: DataTypes.INTEGER},
    codigoJefe: {type: DataTypes.STRING},
    estadoEmp: {type: DataTypes.BOOLEAN},
},{
    timestamps: false
})

//Salida Herramientas
export const ModelSalidaHerramientas = db.define('salida_herramientas',{
    idSalHer: {type: DataTypes.INTEGER,primaryKey:true},
    idHerramienta: {type: DataTypes.INTEGER},
    idObra: {type: DataTypes.INTEGER},
    idRecibe: {type: DataTypes.INTEGER},
    idEntrega: {type: DataTypes.INTEGER},
    horaSalHer: {type: DataTypes.TIME},
    fechaSalHer: {type: DataTypes.DATE},
    estadoSal: {type: DataTypes.STRING},
},{
    timestamps: false
})

//Entrada Herramientas
export const ModelEntradaHerramientas = db.define('entrada_herramientas',{
    idEntHer: {type: DataTypes.INTEGER,primaryKey:true},
    idHerramienta: {type: DataTypes.INTEGER},
    idObra: {type: DataTypes.INTEGER},
    idEntrega: {type: DataTypes.INTEGER},
    idRecibe: {type: DataTypes.INTEGER},
    horaEntHer: {type: DataTypes.TIME},
    fechaEntHer: {type: DataTypes.DATE},
},{
    timestamps: false
})

//Entradas
export const Entrada = db.define('entrada_materiales',{
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

//Bodegas
export const Bodegas = db.define('bodegas_materiales',{
    idBodega:{type:DataTypes.INTEGER,primaryKey:true},
    nombreBod:{type: DataTypes.STRING},
    direccionBod:{type: DataTypes.STRING},
    estadoBod:{type: DataTypes.BOOLEAN}
},{
    timestamps:false
}
)

//Categoria materiales

export const CategoriaModel = db.define('categoria_materiales',{
    idCatMat:{type:DataTypes.INTEGER,primaryKey:true},
    nombreCatMat:{type: DataTypes.STRING},
    estadoCatMat:{type:DataTypes.BOOLEAN},
    imagenCatMat:{type: DataTypes.STRING}
},{
    timestamps:false
}
)

//materiales
export const Materiales = db.define('materiales',{
    idMaterial:{type:DataTypes.INTEGER,primaryKey:true},
    codigoMat:{type: DataTypes.STRING},
    nombreMat:{type: DataTypes.STRING},
    estadoMat:{type:DataTypes.BOOLEAN},
    stockMat:{type: DataTypes.STRING},
    idCatMat:{type:DataTypes.INTEGER},
    idUnidad:{type:DataTypes.INTEGER}
},{
    timestamps:false
}
)

//Unidades
export const Unidades = db.define('unidades_materiales',{
    idUnidad:{type:DataTypes.INTEGER,primaryKey:true},
    nombreUnidad:{type: DataTypes.STRING},
    estadoUnidad:{type: DataTypes.BOOLEAN}
},{
    timestamps:false
}
)

//salidas
export const Salidas = db.define('salida_materiales',{
    idSalMat:{type:DataTypes.INTEGER,primaryKey:true},
    cantSalMat:{type: DataTypes.INTEGER},
    fechaSalMat:{type: DataTypes.DATE},
    flete:{type: DataTypes.BOOLEAN},
    idMaterial:{type: DataTypes.INTEGER},
    idObra:{type: DataTypes.INTEGER}
},{
    timestamps:false
}
)

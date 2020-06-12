
//=======================
// PUERTO
//=======================

process.env.PORT = process.env.PORT || 3000;

//=======================
// ENTORNO
//=======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=======================
// BASE DE DATOS
//=======================

let urlDB;

const nube ="mongodb+srv://MiloMadden:cebollitasi77@cluster0-2ntwx.mongodb.net/megumi?retryWrites=true&w=majority";

const local = 'mongodb://localhost:27017/megumi';

if(process.env.NODE_ENV === 'dev'){
    urlDB = local;
}else{
    urlDB = nube;
}

process.env.urlDB = urlDB;

//=======================
// SEED
//=======================

process.env.SEED_DESARROLLO = process.env.SEED_DESARROLLO || 'mr-peanutbutter';

//=======================
// VENCIMIENTO DEL TOKEN
//=======================

process.env.VENCIMIENTO_TOKEN = 60 * 60 * 24 * 30;


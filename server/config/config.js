
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

const nube = process.env.MONGO_URI;

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

process.env.VENCIMIENTO_TOKEN = '48h';

//=======================
// GOOGLE CLIENT
//=======================

process.env.CLIENT_ID = process.env.CLIENT_ID || process.env.GOOGLE_CLIENT;


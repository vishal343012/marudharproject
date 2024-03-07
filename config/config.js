const prodconfig = {
  AWS_ACCESS_KEY: "AKIAVEKAZSYBDZ4EJQOB",
  AWS_SECRET_ACCESS_KEY: "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",
  Bucket: "document.transport.app",
  Acl: "public-read",
  ChunkSize: 100 * 1024 * 1024,
  region: "ap-south-1",
};

const betaconfig = {
  AWS_ACCESS_KEY: "AKIAW7AWAGAZAUO3PAXW",
  AWS_SECRET_ACCESS_KEY: "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",
  Bucket: "document.transport.app",
  Acl: "public-read",
  ChunkSize: 100 * 1024 * 1024,
  region: "ap-south-1",
};

const devconfig = {
  AWS_ACCESS_KEY: "AKIAVEKAZSYBDZ4EJQOB",
  AWS_SECRET_ACCESS_KEY: "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",
  Bucket: "document.transport.app",
  Acl: "public-read",
  ChunkSize: 100 * 1024 * 1024,
  region: "ap-south-1",
};
// const prodmongoconfig = {
//   mongoURI:
//   // "mongodb+srv://tanusree:tanusree@cluster0.rdfei.mongodb.net/test"
//   "mongodb://production:Ef94StxHZsLjT1m6@marudharapp-shard-00-00.x9ypj.mongodb.net:27017,marudharapp-shard-00-01.x9ypj.mongodb.net:27017,marudharapp-shard-00-02.x9ypj.mongodb.net:27017/db_marudhar_live?ssl=true&replicaSet=atlas-o1duxv-shard-0&authSource=admin&retryWrites=true&w=majority"
//   ,
// };   
const prodmongoconfig = {
  mongoURI:
  
  // "mongodb://grouponventurepvtltd:0wuOeu3mYUmNVYhz@ac-53gwkrl-shard-00-00.jzsn0sx.mongodb.net:27017,ac-53gwkrl-shard-00-01.jzsn0sx.mongodb.net:27017,ac-53gwkrl-shard-00-02.jzsn0sx.mongodb.net:27017/db_transport_live?replicaSet=atlas-m8v11u-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority"
  "mongodb://transport:transport@ac-99jce5u-shard-00-00.s4dtbwn.mongodb.net:27017,ac-99jce5u-shard-00-01.s4dtbwn.mongodb.net:27017,ac-99jce5u-shard-00-02.s4dtbwn.mongodb.net:27017/db_transport_live?ssl=true&replicaSet=atlas-v72dah-shard-0&authSource=admin&retryWrites=true&w=majority"
    // "mongodb://softechuser:<insertYourPassword>@softech-erp.cnvewkmeaes1.ap-south-1.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&retryWrites=false"
};

// const betamongoconfig = {
//   mongoURI:
//     "mongodb+srv://marudhar:Nyszzf4eErxNkOOc@learning.gdytw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
// };

const devmongoconfig = {
  mongoURI:
    "mongodb://127.0.0.1:27017/db_transport_live_20_02?readPreference=primary&directConnection=true&ssl=false",
  //
};


const PORT = process.env.PORT || 3000;
const BetaPort = 3010;

const smtp_config = {
  port: 587,
  host: "",
  secure: false,
  auth: {
    user: "",
    pass: "",
  },
  from: "Notification <email@domain.com>",
};

const devAPI_URL = "http://localhost:3000/";
// const betaAPI_URL = "https://api.marudhar.app/betaAPI/";
// const prodAPI_URL = "http://15.206.180.46:3000/";
const prodAPI_URL = "https://api.gstspl.com/";


let config = {};
let mongo_config = {};
let apiURL = "";
let port = PORT;


let dirName = __dirname.split("/");
const serverDIR = dirName[dirName.length - 2];
let betaFlag = false
if (serverDIR === "node_dev") {
  process.env.NODE_ENV = "production"
}


if (process.env.NODE_ENV === "production") {
  config = prodconfig;
  mongo_config = prodmongoconfig;
  apiURL = prodAPI_URL;
  port = PORT;
} 
// else if (process.env.NODE_ENV === "production" && betaFlag === true) {
//   config = betaconfig;
//   mongo_config = betamongoconfig;
//   apiURL = betaAPI_URL;
//   port = BetaPort;
// } 
else {
  config = devconfig; //devconfig; //; prodconfig//;
  mongo_config = devmongoconfig; //prodmongoconfig; //devmongoconfig
  apiURL = devAPI_URL;
  port = PORT;
}

// console.log(process.env.NODE_ENV)
// console.log(mongo_config)
// console.log("Connected as: ", (betaFlag === false ? process.env.NODE_ENV : "Beta"));
console.log(mongo_config);
const CurrencyAPI = "https://APIURL";

module.exports = { config, mongo_config, smtp_config, CurrencyAPI, apiURL, port };

import mongoose from "mongoose";

const uri =
  "mongodb://matheusramos:optensolutionspassword@ac-tro3idu-shard-00-00.2jhjsha.mongodb.net:27017,ac-tro3idu-shard-00-01.2jhjsha.mongodb.net:27017,ac-tro3idu-shard-00-02.2jhjsha.mongodb.net:27017/?ssl=true&replicaSet=atlas-d5u8ve-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("Conectado!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
const mongoose = require('mongoose');

const  bdConn = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true
            ,useUnifiedTopology: true
            //,useCreateIndex: true
            //,useFindAndModify: false
        });

        console.log('YOX Conectado a Base de datos');

    } catch (error) {
        console.log(error);
        throw new Error('Error al acceder a la base de datos');
    }

};


module.exports = {bdConn};

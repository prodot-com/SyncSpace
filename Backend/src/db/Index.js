import mongoose from "mongoose";
import 'dotenv/config'


const connect_db = async ()=>{
    try {
        const connection =  await mongoose.connect(`${process.env.MONGO_URL}${process.env.DB_NAME}`)
        console.log('MongoDb Connected', connection.connection.host)
    } catch (error) {
        console.log("Can't connect mongoDb Server", error)
    }
}

export default connect_db
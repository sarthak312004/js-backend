import 'dotenv/config'
import connectDB from './db/index.js'
import { app } from './app.js';

connectDB()
.then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`Listinign to ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO DB Connection Error: ",err);
})











// ;(async()=>{
//     try {
//        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
//        console.log(connectionInstance);
//        app.listen(process.env.PORT, ()=>{
//         console.log(`Listing to ${process.env.PORT}`);
//        })
//     } catch (error) {
//         console.log("ERROR",error);
//     }
// })()
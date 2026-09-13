const asynHandler = (requestHandler) =>{
    (req, res, next)=> {
       Promise.resolve(requestHandler(req, res, next)).
       catch((err)=> next(err))
    }
}



export { asynHandler }

// const asynHandler = (fn) => async(req, res, next)=> {
//     try {
//         await fn(req)
//     } catch (error) {
//         res.statu(error.code || 500).json({
//             success: false,
//             message:error.message
//         })
//     }

// }
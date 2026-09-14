// Takes a function (usually an async Express controller) as an argument
const asynHandler = (requestHandler) => {

    // Returns a new function that Express will execute
    // Express automatically provides req, res, and next when it calls this function
    return (req, res, next) => {

        // Execute the original requestHandler with req, res, next
        // Promise.resolve() makes sure the returned value is handled as a Promise
        Promise.resolve(requestHandler(req, res, next))

            // If the Promise fails/rejects, pass the error to Express using next()
            .catch((err) => next(err));
    }
}

export { asynHandler }

// const asynHandler = (requestHandler) => async(req, res, next) => {
//     try {
//         await requestHandler(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//         success: false,
//         message: error.message,
//         });
//     }
// }
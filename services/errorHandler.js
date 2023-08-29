const errorHandler = (err, req, res, next) => {
    const status = err.status || 500
    const message = err.message || "something went worng"

    res.status(status).send({ message, stack: err.stack })
}

module.exports =errorHandler
const asyncHandeller = (requestHandeller) => {
    return(req, res, next) => {
        Promise.resolve(requestHandeller(req, res, next)).catch(err => next(err));
    }
}


export {asyncHandeller}
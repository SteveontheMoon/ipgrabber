const methods = (methods = ['GET']) => (req, res, next) => {
    if (methods.includes(req.method)) return next();
    res.error(405);
  };
  
module.exports = {
    methods: methods,
}
const Scheme = require("./scheme-model")

const checkSchemeId = async(req, res, next) => {
  const {scheme_id} = req.params
  try{
    const id = await Scheme.findById(scheme_id)
    if(!id){
      res.status(404).json({message: `scheme with scheme_id ${scheme_id} not found`})
    } else {
      req.scheme_id = id
      next()
    }
  }
  catch(err){
    next(err)
  }
}

const validateScheme = (req, res, next) => {
if(!req.body.scheme_name || req.body.scheme_name === "" || typeof req.body.scheme_name !== "string"){
  res.status(400).json({message: "invalid scheme_name"})
} else {
  next()
}
}

const validateStep = (req, res, next) => {
  if(!req.body.instructions || req.body.instructions === "" || typeof req.body.instructions !== "string" || req.body.step_number < 1 || typeof req.body.step_number !== "number"){
    res.status(400).json({message: "invalid step"})
  } else {
    next()
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}

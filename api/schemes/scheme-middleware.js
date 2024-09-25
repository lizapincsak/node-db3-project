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
  const{scheme_name} = req.body
if(scheme_name === undefined || 
  typeof scheme_name !== "string" ||
  !scheme_name.trim()){
  res.status(400).json({message: "invalid scheme_name"})
} else {
  next()
}
}

const validateStep = (req, res, next) => {
  const {instructions, step_number} = req.body
  if(
    instructions === undefined || 
    typeof instructions !== "string" || 
    !instructions.trim() || 
    step_number < 1 || 
    typeof step_number !== "number"
    ){
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

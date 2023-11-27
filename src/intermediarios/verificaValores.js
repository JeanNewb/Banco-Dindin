const verificaValores = (joinSchema) => async (req, res, next) => {

  try {
    await joinSchema.validateAsync(req.body)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: error.message });
  }
  next()
};
module.exports = verificaValores;

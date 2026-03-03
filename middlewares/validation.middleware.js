const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      errors: error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }
};

module.exports = validate;
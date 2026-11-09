const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('API Error:', err);

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    return res.status(404).json({
      success: false,
      message,
    });
  }

  // Mongoose duplicate key (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Please use a different value.`;
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authorization token has expired. Please log in again.',
    });
  }

  // Fallback server error
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error. An unexpected error occurred.',
  });
};

module.exports = errorHandler;

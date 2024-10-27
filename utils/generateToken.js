const jwt = require('jsonwebtoken');

const generateToken = (userData) => {
  return new Promise((resolve, reject) => {
    const payload = userData;

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: '2h',
      },
      (err, token) => {
        if (err) {
          console.log('error generating token');
          reject(err);
        }
        resolve(token);
      }
    );
  });
};
module.exports = {
  generateToken,
};

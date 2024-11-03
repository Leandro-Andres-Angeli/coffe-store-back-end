const passport = require('passport');
const LocalStrategy = require('passport-local');
exports.handleLogin = passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    try {
      const users = await connectToCollection('users');
      const user = await users.findOne({
        email: username,
      });
      if (err) {
        console.log('in error');

        return cb(err);
      }
      console.log(user);
    } catch (error) {
      console.log('in catch');

      return error;
    }
  })
);

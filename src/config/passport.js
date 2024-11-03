const passport = require('passport');
const LocalStrategy = require('passport-local');
exports.handleLogin = new LocalStrategy(function (
  username = 'user@gmail.com',
  password,
  cb
) {
  const users = connectToCollection('users');
  const user = users.findOne({
    email: username,
  });
  if (err) {
    console.log('in error');

    return cb(err);
  }

  console.log(user);
  return user;
});

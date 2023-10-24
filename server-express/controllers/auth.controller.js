exports.signUpUser = (req, res) => {
  console.log("Sign Up");
  res.end("Sign Up");
};
exports.signInUser = (req, res) => {
  console.log("signIn");
  res.end("Sign In");
};
exports.checkAuth = (req, res) => {
  console.log("authCheck");
};

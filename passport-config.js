const localStratergy = require('passport-local').Stratergy;
const bcrypt = require('bcrypt');
const passport = require('passport');


function initialisePass(passport, getUserByEMail, getUserByID){
const authenticateUser = async(email, password, done) =>{
const user=getUserByEMail(email);
if(user == null) {
    return done(null, false, {message: 'no user with that email'} );
}

try{
    if(await bcrypt.compare(password, user.password)) {
return done(null, user);
    }
else { 
    return done(null, false, {message: 'incorrect password'});
    }
    }
catch(e){
return done(e);
}
}
passport.use(new localStratergy({
    usernameField: 'email'
}), authenticateUser);
passport.serializeUser((user, done) =>done(null, user.id) );
passport.deserializeUser((id, done) =>{ 
    return done(null, getUserByID(id));
})

}


module.exports = initialisePass;
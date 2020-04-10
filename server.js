
if(process.env.NODE_ENV !== 'production'){
require ('dotenv').config();
}


const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const users = [];
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');


const initialisePassport = require('./passport-config');
initialisePassport(passport, 
(email) => users.find(user => user.email === email)   
 );


app.set('view-engine', ejs);
app.use(express.urlencoded({ extended:false }));
app.use(methodOverride(_method));

app.get('/',checkAUthenticated, (req, res)=>{
res.render("index.ejs", {user: req.user.name});
});
app.use(flash());
app.use(session({

secret: process.env.SESSION_SECRET,
resave: false,
saveUninitialized: false
}));

app.use(passport, initialize());
app.use(passport.session());


app.get('/login',checkNotAUthenticated, (req, res)=>{
res.render('login.ejs');
});


app.post('/login',checkNotAUthenticated, passport.authenticate({
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAUthenticated, (req, res)=>{
res.render('register.ejs');

});


app.get('/register', checkNotAUthenticated,  async(req, res)=>{
const hashedPassword = await bcrypt.hash(req.body.hashedPassword, 10);
try{ 
    users.push({
    id: Date.now().toString,
    name: req.params.name,
    email: req.params.email,
    password: hashedPassword
})
res.redirect('/login');
}
catch {
    res.redirect('/register');
}
});

app.delete((req, res)=> {
    req.logOut();
    res.redirect('/');
});

function checkAUthenticated(req, res, next){
    if(req.authenticated()) {
    return next();
    }
    res.redirect('/');
}

function checkNotAUthenticated(req, res, next) {
   if(req.uthenticated()) {
   return res.redirect('/');
   } next();
}

//browser port 
app.listen(3000);
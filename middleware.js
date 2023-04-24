import express from 'express';
const app = express();
import session from 'express-session';


app.use(express.json());
app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: false
  }))


app.use('/login', (req,res,next) => {
    if (req.session.user){
        switch (req.session.user.role){
            case "admin":
                return res.redirect('/admin');
                break;
            case "user":
                return res.redirect('/protected');
                break;
            default:
                next()
        }
    }
    else next()
})
app.use('/register', (req,res,next) => {
    if (req.session.user){
        switch (req.session.user.role){
            case "admin":
                return res.redirect('/admin');
                break;
            case "user":
                return res.redirect('/protected');
                break;
            default:
                next()
        }
    }else{
        next();
    }
})
app.use('/protected', (req,res,next) =>{
    if (!req.session.user){
        return res.redirect('/login');
    }
    next();
})
app.use('/admin', (req,res,next) =>{
    if (!req.session.user){
        return res.redirect('/login')
    }
    if (req.session.user.role === 'user') return res.status(403).redirect('/error')
    next()
})
app.use('/logout', (req,res,next) =>{
    if (!req.session.user) return res.redirect('login')
    next()
})
app.use(async (req,res,next) =>{
    const now = new Date().toUTCString()
    const method = req.method;
    const route = req.originalUrl;
    const authen = req.session.user ? "(Authenticated User)" : '(Non-Authenticated User)'
    console.log(`[${now}]: ${method} ${route} ${authen}`)
    next()
})
app.get('/', (req,res,next) =>{
    if (!req.session.user){
        res.redirect('/login');
    }else {
        switch (req.session.user.role){
            case "admin":
                return res.redirect('/admin');
                break;
            case "user":
                return res.redirect('/protected');
                break;
            default:
                return res.redirect('/login');
            
        }
        next();
    }

})
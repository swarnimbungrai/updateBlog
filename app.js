const express= require ('express') //importing express module(framework)
const app = express();

const ejs = require ("ejs");
app.set("view engine", "ejs") 
    
const {sequelize, blogTB} = require ('./model')

const bcrypt = require("bcrypt");
const { registerBlog, loginBlog, forgotPassword, otpConfirm, blogAdd } = require('./controller/authController');

//multer, package junle image/file upload grnu dinxa
const { multer, storage } = require("././service/multerConfig");
const upload = multer({ storage: storage });


//shows data in terminal which were filled in form
app.use(express.json())
app.use(express.urlencoded ({extended:true}))

app.get('/home',(req, res) => {
    res.render('home')
});

app.get('/register',(req, res) => { //hernulai UI
   
    res.render('register.ejs');
 });
 app.post('/register', registerBlog); //database ma halnu action ma post
 

 app.get('/login',(req, res) => {
   
    res.render('login.ejs');
 });
 app.post('/login', loginBlog);

 app.get('/footer',(req, res) => {
   
    res.render('footer');
 });

 app.get('/forgotPsw',(req, res) => {
   
    res.render('forgotPsw');
 });

 app.post('/forgotPsw', forgotPassword)

 app.get('/confirm',(req, res) => {
   res.render('confirmCode');
});
app.post('/confirm',otpConfirm)

app.get('/blog',(req,res) => {
   res.render('blog.ejs')
})
                 //middleware of multer
app.post('/blog', upload.single('image'), blogAdd)


app.listen(4000,()=>{
    console.log("server started at ports 4000")
}); 

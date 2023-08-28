const express= require ('express') //importing express module(framework)
const app = express();

const ejs = require ("ejs");
app.set("view engine", "ejs") 
    
const {sequelize, blogTB, blog, users} = require ('./model')

const bcrypt = require("bcrypt");
const { registerBlog, loginBlog, forgotPassword, otpConfirm, blogAdd, blogS, blogAll, single, deleteBlog, editBlog, updateBlog, myBlog } = require('./controller/authController');

//multer, package junle image/file upload grnu dinxa
const { multer, storage } = require("././service/multerConfig");
const { isAuthenticated } = require('./services/isAuthenticated');
const upload = multer({ storage: storage });


//shows data in terminal which were filled in form
app.use(express.json())
app.use(express.urlencoded ({extended:true}))
app.use(require("cookie-parser")());

app.use(express.static("uploads")); //database ko null ko thauma image ko link show grxa

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
app.post('/blog',isAuthenticated, upload.single('image'), blogAdd)
// app.post('/blog', upload.single('image'), blogAdd)


app.get('/allBlog', blogAll);


app.get('/singleBlog/:id', single);

app.get('/delete/:id', deleteBlog);

app.get('/edit/:id', editBlog);

app.post('/edit/:id', upload.single('image'), updateBlog);

app.get('/myBlogs',isAuthenticated, myBlog);

app.get('/logout',(req,res) => {
   res.clearCookie()
   res.redirect('/login')
})


app.listen(4000,()=>{
    console.log("server started at ports 4000")
}); 

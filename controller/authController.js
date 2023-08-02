const { users , blog} = require("../model");
const bcrypt = require("bcrypt");
const sendEmail = require("../services/sendEmail");
const userModel = require("../model/userModel");

exports.registerBlog = async (req, res) => {
    const { userName, userEmail, userPassword } = req.body;
    const emailExist = await users.findAll({
        where: {
            userEmail: userEmail,
        }
    });
    console.log(emailExist)
    if (emailExist.length !== 0){
        res.render('error2.ejs');
       
    } else{
    await users.create({
        userName,
        userEmail,
        userPassword: bcrypt.hashSync(userPassword, 10) //day4 hashing psw
    });

    console.log(userName, userEmail, userPassword)
    //register vayesi without loading login page ma gako
    res.redirect('/login')
}}

exports.loginBlog = async (req, res) => {
    const jwt = require("jsonwebtoken");
    const { userEmail, userPassword } = req.body
    const blogExist = await users.findAll({ //checking data if it is available or not in DB
        where: {
            userEmail: userEmail,
            //password : bcrypt.hashSync(password,10)
        }
    });

    if (blogExist.length == 0) {
        res.render('error.ejs')
    } else {
        const isPasswordCorrect = await bcrypt.compare(userPassword, blogExist[0].userPassword)
        if (isPasswordCorrect) {
           const token = jwt.sign({id:blogExist[0].id},"hello") //jwt payload, jwt encryption
           res.cookie ('toke', token)
            console.log(token)
            res.redirect('/blog')
        }
        else {
            res.redirect('/login')
        }
    }
    console.log(blogExist)
}

exports.forgotPassword = async (req, res) => {
    const { userEmail } = req.body
    const otp = Math.floor(Math.random() * 9000) + 1000;

    const userexit = await users.findAll({ //checking data if it is available or not in DB
        where: {
            userEmail: userEmail,
            //password : bcrypt.hashSync(password,10)
        }
    });
    if(userexit.length == 0){
       res.render('error');
    }else{
        userexit[0].otp = otp
        await userexit[0].save()
        await sendEmail({
            email: userEmail,
            subject: 'forgotPassword',
            otp: otp
        })
        console.log('User ');

        res.render('confirmCode')
    }
} 

exports.otpConfirm = async (req, res) => {
    const { otp, userPassword } = req.body;
    const otpExist = await users.findAll({ //checking data if it is available or not in DB
        where: {
            otp: otp,

        }
    });
    if (otpExist.length == 0) {
        res.render('error.ejs')
    } else {
        otpExist[0].userPassword = bcrypt.hashSync(userPassword,8)
        await otpExist[0].save()
        res.redirect('/login')
    }
   
    console.log(otpExist)
}

exports.blogAdd= async (req, res) => {
    const {title,description, image} = req.body
    console.log(req.body)
    await blog.create({
      title:title, 
      description: description,
    image: null,
})
 console.log(title, description, image )
 res.redirect('home')
}


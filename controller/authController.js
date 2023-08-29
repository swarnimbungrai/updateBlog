const { users, blog } = require("../model");
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
    if (emailExist.length !== 0) {
        res.render('error2.ejs');

    } else {
        await users.create({
            userName,
            userEmail,
            userPassword: bcrypt.hashSync(userPassword, 10) //day4 hashing psw
        });

        console.log(userName, userEmail, userPassword)
        //register vayesi without loading login page ma gako
        res.redirect('/login')
    }
}

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
            const token = jwt.sign({ id: blogExist[0].id }, "hello") //jwt payload, jwt encryption, hello is token which is used in isAuthenticated
            res.cookie('toke', token)
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
    if (userexit.length == 0) {
        res.render('error');
    } else {
        userexit[0].otp = otp
        await userexit[0].save()
        await sendEmail({
            email: userEmail,
            subject: 'forgotPassword',
            otp: otp
        })
        console.log('User ');

        res.redirect('/confirm')
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
        otpExist[0].userPassword = bcrypt.hashSync(userPassword, 8)
        await otpExist[0].save()
        res.redirect('/blog')
    }

    console.log(otpExist)
}

exports.blogAdd = async (req, res) => {
    const { title, description, image } = req.body
    console.log(req.body)
    await blog.create({
        title: title,
        description: description,
        image: "http://localhost:4000/" + req.file.filename, //database ma image haleko ani link copy grexi browserma image dekhauxa
        userId: req.userId,
    })
    console.log(title, description, image)
    res.redirect('/allBlog')
}

exports.blogAll = async (req, res) => {
    const blogss = await blog.findAll({
        include: users //user table ko name ko value UIU ma dekhaunu
    })
    res.render('allBlog', { blogss });
}

exports.single = async (req, res) => {
    const blogS = await blog.findAll(
        {
            where: {
                id: req.params.id
            }, include: users
        },
    );
    console.log(blogS)
    res.render('singleBlog', { blogS });
}

exports.deleteBlog = async (req, res) => {
    const del = await blog.destroy({
        where: {
            id: req.params.id
        }
    });
    console.log(del)
    res.redirect('/allBlog')
}

exports.editBlog = async (req, res) => {

    const edit1 = await blog.findAll({
        where: {
            id: req.params.id
        }
    });
    console.log(edit1)
    res.render('edit', { edit1 })
}

exports.updateBlog = async (req, res) => {
    let file;
    const blogs = await blog.findAll({
        where: {
            id: req.params.id
        }
    })
    if (req.file) {
        file = "http://localhost:4000/" + req.file.filename //current image halyo vane
    } else {
        file = blogs[0].image //if new image ayenaa vane poilikai hunxa
    }
    const update1 = await blog.update({
        title: req.body.title,
        description: req.body.description,
        image: file,
    }, {
        where: {
            id: req.params.id
        }
    })
    res.redirect('/singleBlog/' + req.params.id)
}

exports.myBlog = async (req, res) => {
    
    console.log(req.headers.origin)
    const blogss = await blog.findAll({
        where: {
            userId: req.userId
        },
        include: users //user table ko name ko value UIU ma dekhaunu
    })
    res.render('myBlogs', { blogss });
}

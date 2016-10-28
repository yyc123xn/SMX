var express = require('express');
var api = require('../api/userDBApi');
var utils = require('../utils/utils');
var router = express.Router();
var pages = require('./pages');
/*登录页面，返回html*/
router.get('/login.ejs', function (req, res) {
    res.sendFile(pages.login());
})

/*注册页面，返回html*/
router.get('/register.html', function (req, res) {
    res.sendFile(pages.register());
})

/*完善信息页面，返回html*/
router.get('/finishInfo.html',function (req,res) {
    res.sendFile(pages.finishInfo())
})
/*登录
* GET phoneNumber,password
*/

router.post('/login', function (req, res) {
    var phoneNumber = req.body.phoneNumber;
    var password = req.body.password;
    console.log("login start");
    api.login(phoneNumber, password, function (ret) {
        if(ret.status){
            req.session.userId = ret.userId;
            console.log("put userId:"+ret.userId);
            console.log("target:"+utils.getServer()+req.session.source);
            if(req.session.source == null){
                res.render("question");
                //res.write('<head><meta charset="utf-8"/></head>');
                //res.write(JSON.stringify(ret));
            }else{
                res.redirect(301,utils.getServer()+req.session.source);
            }
        }else{
            res.write('<head><meta charset="utf-8"/></head>');
            res.write(JSON.stringify(ret));
        }
    });
})
/*注册
 * GET phoneNumber,password
 */
router.get('/register', function (req, res) {
    var phoneNumber = req.query.phoneNumber;
    var password = req.query.password;
    api.register(phoneNumber, password, function (ret) {
        if(ret.status){
            req.session.userId = ret.userId;
            console.log("put userId:"+req.session.userId);
            res.sendFile(pages.finishInfo())
        }else{
            res.write('<head><meta charset="utf-8"/></head>');
            res.write(JSON.stringify(ret));
        }
    });

})
/*获得个人信息
 * GET
 */
router.get('/getMineInfo', function (req, res) {
    //var userId = req.session.userId;
    var userId = 1;
    console.log("userId:"+userId)
    if (userId == null) {
        console.log("route login")
        req.session.source = "users/getMineInfo";
        res.sendFile(pages.login());
    } else {
        api.getMineInfo(userId, function (ret) {
            var name = ret[0].name;
            console.log("name:"+name);
            if(name == null){
                req.session.source = "users/getMineInfo";
                res.sendFile(pages.finishInfo());
            }else{
                console.log("adfdsfsadfdsafdsfa")
                //res.write('<head><meta charset="utf-8"/></head>');
                //res.write(JSON.stringify(ret[0]));
                res.render("Person",ret[0]);
                console.log("0000000")

            }
        })
    }
})
/*完善个人信息
 * GET name,gender,age
 */
router.get('/finishInfo',function(req,res){
    var userId = req.session.userId;
    console.log("get userId:"+req.session.userId);
    var name = req.query.name;
    var gender = req.query.gender;
    var age = req.query.age;
    api.finishInfo(userId,name,gender,age,function(){
        res.redirect(301,utils.getServer()+req.session.source);
    })

})
module.exports = router;
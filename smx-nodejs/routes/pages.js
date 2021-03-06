var path = require('path');

var dir = path.resolve(__dirname,'..')+"/views/users/";
var now = path.resolve(__dirname,'..')+"/";

exports.login = function(){
    return dir+"login.html";
}

exports.register = function(){
    return dir+"register.html";
}

exports.mine = function(){
    return dir+"mine.html";
}

exports.finishInfo = function(){
    return dir+"finishInfo.html";
}

exports.addCourse = function(){
    return dir+"addCourse.html";
}

exports.search = function(){
    return dir+"search.html"
}

exports.getCourse = function(){
    return dir+"course.html"
}


exports.addQuestion = function() {
    return dir + "addQuestion.html";
}

exports.searchQuestion = function() {
    return dir + "searchQuestion.html";
}

exports.addAnswer = function() {
    return dir + "addAnswer.html";
}

exports.searchAnswer = function() {
    return dir + "searchAnswer.html";
}

exports.addVideo = function() {
    return dir + "addVideo.html";
}

exports.searchVideo = function() {
    return dir + "searchVideo.html";
}

exports.getMineInfo = function () {
    return dir + "person.html";
}

exports.getWXverify = function(){
	return now+ "MP_verify_sEUETJmOEogP71d6.txt";
}

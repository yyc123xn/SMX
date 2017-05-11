var mysql = require('mysql');
var moment = require('moment');
var conn = mysql.createConnection({
    host: '5835638b397af.gz.cdb.myqcloud.com',
    // host:'localhost',
    user: 'root',
    // password: 'root',
    password:'smxsjk123456',
    database: 'smx',
    port: 12409
    // port:3306
})
conn.connect();

exports.getConn = function(){
    return conn;
}

/*mysql一段时间没有请求连接会断开*/
setInterval(function () {
    conn.query('SELECT 1');
}, 5000);

exports.getCourse = function(date,callback){
    var sql = "SELECT c.courseId, " +
        "a.userName as teacherName, " +
        "c.courseName, " +
        "c.courseDate, " +
        "c.beginTime, " +
        "c.objectOriented, " +
        "c.courseContent, " +
        "COUNT(s.userId)+'人' as courseCount " +
        "FROM course c LEFT JOIN account a ON a.userId = c.userId LEFT JOIN joinCourse s on c.courseId = s.courseId " +
        "WHERE c.courseDate >= '" +date+"' " +
        " GROUP BY c.courseId " +
        "ORDER BY c.courseDate,c.beginTime";

    conn.query(sql,function (err,rows) {
        console.log("sql:"+sql);
        if(err){
            console.log(err);
            return;
        }else{
            callback(rows);
        }
    })
};

exports.getHistoryCourse = function (date,callback) {
    var sql = "SELECT c.courseId, " +
        "a.userName as teacherName, " +
        "c.courseName, " +
        "c.courseDate, " +
        "c.beginTime, " +
        "c.objectOriented, " +
        "c.courseContent, " +
        "COUNT(s.userId)+'人' as courseCount " +
        "FROM course c LEFT JOIN account a ON a.userId = c.userId LEFT JOIN joinCourse s on c.courseId = s.courseId " +
        "WHERE c.courseDate < '" +date+"' " +
        "GROUP BY c.courseId " +
        "ORDER BY c.courseDate desc,c.beginTime desc";

    conn.query(sql,function (err,rows) {
        console.log("sql:"+sql);
        if(err){
            console.log(err);
            return;
        }else{
            callback(rows);
        }
    })
}
exports.getCourseDetails=function (courseId,callback) {
    var sql = "SELECT c.courseId, " +
        "a.userName as teacherName, " +
        "a.userId as teacherId, " +
        "c.courseName, " +
        "c.courseDate, " +
        "c.beginTime, " +
        "c.objectOriented, " +
        "c.courseContent, " +
        "c.finishTime,"+
        "c.courseTime,"+
        "COUNT(s.userId) as courseCount " +
        "FROM course c JOIN account a ON a.userId = c.userId JOIN joinCourse s on c.courseId = s.courseId "+
        "WHERE c.courseId ="+courseId;
    console.log("sql:"+sql);
    console.log("courseId:"+courseId)
    conn.query(sql,function (err,rows) {
        if(err){
            console.log(err);
            return false;
        }else{
            callback(rows[0]);
        }
    })
}
exports.getCourseStudentList = function (courseId,callback) {
    var sql = "SELECT a.userName, " +
        "a.userId " +
        /*",j.attend, " +
        "j.cost, " +
        "j.reason, " +
        "j.studentEval, " +
        "j.studentEvalDesc, " +
        "j.teacherEval, " +
        "j.teacherEvalDesc " +*/
        "FROM account a JOIN joinCourse j on a.userId = j.userId " +
        "WHERE j.courseId = "+courseId;
    console.log("sql:"+sql);
    conn.query(sql,function (err, rows) {
        if(err){
            console.log(err)
        }else{
            callback(rows)
        }
    })


}

exports.courseDetailsEdit = function (courseId,courseName,courseDate,beginTime,finishTime,courseTime,objectOriented,courseContent, callback) {
    var sql ="UPDATE course set courseName='"+courseName+"',courseDate='"+courseDate+"',beginTime='"+beginTime+"',finishTime='"+finishTime+"',courseTime='"+courseTime+"',objectOriented='"+objectOriented+"',courseContent='"+courseContent+"' "+
        "WHERE courseId="+courseId+"";
    console.log("sql:"+sql)
    conn.query(sql, function (err,rows) {
        if (err) {
            console.log(err);
            callback({
                status:false,
                desc:err
            })
        }else {
            callback({
                status:true,
                desc:"课程修改成功"
            });
        }
    })
}

exports.getSelfStudyByDate = function(callback){
    var sql = "select date,count(userId) as count, sum(cost) as income from selfStudy group by date order by date desc";
    conn.query(sql,function (err,rows) {
        if(err){
            console.log(err)
        }else{
            callback(rows)
        }
    })
}

exports.getSelfStudyDetails = function (date,callback) {
    var sql = "select a.userId,a.userName,s.cost from selfStudy s join account a on s.userId = a.userId where cast(date as date) = '"+date+"'";
    console.log("sql:"+sql)
    conn.query(sql,function (err,rows) {
        if(err){
            console.log(err)
        }else{
            callback(rows);
        }
    })
}

exports.getQuestion = function(callback){
    var aContent =  100;
    var sql = "SELECT d.questionId, " +
        "d.questionTitle," +
        "left(d.questionContent,"+ aContent +") as questionContent, " +
        "a.userName as asker, " +
        "d.questionTime, " +
        "COUNT(f.questionId) as answerNumber " +
        "FROM question d JOIN account a ON a.userId = d.userId JOIN answer f on d.questionId = f.questionId " +
        "GROUP BY f.questionId";

    conn.query(sql,function (err,rows) {
        console.log(sql);
        if(err){
            console.log(err);
            return false;
        }else{
            callback(rows);
        }
    })
};
exports.getQuestionContent = function (questionId,callback) {
    var sql="SELECT d.questionId,"+
            "d.questionTitle,"+
            "d.questionContent,"+
            "d.questionTime "+
            "FROM question d JOIN account a ON a.userId=d.userId "+"WHERE d.questionId ="+questionId;
    conn.query(sql,function (err,rows) {
        if(err){
            console.log(err);
            return false;
        }
        else if(rows== null||rows[0]== null){
            console.log("questionContent empty questionId ="+questionId);
        }
        else{
            callback(rows[0]);
        }
    })
};
exports.getAnswers=function (questionId,callback) {
    var aContent = 100;
    console.log("questionId:"+questionId);
    var sql = "SELECT b.answerId as answerId, " +
        "c.userName as useName, " +
        "b.answerTime as answerTime, " +
        "left(b.answerContent,"+ aContent +") as answerContent " +
        "FROM answer b INNER JOIN account c on b.userId = c.userId " +
        "WHERE b.questionId = "+questionId;
    conn.query(sql,function(err,rows,fields){
        if(err){
            console.log(err);
            return
        }
        callback(rows);
    })
};
exports.addCourse = function (courseName,courseDate,teacherName,beginTime,finishTime,courseTime,objectOriented,courseContent, callback) {
   var sql= "SELECT userId FROM account WHERE userName ='"+teacherName+"'";
    console.log("sql:"+sql);
    conn.query(sql,function (err,rows) {
        if(err){
            callback({
                status:false,
                desc:err
            });
        }else if(rows.length == 0){
            callback({
                status:false,
                desc:"没有该老师"
            });
        }else{
            console.log("rows[0]:"+JSON.stringify(rows[0]));
            var sql = "INSERT INTO course(userId,courseName,courseDate,beginTime,finishTime,courseTime,objectOriented,courseContent) VALUES ("+rows[0].userId+",'"+ courseName + "','" + courseDate + "','" + beginTime + "','" + finishTime + "','" + courseTime + "','" + objectOriented + "','" + courseContent + "')";
            console.log("sql:"+sql)
            conn.query(sql, function (err,rows) {
                if (err) {
                    console.log(err);
                    callback({
                        status:false,
                        desc:err
                    })
                }else {
                    callback({
                        status:true,
                        desc:"课程创建成功"
                    });
                }
            })
        }

    })

}
exports.findAccount = function (phoneNumber, password, callback) {
    // console.log(phoneNumber+password);
    var sql = "SELECT * FROM account WHERE phoneNumber = '"+ phoneNumber + "' and  password = '"+ password+"'";
    conn.query(sql, function (err, rows, fields) {
        // console.log(rows);
        if (err) {
            console.log(err);
            return;
        }
        callback(rows)
    })
    exports.editPassword=function (userId,oldPassword,password,callback) {
        var sql="SELECT * FROM account WHERE userId="+userId+" and password= '"+oldPassword+"'";
        console.log("sql:"+sql);
        conn.query(sql,function (err,rows) {
            if(err){
                console.
                console.log(err);
                return;
            }else if(rows == null || rows[0] == null){
                callback({
                    status:false,
                    desc:"密码错误"
                })
            }else{
                console.log("password:"+password)
                var sql = "UPDATE account set password = '"+password+"' WHERE userId = "+userId;
                conn.query(sql,function (err,rows) {
                    if(err){
                        console.log(err);
                        return;
                    }else{
                        callback({
                            status:true,
                            desc:"修改成功"
                        })
                    }
                })
            }
        })
    }
}
exports.Delete=function (Id,type,desc,callback) {
    var sql="DELETE FROM question WHERE questionId= "+Id;
    conn.query(sql,function (err,rows) {
        if(err){
            console.log(err);
        }
        else{
            var sql="INSERT INTO delete (id,type,desc) VALUES (Id,type,desc)";
            conn.query(sql,function (err,rows) {
                if(err){callback({
                    status:false
                })}
                else{
                    callback({
                        status:true
                    })
                }
            })
        }
    })
}
exports.register=function (userName,phoneNumber,callback) {
    console.log("userName2:"+userName);
    var date=new Date();
    var role=0;
    console.log("date:"+date);
    var sql="INSERT INTO account(userName,phoneNumber,role,registerDate) VALUES ('"+userName+"','"+phoneNumber+"','"+role+"',"+conn.escape(date)+")";
    //var sql = "INSERT INTO account(userName,phoneNumber,registerDate) VALUES ('"+userName+"','"+phoneNumber+"',"+conn.escape(date)+")";
    console.log("111");
    conn.query(sql,function (err,rows) {
        if(err){
            console.log(err);
        }
        else{
            callback({
                status:true
            })
        }
    })
}
exports.registerTeacher=function (userName,phoneNumber,courseName,callback) {
    console.log("userName2:"+userName);
    var date=new Date();
    var role=2;
    console.log("date:"+date);
    var sql="INSERT INTO account(userName,phoneNumber,role,registerDate) VALUES ('"+userName+"','"+phoneNumber+"','"+role+"',"+conn.escape(date)+")";
    //var sql = "INSERT INTO account(userName,phoneNumber,registerDate) VALUES ('"+userName+"','"+phoneNumber+"',"+conn.escape(date)+")";
    console.log("111");
    conn.query(sql,function (err,rows) {
        if(err){
            console.log(err);
        }
        else{
            var userId=rows.insertId;
            var sql="INSERT INTO teacher(teacherId,goodCourse) VALUES('"+userId+"',"+"'"+courseName+"'"+")";
            conn.query(sql,function (err,rows) {
                if(err){
                    console.log(err);
                }
                else{
                    console.log("写入成功");
                }
            })
            callback({
                status:true
            })
        }
    })
}
const express = require('express')
const mysql = require('mysql') // npm install mysql
const path = require('path')
const static = require('serve-static')
const dbconfig = require('./config/dbconfig.json')
//여기까지가 패키지
//database connection pool

const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    debug: false
})

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/public', static(path.join(__dirname, 'public')));

app.post('/findid',(req, res) => {
    console.log("/user/findid called......");
    const paramName = req.body.name;
    const paramAge = req.body.age;

    console.log('/findd 호출됨' + req)

    pool.getConnection((err, conn) => {
        if(err) { //에러 날 시
            conn.release();
            console.log("Mysql getConnection error. aborted");
            res.writeHead('200', {'Content-Type':'text/html; charset=utf8'})
            res.write('<h1>DB서버 연결 실패</h1>')
            res.end()
            return;
        }
        const exec = conn.query(`select * from users where name = ? and age = ?;`,
                    [paramName,paramAge], //나중에 이메일 추가 예정
                    (err,result)=>{
                        conn.release();
                        console.log('실행된 SQL : ' + exec.sql)
                        if(err){
                            console.log('error')
                            console.dir(err);
                            res.writeHead('200', {'Content-Type':'text/html; charset=utf8'})
                            res.write('<h1>오류가 발생하였습니다.</h2>')
                            res.end()
                            return;
                        }
                        if (result.length > 0){
                            console.log('[&s]님의 아이디는 [&s]입니다.', result[0].name, result[0].id);
                            console.log('아이디를 찾았습니다.')
                            res.writeHead('200', {'Content-Type':'text/html; charset=utf8'})
                            res.write('<h2>아이디 찾기</h2>')
                            res.end()
                        }
                        else{
                            console.log('일치하는 아이디가 존재하지 않습니다.');
                            console.log('아이디를 찾지 못하였습니다.')
                            res.writeHead('200', {'Content-Type':'text/html; charset=utf8'})
                            res.write('<h2>아이디 찾기에 실패하였습니다.</h2>')
                            res.end()
                        }
                    }
        )
    })
});

app.post('/findpassword', (req, res) => {
    console.log('비밀번호 찾기')
    const paramId = req.body.id;
    const paramAge = req.body.age;
    const paramName = req.body.name;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConneSSction error. aborted");
            res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
            res.write('<h1>DB서버 연결 실패</h1>')
            res.end()
            return;
        }
        const exec = conn.query(`select * from users where id = ? and age = ? and name = ? ;`,
            [paramId, paramAge, paramName],
            (err, user) => {
                conn.release();
                console.log('실행된 sql query: ' + exec.sql)
                if (err) {
                    console.log("Mysql getConnection error. aborted");
                    console.dir(err);
                    res.write('<h1>SQL 오류</h1>')
                    res.end()
                    return;
                }

                if (user.length > 0) {
                    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
                    res.write('<h1>찾는 비밀번호 : </h1>')
                    res.write(user[0].password)
                    console.log(user[0].password)
                    res.end()
                }
                else {
                    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
                    res.write('<h1>안됨</h1>')
                    res.end()
                }
            })
    })
})

app.post('/search', (req, res) => {
    console.log('노래 검색')
    const paramLyrics = req.body.Lyrics;
    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConneSSction error. aborted");
            res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
            res.write('<h1>DB서버 연결 실패</h1>')
            res.end()
            return;
        }
        const exec = conn.query(`select * from songs where Lyrics like ? ;`,
            ['%' + paramLyrics + '%'],
            (err, song) => {
                conn.release();
                console.log('실행된 sql query: ' + exec.sql)
                if (err) {
                    console.log("Mysql getConnection error. aborted");
                    console.dir(err);
                    res.write('<h1>SQL 오류</h1>')
                    res.end()
                    return;
                }
                if (song.length > 0) {
                    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
                    res.write('<h1>제목 가수 가사 등등 노래의 정보</h1>')
                    console.log(song)
                }
                else {
                    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
                    res.write('<h1>안됨</h1>')
                }
            })
    })

})

app.post('/signin', (req, res) => {

    console.log('signin 호춛됨' + req)

    const paramId = req.body.id;
    const paramPassword = req.body.password;

    console.log('로그인요청' + paramId + ' ' + paramPassword);
    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnection error. aborted");
            res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
            res.write('<h1>DB서버 연결 실패</h1>')
            res.end()
            return;
        }
        const exec = conn.query(`select id, name from users where id = ? and password = md5(?)`,
            [paramId, paramPassword],
            (err, rows) => {
                conn.release();
                console.log('실핸된 sql query: ' + exec.sql)
                if (err) {
                    console.log('SQl 실행시 오류 발생')
                    console.dir(err);
                    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
                    res.write('<h1>SQL 실행 실패</h2>')
                    res.end()
                    return;
                }
                if (rows.length > 0) {
                    console.log('아이디 [%s], 패스워드가 일치하는 사용자 [%s] 찾음', paramId, rows[0].name);
                    console.log('로그인 성공')
                    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
                    res.write('<h2>로그인 성공</h2>')
                    res.end()
                }
                else {
                    console.log('아이디 [%s], 패스워드가 일치 없음', paramId);
                    console.log('로그인 실패')
                    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
                    res.write('<h2>로그인 실패 아이디 비번 확인하세요</h2>')
                    res.end()
                }
            }
        )
    })

})

app.post('/signup', (req, res) => {
    console.log('/signup 호춛됨' + req)

    const paramId = req.body.id;
    const paramName = req.body.name;
    const paramAge = req.body.age;
    const paramPassword = req.body.password;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnection error. aborted");
            res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
            res.write('<h1>DB서버 연결 실패</h1>')
            res.end()
            return;
        }
        console.log("데이터베이스 연결 됐음")
        const exec = conn.query(`insert into users values (?,?,?,md5(?));`,
            [paramId, paramName, paramAge, paramPassword],
            (err, result) => {
                conn.release();
                console.log('실행된 SQL: ' + exec.sql)
                if (err) {
                    console.log('SQl 실행시 오류 발생')
                    console.dir(err);
                    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
                    res.write('<h1>SQL 실행 실패</h2>')
                    res.end()
                    return;
                }
                if (result) {
                    console.dir(result)
                    console.log('Inserted 성공')
                    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
                    res.write('<h2>사용자 추가 성공</h2>')
                    res.end()
                } else {
                    console.dir(result)
                    console.log('Inserted 실패')
                    res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
                    res.write('<h2>사용자 추가 실패</h2>')
                    res.end()
                }
            }
        )
    })

});
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/adduser.html'))
});

app.listen(3000, () => {
    console.log('3000포트 시작')
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session')

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var db_config = require(__dirname+ '/cf.js');
var conn = db_config.init();

db_config.connect(conn);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.set('port',process.env.PORT  || 80 );

let server = app.listen(80, () => console.log('Server is running on port 80...'));

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
global.document =  new JSDOM('/index.html').window.document;

const path = require('path');
const { copyFileSync } = require('fs');
app.set('front', process.env.FRONT || path.join(__dirname, '../프로젝트'));

app.get('/', (req, res) =>
  res.sendFile(path.join(app.get('front'), '/index.html')),
);
app.get('/join.html', (req, res) =>
  res.sendFile(path.join(app.get('front'), '/join.html')),
);
app.post('/signup', function (req, res){
	let body = req.body;
	console.log(body);

	var table = 'cust';
    var sql = `INSERT INTO `+ table + ` VALUES(?,?,?,?,?,NOW(),?,?,1,0)`;
    if ( body.code == 'alsrnvkdlxld') sql = `INSERT INTO `+ table + ` VALUES(?,?,?,?,?,NOW(),?,?,1,1)`;
	var params = [body.id, body.password, body.name, body.email, body.address_num,
		 body.address, body.phone];
    console.log(sql);
    conn.query(sql, params, function(err) {
        if(err) {
			console.log('query is not excuted. insert fail...\n' + err);
			res.redirect("/failcust");
		}
        else {
			res.redirect('/');
		}
	});
})
app.post('/login', function (req,res){
	let body = req.body;
    let i =0;
	new Promise((r1, r2) => {
		var sql = 'SELECT * FROM cust';    
		conn.query(sql, function (err, cust, fields) {
			if(err) {
				console.log('query is not excuted. select fail...\n' + err)
				res.redirect("/failcust");
			}
			else {
				User = cust;
				console.log('users : ', User);
				console.log(User.length);
				r1();
			}
		});

	})   
	.then(() => {
		new Promise((r1, r2) => {
			for(i = 0 ; i < User.length; i++){
				if (body.id == User[i].id && body.password == User[i].pwd){
					if(User[i].isadmin == 1){
						res.redirect('/admin');
						return;
					} else{
						res.redirect('/cust');
						return;
					}
				}
				if(i  == User.length){
					r1();
				}
			}
		})   
		.then(() => {
			console.log(User);
			console.log(i);
			console.log(User[i].id);
			res.redirect('/');
		})
	})
}) 
app.get('/cust', (req, res) =>
  res.sendFile(path.join(app.get('front'), '/cust.html')),
);
app.get('/admin', (req, res) =>
  res.sendFile(path.join(app.get('front'), '/admin.html')),
);

app.post('/reg', function (req, res) {
	let body = req.body;
	var Item = '';
	var sql = 'SELECT id FROM item';    
    conn.query(sql, function (err, item, fields) {
        if(err) {
			console.log('query is not excuted. select fail...\n' + err)
			res.redirect("/failcust");
		}
        else {
			Item = item;
			console.log('items : ',Item);
			//res.send("OK");
			
			
	var table = 'item';
    var sql = `INSERT INTO `+ table + ` VALUES(?,?,?,?,?,?,?,?,1,Now())`;
    
	var params = [Item.length, body.name, body.category, body.cost, body.price,
		 body.profit, body.content,body.image ];
    console.log(sql);
    conn.query(sql, params, function(err) {
        if(err) {
			console.log('query is not excuted. insert fail...\n' + err);
			res.redirect("/failcust");
		}
        else {
			res.redirect('/admin');
		}
	});


		}
	});
	


})

app.post('/handling', function (req, res) {
	let body = req.body;
	let id = body.id;
	
	var sql = 'update item_order set complete = 1 where id = ?';
	var param = id;    
    conn.query(sql,param, function (err, item, fields) {
        if(err) {
			console.log('query is not excuted. select fail...\n' + err)
			res.redirect("/failcust");
		}
        else {
			console.log('update item : ',id);
			//res.send("OK");
			res.redirect('/admin');
			
		}
	})
})
app.post('/see', function (req, res) {
	let body = req.body;
	var Item = '';
	var sql = 'SELECT * FROM item';    
    conn.query(sql, function (err, item, fields) {
        if(err) {
			console.log('query is not excuted. select fail...\n' + err)
			res.redirect("/failcust");
		}
        else {
			Item = item;
			console.log('items : ',Item);
			//res.send("OK");
			
	res.write(cust_html);

	for(let i = 0; i < Item.length; i++){
		res.write(Item[i].name +' | 번호 : '+ Item[i].id +' | 가격 : '+ Item[i].price + ' | 상품설명 : ' + Item[i].content + "<br></br>");
		
			
		
	}
	res.end();
		}
	});
			
})
app.post('/adminsee', function (req, res) {
	let body = req.body;
	var Item = '';
	var sql = 'SELECT * FROM item_order';    
    conn.query(sql, function (err, item, fields) {
        if(err) {
			console.log('query is not excuted. select fail...\n' + err)
			res.redirect("/failcust");
		}
        else {
			Item = item;
			console.log('items : ',Item);
			//res.send("OK");
			
	res.write(adminsee_html);

	for(let i = 0; i < Item.length; i++){
		res.write(' | 주문번호 : ' + Item[i].id +' | 상품번호 : '+ Item[i].item_id +' | 상품갯수 : '+ Item[i].count + ' | 주문고객 : ' + Item[i].cust_id +
		 ' | 주문처리 유무 : ' + Item[i].complete + "<br></br>");
		
			
		
	}
	res.end();
		}
	});
			
})
app.get('/failcust', (req, res) =>
  res.sendFile(path.join(app.get('front'), '/fail.html')),
);
app.post('/buy', function (req, res) {
 	let body = req.body;
	var usrid = body.usrid;
	var usrpwd = body.usrpwd;
	var id = body.item_id;
	var count = body.item_count;
	var table = 'item_order';
	console.log(Item_order);
	console.log(usrid);
	var Item_order = '';
	var User = '';
	var sql = 'SELECT * FROM item_order';    
    conn.query(sql, function (err, item, fields) {
        if(err) {
			console.log('query is not excuted. select fail...\n' + err)
			res.redirect("/failcust");
		}
        else {
			Item_order = item;
			console.log('items : ',Item);
			//res.send("OK");
			
			
			var sql = 'SELECT * FROM cust';    
  			  conn.query(sql, function (err, cust, fields) {
    	    	if(err) {
					console.log('query is not excuted. select fail...\n' + err)
					res.redirect("/failcust");
				}
        		else {
					User = cust;
					console.log('User : ',User);
					//res.send("OK");
					for(let i = 0 ; i < User.length ; i++){
						if (usrid == User[i].id && usrpwd == User[i].pwd){
							// 주문내역에 추가하는 구문
							var sql = `INSERT INTO `+ table + ` VALUES(?,?,?,0,?)`;
							var params = [ Item_order.length , id, count, usrid];
							console.log(sql);
							conn.query(sql, params, function(err) {
								if(err) {
									console.log('query is not excuted. insert fail...\n' + err);
									res.redirect("/failcust");
									return;
								}
								else {
									res.redirect('/cust');
									return;
								}
							});
						}
					}
				}
			})
		}
	})
});

app.post('/check', function (req,res){
	let body = req.body;
	var order = '';
	var table = 'item_order'
	console.log(typeof(body.usrid));
	var sql = 'SELECT * FROM '+table+ ' WHERE cust_id = ?';
	var params = body.usrid;    
    conn.query(sql, params,function (err, item, fields) {
        if(err) {
			console.log('query is not excuted. select fail...\n' + err)
			res.redirect("/failcust");
		}
        else {
			order = item;
			console.log('item orders : ',order);
			//res.send("OK");
			res.write(`
			<!DOCTYPE html>
			<html>
			  <head>
			  <meta charset="utf-8">
				<title>CuBe!</title>
				<script src="./app.js"></script>
			  </head>
			  <body>
			  <form action="/cust" method="get">
				  <tr>
					  <td><input type="submit" value="이전으로"></td>
				  </tr>
				  </form>
				  </body>
			  </html>`)
			for(let i = 0; i < order.length; i++){
				res.write('상품번호 : ' + order[i].id +' | 상품 : '+ order[i].item_id +' | 갯수 : '+ order[i].count + ' | 배송여부 : ' + order[i].complete + "<br></br>");

			}
			res.end();
		}
	});
})
/*
app.get('/', function (req, res) {
    res.send('ROOT');
});*/
app.get ('/login', function (req, res){

	res.sendFile(path.join(app.get('front'), '/index.html'));
	let tep = req.body;
	console.log(tep)
	console.log("nono")
	/*var a = document.querySelector("#pass")
	var b = document.getElementById("pass");
	console.log(a);
	console.log(b);*/
});

app.get('/list', function (req, res) {
    var sql = 'SELECT * FROM cust';    
    conn.query(sql, function (err, rows, fields) {
        if(err) {
			console.log('query is not excuted. select fail...\n' + err)
			res.send("fail");
		}
        else {
			console.log(rows);
			console.log(rows[0].id);
			res.send("OK");
		}
	});
});

app.get('/write', function (req, res) {
    res.render('write.ejs');
});

app.post('/writeAf', function (req, res) {
    var body = req.body;
    console.log(body);
	var table = 'cust';
    var sql = `INSERT INTO `+ table + ` VALUES(?,?,?,?,?,NOW(),?,?,?,?)`;
    var params = [body.id, body.pwd, body.name, body.email, body.address_num,
		 body.address, body.phone, body.useyn ,body.isadmin];
    console.log(sql);
    conn.query(sql, params, function(err) {
        if(err) {
			console.log('query is not excuted. insert fail...\n' + err);
			res.send("fail");
		}
        else {
			res.redirect('/list');
		}
	});
});


//var User = getItemOrder('cust');
var User = getUser();
function getUser(){
	var user = '';
	var sql = 'SELECT * FROM cust';    
	conn.query(sql, function (err, cust, fields) {
		if(err) {
			console.log('query is not excuted. select fail...\n' + err)
			res.send("fail");
		}
		else {
			user = cust;
			console.log('users : ', user);
			console.log(user.length);
			return user;
		}
	});
	
}
var Item_order = getItemOrder();
function getItemOrder( tab){
	var order = '';
	var table = 'item_order'
	var sql = 'SELECT * FROM '+table;    
    conn.query(sql, function (err, item, fields) {
        if(err) {
			console.log('query is not excuted. select fail...\n' + err)
			res.send("fail");
		}
        else {
			order = item;
			console.log('item orders : ',order);
			//res.send("OK");
			
			return order;
		}
	});
}
var Item = getItem();
function getItem(){
	var Item = '';
	var sql = 'SELECT * FROM item';    
    conn.query(sql, function (err, item, fields) {
        if(err) {
			console.log('query is not excuted. select fail...\n' + err)
			res.send("fail");
		}
        else {
			Item = item;
			console.log('items : ',Item);
			//res.send("OK");
			return Item;
		}
	});
}
var cust_html = `
<!DOCTYPE html>
<html>
  <head>
  <meta charset="utf-8">
    <title>CuBe!</title>
    <script src="./app.js"></script>
  </head>
  <body>
     
            
    <form action="/buy" method="post">
		<tr>
            <td><input type="text" name= "item_id" placeholder="구입할 상품 번호" ></td>
        </tr>
		<tr>
            <td><input type="text" name= "item_count" placeholder="구입할 상품 갯수" ></td>
        </tr>
		<tr>
            <td><input type="text" name= "usrid" placeholder="아이디" ></td>
        </tr>
		<tr>
            <td><input type="text" name= "usrpwd" placeholder="비밀번호" ></td>
        </tr>
        <tr>
            <td><input type="submit" value="상품구매"></td>
        </tr>
        </form>
		<form action="/cust" method="get">
			<tr>
				<td><input type="submit" value="이전으로"></td>
			</tr>
		</form>
    </table>
	<button type="button" value="로그인" onclick="money()">돈충전!!</button>
	<tr></tr>
       <!-- <a href="./login"><button type="button" value="로그인">로그인</button></a>-->
	   	<div> 
		   잔액 :  <div type ="text" id="pass"> 0 </div>
	   </div>
	   <script>
	   		var Money = 0;
		   function money(){
			   Money += 10000;
			   document.getElementById('pass').innerHTML = Money;
		   }
	   </script>
  </body>
</html>`
var adminsee_html = `
<!DOCTYPE html>
<html>
  <head>
  <meta charset="utf-8">
    <title>CuBe!</title>
    <script src="./app.js"></script>
  </head>
  <body>
     
		<form action="/admin" method="get">
			<tr>
				<td><input type="submit" value="이전으로"></td>
			</tr>
		</form>
    </table>
	<button type="button" onclick="money()">돈충전!!</button>
	<tr></tr>
	   	<div> 
		   잔액 :  <div type ="text" id="pass"> 0 </div>
	   </div>
	   <script>
	   		var Money = 0;
		   function money(){
			   Money += 10000;
			   document.getElementById('pass').innerHTML = Money;
		   }
	   </script>
  </body>
</html>`
var buy_html = `
<!DOCTYPE html>
<html>
  <head>
  <meta charset="utf-8">
    <title>CuBe!</title>
    <script src="./app.js"></script>
  </head>
  <body>
     
            
    <form action="/buy" method="post">
		<tr>
            <td><input type="text" name= "item_id" placeholder="구입할 상품 번호" ></td>
        </tr>
		<tr>
            <td><input type="text" name= "item_count" placeholder="구입할 상품 갯수" ></td>
        </tr>
		
        <tr>
            <td><input type="submit" value="상품구매"></td>
        </tr>
        
    </table>
	<!--<button type="button" value="로그인" onclick="login()">hololool</button>
        <a href="./login"><button type="button" value="로그인">로그인</button></a>-->
        

</form>
  </body>
</html>`




/*
let auth = (req, res, next) => {
	// Session Check
	if(req.session.isAdmin != true){
	// 어드민 여부 체크 필요
		res.send("you're not admin");
		return;
	}
	if (req.session.id == null)
		res.send("Error");
	else
		next();
};
let users = new Array();
users[0] = {
	"id" : 0,
	"name" : "jin",
	"password" : "abc",
	"isAdmin" : true
}
users[1] = {
	"id" : 1,
	"name" : "jain",
	"password" : "abcd",
	"isAdmin" : false
}
app.post('/users', auth, (req, res) => {
	users[req.body.id] = [req.body.id,  req.body.name, req.body.password, req.body.isAdmin];

});
app.put('/login', (req, res) => {
	var a = req.body.id;

	req.session.id = a;
	req.session.password = a.passowrd;
	req.session.isAdmin = user[a].isAdmin;
	// users 배열에서 찾도록 처리 해야 함
	// admin 여부를 확인하여 체크
	// req.body.id : ID
	// req.body.password : 패스워드
	res.send("Login");
});

app.put('/logout', (req, res) => {
	// Logout
	var a = req.body.id;
	res.send(a);
	// 세션 유효 여부를 체크하고 세션 Delete
	req.session.id = null;
	req.session.password = null;
	req.session.isAdmin = null;

	res.send("LogOut");

});

app.put('/users', (req, res) => {
	// update
	users[req.body.id].id = req.body.id;
	users[req.body.id].password = req.body.password;
	users[req.body.id].isAdmin = req.body.isAdmin ;

	res.send(users[req.body.id]);

	res.send("update");

});

app.get('/users/:userId', auth, (req, res) => {
	// get User Information
	let userId = req.params.id;
	console.log(user[userId]);

	res.send("OK");
});

// 사용자 추가 시에 admin 여부도 추가해야 함
app.delete('/users/:userId', auth, (req, res) => {
	
	users[req.body.id] = null;

});
*/

/*
const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>practice</title>
</head>
<body>
  <h1>한글 되네?</h1>
  <h2>신기하구나.. 너란 녀석....</h2>
  <script src="./app.js">
		document.getElementById("temp").innerHTML = ${rows[0]}
  </script>
</body>
</html>
`;*/
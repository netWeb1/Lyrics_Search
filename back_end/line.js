var express = require('express');
const request = require('request');
const TARGET_URL = 'https://api.line.me/v2/bot/message/reply'
const TOKEN = 'rQFBQXVZqeF1uFJSoPwloR8avp6Gkxssb2jNJdAFtfK'

const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const domain = "localhost:80"
const sslport = 23023;
const bodyParser = require('body-parser');

let session = require('express-session');
const { text } = require('body-parser');
var app = express();
app.use(bodyParser.json());

var User = new Array();
/*
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use(bodyParser.urlencoded({ extended: false }));
*/
var db_config = require(__dirname+ '/cf.js');
var conn = db_config.init();

db_config.connect(conn);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


var ordernum = 0;
var sql = 'SELECT * FROM item_order';    
conn.query(sql, function (err, rows, fields) {
    if(err) {
		console.log('query is not excuted. select fail...\n' + err)
	}
    else {
        ordernum = rows.length;
	}
});
function SL(text){
for(let j =0; j < text.length; j++){
    if(text[j] = '-'){
        return [text.slice(0,j),text.slice(j+1)]
    }
    else return;
}
}
function Message(Message){
                request.post(
                    {
                        url: TARGET_URL,
                        headers: {
                        'Authorization': `Bearer ${TOKEN}`
                        },
                        json: {
                            "replyToken":replyToken,
                            "messages":[
                                {
                                    "type":"text",
                                    "text":Message
                                }
                            ]
                        }
                    },(error, response, body) => {
                        console.log(body)
                    });
                return console.log(Message);
}


function purchase(z, text){ 
    let found = false;
    if(text == '0'){
        User[z].state = null;
        return;
    }
    var tx;
    if (! (tx = SL(text))) return Message("잘못된 입력입니다.");
    for( let i= 0; i < items.length; i++){
        if(tx[0] == items[i].id){
            found= true;
            var table = 'item_order';
            var sql = `INSERT INTO `+ table + ` VALUES(?,?,?,?,?)`;
            var params = [ordernum++, items[i].id, tx[1], 0, User[z].id];
            console.log(sql);
            conn.query(sql, params, function(err) {
                if(err) {
                    console.log('query is not excuted. insert fail...\n' + err);
                    Message('주문에 실패했습니다')
                    return ;
                }
                else {
                    console.log('주문성공')
                    User[z].state = null;
                }
            });

        }
    }
    if (!found){
        Message("존재하지 않는 상품입니다");
        return;
    }
}
var items = '';
          
	


app.post('/hook', function(req, res) {
    var eventObj = req.body.events[0];
    var text = eventObj.message.text;
    var replyToken = eventObj.replyToken;
    var cur_user = eventObj.source.userId;
    console.log(req.body)
    console.log(cur_user);
    
    var Cus = false;
    var z = 0
    for( z = 0; z < User.length; z++){
        if(cur_user == User[z].id){
            Cus = true;
            break;
        }
    }
    if( text == '회원가입') {
        for( var i = 0; i < User.length; i++){
            if(cur_user == User[i]){
                Message('회원가입이 이미 된 고객입니다')
                return;
            }
        }
        
        User.push([{"id" : cur_user},{"state" : null} ]);
    }
    if(!Cus) {
        Message('회원가입을 진행 후 쇼핑해주세요')
    }
    if(User[z].state != null){
        switch(User[z].state){
            case '상품구매':
                purchase(z,text)
        }
    }
    console.log('start');
    if( text == '상품구매') {
        var Message ='번호-갯수를 입력하시면(ex:5번을 5개 구매 = 5-5) 구매를\n, 0을 누르시면 취소입니다.\n'
            User[z].state = '상품구매'
            for(let i=0;i<items.length;i++){
                Message += items[i].id +'. '+ items[i].name + '\n'
            }
            Message(Message);
    

    }
});

try {
   
var sql = 'SELECT * FROM item';    
conn.query(sql, function (err, rows, fields) {
    if(err) {
		console.log('query is not excuted. select fail...\n' + err)
	}
    else {
        items =  rows;
	}
});
    const option = {
      ca: fs.readFileSync('/etc/letsencrypt/live/' + domain +'/fullchain.pem'),
      key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/privkey.pem'), 'utf8').toString(),
      cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/cert.pem'), 'utf8').toString(),
    };
    HTTPS.createServer(option, app).listen(sslport, () => {
      console.log(`[HTTPS] Server is started on port ${sslport}`);
    });

    
  } catch (error) {
    console.log('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
    console.log(error);
}
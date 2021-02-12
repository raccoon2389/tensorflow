const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const util = require('util');
const mysql = require('mysql');
const weather = require('./weather.js');

var connect = mysql.createConnection(
    {host: 'localhost', user: 'root', password: '000000', database: 'food'}
);

connect.connect();

const data_path = `./data/`;

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url
        .parse(_url, true)
        .query;
    var title = queryData.id;
    var pathname = url
        .parse(_url, true)
        .pathname;
    var template = `
<!doctype html>
<head>
    <meta charset="utf-8">
    <title>맛집 추천</title>
</head>
<body>
    <h1><a href="/">맛집 추천</a></h1>
    <a href="/result"> 먹었던 메뉴 </a> 
    <input type="button" value='night mode' 
    onclick="document.querySelector('body').style.backgroundColor='black';
    document.querySelector('body').style.color='white';">\n`;

    if (pathname === '/') {
        template += `
        <form action="http://localhost:3000/food_process" method="POST">
            <p>유저명 :  <input type="text" name="user" placeholder="유저" required autofocus></p>

            <p>오늘 먹은 메뉴 입력:  <input type="text" name="food_name" placeholder="먹은 메뉴" required autofocus> 
            만족도 : <input type="range" name = "good" min="1" max ="10" step ="0.1" value = "5" oninput="rangeout.value=this.value"/><output name="rangeout" for="range">5</output> </p>
            <input type="submit" value='입력' onclick=
            "alert('입력 되었습니다');"> 날씨는 자동으로 입력됩니다.
        </form>
        </body>`;
        response.writeHead(200);
        response.end(template);
    } else if (pathname === "/food_process") {

        var body = "";

        request.on('data', function (data) {
            body += data;
        })
        request.on('end', function () {
            var post = qs.parse(body);
            var user = post.user;
            var food_name = post.food_name;
            var good = post.good;
            weather.now(temp=>{
                connect.query(`SELECT user.id AS user_id, user.name AS user_name, food.name AS food FROM user LEFT JOIN food ON user.id = food.user_id WHERE ? = user.name`,[user],(error,join_results)=>{
                    if(error) {throw error}
                    else if (join_results[0] === undefined){
                        connect.query(`INSERT INTO user(name) VALUE (?)`,[user],(error2, result) => {
                            if (error2) {
                                throw error2;
                            }else{
                                connect.query(`INSERT INTO food(name, user_id,good,temperature, humidity,windspeed,cloudcover) VALUE (?,?,?,?,?,?,?)`,[food_name,result.insertId,good,temp.temperature, temp.humidity, temp.windSpeed, temp.cloudCover],(error3, result) => {
                                    if (error3) {
                                        throw error3;
                            }
                            else{
                                response.writeHead(302, {Location: '/result'});
                                response.end();
                        }
                    }
                )
            }
        })

                } else{
                    connect.query(`INSERT INTO food(name, user_id,good,temperature, humidity,windspeed,cloudcover) VALUE (?,?,?,?,?,?,?)`,[food_name,join_results[0].user_id,good,temp.temperature, temp.humidity, temp.windSpeed, temp.cloudCover],(error3, result) => {
                        if (error3) {
                            throw error3
                        }else{
                            response.writeHead(302, {Location: '/result'});
                            response.end();
                    };
                })
                }
            })
            });

            
            /*connect.query(`SELECT * FROM user WHERE name = ?`, [user], (error2, yn) => {
                if (error2) {
                    throw error2;
                } else if (yn[0] === undefined) {
                    connect.query(
                        `INSERT INTO user(name) VALUE (?) `,[user],(error3, result) => {
                            if (error2) {
                                throw error3
                            };
                            console.log(result);
                            connect.query(`INSERT INTO food(name, user_id) VALUE (?,?) `, [
                                food_name, result.insertId
                            ], (error4, f_name) => {
                                if (error4) 
                                    throw error4;
                                response.writeHead(302, {Location: '/result'});
                                response.end();
                            })
                        }
                    );
                } else {
                    connect.query(`INSERT INTO food(name,user_id) VALUE (?,?) `, 
                                    [food_name, yn[0].id], (error4, result) => {
                        if (error4) {
                            throw error4
                        };
                        console.log(result);
                        response.writeHead(302, {Location: '/result'});
                        response.end();
                    });
                }

            })*/
        })
    } else if (pathname === '/result') {
        template += `<style>
        table {
            margin: 0 auto;
            text-align: center;
            border-collapse: collapse;
            border: 1px solid #d4d4d4;
        }
        tr:nth-child(even) {
            background: #d4d4d4;
          }
 
          th, td {
            padding: 10px 30px;
          }
           
          th {
            border-bottom: 1px solid #d4d4d4;
          }     
        }
      </style>
        <table>
        <thead>
          <tr>
            <th>유저명</th><th>먹은 메뉴</th><th>기온</th><th>습도</th><th>풍속</th><th>흐림도</th>
          </tr>
        </thead>
        <tbody>`;

        connect.query(`SELECT user.id AS user_id, user.name AS user_name, food.name AS food, temperature, humidity, windspeed, cloudcover FROM user LEFT JOIN food ON user.id = food.user_id`,(error,join_results)=>{
            var i = 0;
            var k = 2;
           /* var asset = [join_results[i].food, join_results[i].temperature, join_results[i].humidity, join_results[i].windspeed, join_results[i].cloudcover]*/     
            
            while(join_results[i] != undefined){

                template += `<tr>\n<td>`;

                if(join_results[i].user_id != k){
                    template += join_results[i].user_name;
                    k++ ;
                }

                template += `</td>`;
                
                if(join_results[i].food != undefined){
                    /*for(var j=0;j<5;j++){
                    template += `<td>${asset[j]}</td>`;
                }*/
                template += `<td>${join_results[i].food}</td> <td>${join_results[i].temperature}</td> <td>${join_results[i].humidity}</td> <td>${join_results[i].windspeed}</td> <td>${join_results[i].cloudcover}</td> `;
               
            }else{
                for(var j=0;j<5;j++){
                    template +=`<td>없음</td>`
                }
            }

                template += `\n</tr>`

                i++;
            }
            template += `</tbody>\n</table></body>`
            response.writeHead(200);
            response.end(template);
        })
        /*
        readdir(data_path, 'utf8').then((f_dir) => {
            const func2 = async (f_dir) => {
                for (var i = 0; i < f_dir.length; i++) {
                    const content_func = async (i, f_dir) => {
                        var f_content = await readFile(data_path + f_dir[i], "utf8");
                        var arr_food = f_content.split(",");
                        var tmp = ``;
                        console.log(f_dir);
                        var ppap = f_dir.join('');
                        var user_name = ppap.split('.txt');

                        for (var k = 0; k < arr_food.length; k++) {

                            tmp += `<tr>\n<td>`;
                            if (k === 0) {
                                tmp += user_name[i];
                            }
                            tmp += `</td><td>${arr_food[k]}</td>\n</tr>`
                        };

                        return tmp;
                    };

                    template += await content_func(i, f_dir);
                }

            }
            const func3 = async () => {
                await func2(f_dir);
                template += `</tbody>\n</table></body>`
                response.writeHead(200);
                response.end(template);
            }
            func3();
        })*/

    } else {
        response.writeHead(404);
        response.end('Not found');
    };

});
app.listen(3000);

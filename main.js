const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const util = require('util');

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
    <h1>맛집 추천</h1>
    <a href="/result"> 먹었던 메뉴 </a>
    <input type="button" value='night mode' 
    onclick="document.querySelector('body').style.backgroundColor='black';
    document.querySelector('body').style.color='white';">\n`;

    if (pathname === '/') {
        template += `
        <form action="http://localhost:3000/food_process" method="POST">
            <p>유저명 :  <input type="text" name="user" placeholder="유저" required autofocus></p>

            <p>오늘 먹은 메뉴 입력:  <input type="text" name="food_name" placeholder="먹은 메뉴" required autofocus></p>
            <input type="submit" value='입력' onclick=
            "alert('입력 되었습니다');">
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
            readdir(data_path, 'utf8').then(result => {
                var cur_user = result;
            });
            var user_path = data_path + user + `.txt`;

            fs.exists(user_path, exists => {
                if (exists) {
                    fs.appendFile(user_path, `,` + food_name, err => {
                        if (err) 
                            throw err;
                        
                        response.writeHead(302, {Location: '/result'});
                        response.end();
                    })
                } else {
                    fs.writeFile(user_path, food_name, 'utf8', function (err) {
                        console.log('saved!')

                        response.writeHead(302, {Location: '/result'});
                        response.end();
                    });
                }
            })
        })
    } else if (pathname === '/result') {
        template +=`<style>
        table {
          width: 100%;
          border: 1px solid #444444;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #444444;
        }
      </style>
        <table>
        <thead>
          <tr>
            <th>유저명</th><th>먹은 메뉴</th>
          </tr>
        </thead>
        <tbody>`;

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
                template+=`</tbody>\n</table></body>`
                response.writeHead(200);
                response.end(template);
            }
            func3();
        })

    } else {
        response.writeHead(404);
        response.end('Not found');
    };

});
app.listen(3000);

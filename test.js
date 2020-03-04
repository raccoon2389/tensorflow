var data_path = `./data`;
var fs = require('fs');
const util = require('util');

var f_list=``;
/*
const promise1 = function(){return new Promise((resolve,reject)=>{
    fs.readdir(`./data/`,'utf8',(err,List)=>{
        if(List === undefined){
            reject(err);
          }
        else{
            resolve(List)
             }
            });
});
};

const promise_dir = function(filepath, callback){
    fs.readdir(filepath,'utf8',(err,List)=>{
        if(List === undefined){
            callback(err,null);
          }
        else{
            callback(null,List);
             }
    });
};

const r_Dir = util.promisify(promise_dir);

const promise_content = function(filepath, callback){
    fs.readFile()
}



promise1().then(f_list=>{console.log(f_list)});

r_Dir(`./data/`).then(List=>{
    console.log(List);
    var val = List.find((item)=>{
        return item === `roy09.txt`;
    });
    if(val === undefined){console.log(`픵쉰`);}
    else{console.log(`${val} <- 찾음`)}
});

fs.exists(`./test.txt`, exists=>{
    if(exists){
        console.log(`존재`);
    }
    else{
        console.log(`엄슴`);
    }
})

var str = 'html,css,javascript,jquery,apache,php';
console.log(str.split(',')); //배열 [html,css,javascript,jquery,apache,php]
str.split(',',2) // 배열 [html,css] .
*/

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

var r ='';
const fun = async function(){
 for (var i = 0; i < 10; i++) {
    r = await readdir('./data/', 'utf8');

    console.log(`in` + r);
}
console.log(`out` + r);

};
const func2 = async () => {
    for (var i = 0; i < 10; i++) {
        console.log(`전`);
        await fun();
        console.log(`후`);

    }
}
func2();


   /*const func = function(data_path, callback){

        readdir(data_path,"utf8").then(f_list=>{

            console.log(f_list);
            var i =0;
            while(i<f_list.length){
                readFile(data_path+f_list[i],"utf8").then(f_name=>{
                     console.log(f_name);
                     var k = 0;
                     var arr_food = f_name.split(",");
                     template += `<p> ${f_list}`
                     while(k<arr_food.length){
                         template += `-    -   -   -   -${f_name}\n</p>`
                         k++;

                        }
                 });

                 i++;
             };
            })
        };
        const result_func = util.promisify(func);
        result_func(data_path).then(result=>{
            console.log(result);
            response.writeHead(200);
            response.end(result);
        }
        )
            */

/*
           console.log(1);

           readdir(data_path, "utf8").then(f_list => {
               var add =``;
               const func2 = function (i) {
                   console.log(3);
                   readFile(data_path + f_list[i], "utf8").then(f_name => {
                       var arr_food = f_name.split(",");
   
                       for (var k = 0; k < arr_food.length; k++) {
                           var tmp=``;
                           console.log(arr_food[k]);
                           tmp += `<p>`;
                           if (k === 0) {
                               tmp += f_list;
                           }
                           tmp += `       -    -   -   -   -${arr_food[k]}\n</p>`
                       };
                       return tmp;
                   });
               };
   
               func2_sync = util.promisify(func2);
   
               const func = async function () {
                   for (var i = 0; i < f_list.length; i++) {
                       console.log(2);
                       add += await func2_sync(i);
                   }
                   return add;
               }
   
               const func3 = async function () {
                   add = await func();
                   console.log(template);
                   response.writeHead(200);
                   response.end(template);
   
               };
               func3();
   
           });
           */
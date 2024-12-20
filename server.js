//install: node js
//install web server package: express >npm install express
var express = require("express");
var server = express();
var bodyParser = require("body-parser");
var DB = require("nedb-promises"); 

//web root
server.use(express.static(__dirname + "/public"));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded());


const NewsDB = DB.create(__dirname + "/data/News.db"); 
const ProjectsDB = DB.create(__dirname + '/data/Projects.db');




// ProjectsDB.insert({
//   title: "這是一個專案",
//   credits: "AAA公司",
//   content: "我個人認為雪意麵就應該拌810號混泥土，因為這個竹刀的長度很容易直接影響到注射器的扭矩。你往裡撅的時候，一瞬間他就會產生大量的昏睡紅茶，俗稱INMU，會嚴重影響木毛的發展，以至於對整個下北澤，和拉麵屋台的沼氣污染。再或者說透過這二人幸終很容易推斷出人工飼養的田所浩二，他是可以捕獲野生的悶絕少年，所以說不管這TDN的日光浴毯是否具有噴發性，KBTIT的N次方是否有林檎，都不會影響到黑色高級車跟朴秀在會員制餐廳追撞。我個人認為雪意麵就應該拌810號混泥土，因為這個竹刀的長度很容易直接影響到注射器的扭矩。你往裡撅的時候，一瞬間他就會產生大量的昏睡紅茶，俗稱INMU，會嚴重影響木毛的發展，以至於對整個下北澤，和拉麵屋台的沼氣污染。再或者說透過這二人幸終很容易推斷出人工飼養的田所浩二，他是可以捕獲野生的悶絕少年，所以說不管這TDN的日光浴毯是否具有噴發性，KBTIT的N次方是否有林檎，都不會影響到黑色高級車跟朴秀在會員制餐廳追撞。",
//   images: [
//       "/uploads/project1-1.jpg",
//       "/uploads/project1-2.jpg",
//       "/uploads/project1-3.jpg"
//   ]
// })

// server.get("/services", (req, res)=>{
//     //DB find
//     var Services=[
//         {icon: "fa-shopping-cart", heading:"E-Commerce", text:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit."},
//         {icon: "fa-laptop", heading:"Responsive Design", text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit."}
//     ];
//     res.send(Services);
// });

server.get("/news", (req,res)=>{
      //DB
      NewsDB.find({}).then(results=>{
        if(results != null){
             res.send(results);
        }else{
            res.send("Error!");
        }
      })
})

// server.post("/contact_me", (req,res)=>{
//      ContactDB.insert(req.body);
//      res.redirect("/#contact");
// })

server.get('/projects', (req, res) => {
  res.sendFile(__dirname + '/public/projects.html');
});


server.get('/api/projects', async (req, res) => {
  try {
      const projects = await ProjectsDB.find({});
      res.json(projects);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

server.get('/api/projects/:id', async (req, res) => {
  try {
      const project = await ProjectsDB.findOne({ _id: req.params.id });
      res.json(project);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});



server.listen(80, () => {
    console.log("Server is running at port 80.");
})
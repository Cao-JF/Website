//install: node js
//install web server package: express >npm install express
const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const DB = require("nedb-promises"); 
const multer = require('multer');
const path = require('path');

const PORT = process.env.PORT || 1000;

//web root
server.use(express.static(__dirname + "/public"));



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



server.get('/upload', (req, res) => {
  res.sendFile(__dirname + '/public/upload.html');
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, path.join(__dirname, '/public/uploads'))
  },
  filename: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

server.use(bodyParser.json());

server.post('/api/upload', upload.array('images', 5), async (req, res) => {
  try {
      const imageUrls = req.files.map(file => '/uploads/' + file.filename);
      
      await ProjectsDB.insert({
          title: req.body.title,
          credits: req.body.credits,
          content: req.body.content,
          images: imageUrls
      });
      
      res.json({ success: true });
  } catch(err) {
      res.json({ success: false, error: err.message });
  }
});



server.get('/edit', (req, res) => {
  res.sendFile(__dirname + '/public/test.html');
});

// 獲取所有內容
server.get('/api/content', async (req, res) => {
  try {
      const items = await ProjectsDB.find({}).sort({ order: 1 });
      res.json(items);
  } catch(err) {
      res.status(500).json({ error: err.message });
  }
});

// 更新內容
server.post('/api/update', upload.array('images'), async (req, res) => {
  try {
      const imageUrls = req.files ? req.files.map(file => '/uploads/' + file.filename) : [];
      const item = await ProjectsDB.findOne({ _id: req.body._id });
      
      await ProjectsDB.update({ _id: req.body._id }, {
          $set: {
              title: req.body.title,
              credits: req.body.credits,
              content: req.body.content,
              images: imageUrls.length > 0 ? imageUrls : item.images
          }
      });
      
      res.json({ success: true });
  } catch(err) {
      res.status(500).json({ error: err.message });
  }
});

// 刪除內容
server.delete('/api/delete/:id', async (req, res) => {
  try {
      await ProjectsDB.remove({ _id: req.params.id });
      res.json({ success: true });
  } catch(err) {
      res.status(500).json({ error: err.message });
  }
});

// 重新排序
server.post('/api/reorder', async (req, res) => {
  try {
      const { itemId, newIndex } = req.body;
      const items = await ProjectsDB.find({}).sort({ order: 1 });
      
      // 更新順序
      items.forEach((item, index) => {
        ProjectsDB.update({ _id: item._id }, { $set: { order: index } });
      });
      
      res.json({ success: true });
  } catch(err) {
      res.status(500).json({ error: err.message });
  }
});




server.listen(1000, () => {
    console.log("Server is running at port 1000.");
})
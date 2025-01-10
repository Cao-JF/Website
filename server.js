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
server.use(bodyParser.json());

const ProjectsDB = DB.create(__dirname + '/data/Projects.db');



const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, path.join(__dirname, '/public/uploads'))
  },
  filename: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });



server.get('/about', (req, res) => {
  res.sendFile(__dirname + '/public/about.html');
});

server.get('/edit', (req, res) => {
  res.sendFile(__dirname + '/public/edit.html');
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



server.listen(1000, () => {
    console.log("Server is running at port 1000.");
})
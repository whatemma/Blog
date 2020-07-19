const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  Post.find((err, posts) => {
    if (err) {
      console.error(err);
    }else{
      res.render("home", {posts: posts});
    }
  }).limit(5);  
});

app.get("/posts/:postid", (req, res) => {

  Post.findOne({_id: req.params.postid}, (err, posts) => {
    if (!err){
      res.render("post", {Title: posts.title, Author: posts.author, Content: posts.content})
    }else{
      console.log(err);
    }
  });
});

app.get("/posts", (req, res) => {
  Post.find((err, posts) => {
    if (err) {
      console.error(err);
    }else{
      res.render("posts", {posts});
    }
  });
})

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  Post.find({title: req.body.title}, (err, posts) => {
    if (!err && posts.length === 0){
      const post = new Post({
        title: req.body.title,
        author: req.body.author,
        content: req.body.post
      });
      post.save();
    }else{
      console.log(err);
    }
    res.redirect("/posts");
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

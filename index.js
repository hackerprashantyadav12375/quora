const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuid } = require("uuid");
const methodOverride = require("method-override");

// Middleware

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Sample Posts Data
let posts = [
  { id: uuid(), username: "apnacollege", content: "I love coding" },
  { id: uuid(), username: "shradhakhapra", content: "Hard work is key to success" },
  { id: uuid(), username: "rahulkumar", content: "I got selected for my first internship" },
];

// Home Page - Show All Posts
app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts });
});

// Show Single Post
app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);
  if (!post) return res.status(404).send("Post not found");
  res.render("show.ejs", { post });
});

// Show Create New Post Form
app.get("/posts/new", (req,res) =>{

  res.render("new.ejs");

});

// Create New Post
app.post("/posts", (req,res) => 
  {

  let { username, content } = req.body;  // Fetch the form data
  let id = uuid(); // Create a unique ID for the new post
  posts.push({ id, username, content }); // Push the new post to the posts array
  res.redirect("/posts"); 
   // Redirect to view all posts after the new one is created
});


// Show Edit Form
app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);
  if (!post) return res.status(404).send("Post not found");
  res.render("edit.ejs", { post });
});

// Update Post
app.patch("/posts/:id", (req, res) => {
  let { id } = req.params;
  let newContent = req.body.content;
  let post = posts.find((p) => p.id === id);

  if (!post) return res.status(404).send("Post not found");

  post.content = newContent;
  res.redirect("/posts");
});

app.delete("/posts/:id",(req,res)=>{
    let {id}=req.params;
    posts=posts.filter((p)=>id!==p.id);
    res.redirect("/posts");
});

// Start Server
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

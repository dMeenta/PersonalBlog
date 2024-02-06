import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const links = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

function linkGenerator(req, res, next){
    links.forEach(element => {
        app.get(`/${element}`, (req, res)=>{
            res.render(`${element}.ejs`);
        })
    });
    next();
}

app.use(linkGenerator);

app.get("/crear-post", (req, res)=>{
    res.render("crear.ejs");
})

app.post("/submit", (req, res) => {
    const postTitle = req.body["pTitle"];
    const postContent = req.body["pContent"];
    fs.writeFile(`views/${postTitle}.ejs`, `<%- include('partials/header.ejs') %>\n<%- include('partials/aside.ejs') %>\n<main>\n<h3>${postTitle}</h3><p class="post-content">${postContent}</p>\n</main>\n<%- include("partials/footer.ejs") %>`, (err)=>{
    if(err) throw err;
    console.log("The FIle Has Been Saved!")
    links.push(postTitle);
    console.log(links);
})
    res.redirect("/");
});

app.get("/", (req, res) => {
    res.render("index.ejs", {array: links});
})

app.listen(port, () => {
    console.log(`Using Port ${port}`);
})
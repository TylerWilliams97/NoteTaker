const express = require("express");
const path = require("path");
const fs = require("fs");

let app = express();
let PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});


app.get("/api/notes", function (req, res) {
  
    fs.readFile("./db/db.json", function (err, data) {
        if (err) throw err;
     
        const notes = JSON.parse(data);
      
        res.send(notes);
    });
});


app.post("/api/notes", function (req, res) {
    let newnotes = req.body;
    newnotes.id = JSON.stringify(Math.random());
    fs.readFile("./db/db.json", function (err, data) {
        if (err) throw err;
       
        let notes = JSON.parse(data);
       
        notes.push(newnotes);
        
        fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
            if (err) console.log(err);
            
            res.send(notes[(notes.length - 1)].text);
            
        });
    });
});

app.delete("/api/notes/:id", function (req, res) {
    const idNote = req.params.id;
   
    fs.readFile("./db/db.json", function (err, data) {
        if (err) throw err;
        let notes = JSON.parse(data);
     
        let newNotes = [];
        notes.forEach(obj => {
            if (obj.id !== idNote) {
                newNotes.push(obj);
            };
        });
        
        fs.writeFile("./db/db.json", JSON.stringify(newNotes), function (err) {
            if (err) console.log(err);
           
            res.send();
        });
    });
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});


app.listen(PORT, function () {
    console.log("Server is up at 8080!");
})
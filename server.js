const bodyParser = require("body-parser");
const express = require("express");
const app = express();

//Middlewares.
// Make sure you place the body-parser before the CRUD handlers.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//HTML Template Engine
app.set("view engine", "ejs");

//Connect to Mongodb
const MongoClient = require("mongodb").MongoClient;
const connectionString =
  "mongodb+srv://denrax:denrax123@cluster0.utexj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//Connect Using Promises.
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("star-wars-quotes");
    const quotesCollection = db.collection("quotes");
    //Post Request
    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.log(error));
    });
    //Get
    app.get("/", (req, res) => {
      //   res.sendFile(__dirname + "/index.html");
      db.collection("quotes")
        .find()
        .toArray()
        .then((results) => {
          res.render("index.ejs", { quotes: results });
        })
        .catch((error) => console.log(error));
    });
  })

  .catch((error) => console.error(error));

//Listening on Ports

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});

/* //you can rewrite the connection using an if else statement.
MongoClient.connect(connectionString, (err, client) => {
  if (err) {
    return;
    console.log(err);
  }
  console.log("Connected to DB!");
});
*/

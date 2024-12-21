const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3000;

// Cors configuration - Allows requests from localhost:4200
const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 204,
  methods: "GET, POST, PUT, DELETE",
};

// Use cors middleware
app.use(cors(corsOptions));

// Use express.json() middleware to parse JSON bodies of requests
app.use(express.json());

// GET route - Allows to get all the items
// example: localhost:3000/clothes?page=0&perPage=2
app.get("/clothes", (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const perPage = parseInt(req.query.perPage) || 10;
  const rating = parseInt(req.query.rating);

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);
    const start = page * perPage;
    const end = start + perPage;

    var result = jsonData.items.slice(start, end);
    
    function filterRating(rating) {
      return result.filter(object => {
        return object['rating'] == rating;
      })
    }
    switch (rating) {
      case 1:
      var result = filterRating(1);
      console.log("1b");
      break;
      case 2:
        var result = filterRating(2);
        console.log("2b");
      break;
      case 3:
        var result = filterRating(3);
        console.log("3b");
        console.log("new result", result);
      break;
      case 4:
        var result = filterRating(4);
        console.log("4b");
      break;
      case 5:
        var result = filterRating(5);
        console.log("5b");
      break;
      default:
        var result = jsonData.items.slice(start, end);
        
    }

    if(rating != 0){
      console.log("froggy");
        res.status(200).json({
          items: result,
          total: result.length,
          totalPages: 1,
        });
    }else{
      console.log("yellowfish");
        res.status(200).json({
          items: result,
          total: result.length,
          page,
          perPage,
          totalPages: Math.ceil(jsonData.items.length / perPage),
        });
    }
    
  });
});

// POST route - Allows to add a new item
// example: localhost:3000/clothes
/*
  body: {
    "image": "https://your-image-url.com/image.png",
    "name": "T-shirt",
    "price": "10",
    "rating": 4
  }
*/
app.post("/clothes", (req, res) => {
  const { image, name, price, rating } = req.body;

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const maxId = jsonData.items.reduce(
      (max, item) => Math.max(max, item.id),
      0
    );

    const newItem = {
      id: maxId + 1,
      image,
      name,
      price,
      rating,
    };

    jsonData.items.push(newItem);

    fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(201).json(newItem);
    });
  });
});

// PUT route - Allows to update an item
// example: localhost:3000/clothes/1
/*
  body: {
    "image": "https://your-image-url.com/image.png",
    "name": "T-shirt",
    "price": "10",
    "rating": 4
  }
*/
app.put("/clothes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { image, name, price, rating } = req.body;

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const index = jsonData.items.findIndex((item) => item.id === id);

    if (index === -1) {
      res.status(404).send("Not Found");
      return;
    }

    jsonData.items[index] = {
      id,
      image,
      name,
      price,
      rating,
    };

    fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(200).json(jsonData.items[index]);
    });
  });
});

// DELETE route - Allows to delete an item
// example: localhost:3000/clothes/1
app.delete("/clothes/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const index = jsonData.items.findIndex((item) => item.id === id);

    if (index === -1) {
      res.status(404).send("Not Found");
      return;
    }

    jsonData.items.splice(index, 1);

    fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(204).send();
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

let SERVER_NAME = "programnode";
let PORT = 5000;
let HOST = "127.0.0.1";

//Counter for the GET and POST request
let totalGetCounter = 0;
let totalPostCounter = 0;

let error = require("restify-errors");
let restify = require("restify"),
  
  productsSaved = require("save")("products"),
  // Creating the restify server
  server = restify.createServer({ name: SERVER_NAME });

server.listen(PORT, HOST, function () {
  console.log("Server %s listening at %s", server.name, server.url);
  console.log("**** Resources: ****");
  console.log("********************");
  console.log("Endpoints: %s method: GET, POST, DELETE ", server.url);
  console.log("/products");
  console.log("/products/:id");
});

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Getting the products in the system
server.get("/products", function (req, res, next) {
  console.log("********************");
  console.log("products GET: received request");
  console.log("GET /products params=>" + JSON.stringify(req.params));
  totalGetCounter++;

  // Finding out all data in the  collection
  productsSaved.find({}, function (error, products) {
    // Return all products in the system
    res.send(products);
    console.log(
      "Processed Count--> GET:",
      totalGetCounter + " , " + "POST:",
      totalPostCounter
    );
  });
  console.log("Available products details");
});

// Creating a new product
server.post("/products", function (req, res, next) {
    console.log("**********************");
    console.log("products POST: received request");
    console.log("POST /products params=>" + JSON.stringify(req.params));
    console.log("POST / products body=>" + JSON.stringify(req.body));
    totalPostCounter++;
  
    // Ensuring all manadatory fields are filled
    if (req.body.name === undefined) {
      // If there are any errors, pass them to next in the correct format
      return next(new error.BadRequestError("Please Enter Name"));
    }
    if (req.body.price === undefined) {
      // If there are any errors, pass them to next in the correct format
      return next(new error.BadRequestError("Please Enter Price"));
    }
    if (req.body.quantity === undefined) {
      // If there are any errors, pass them to next in the correct format
      return next(new error.BadRequestError("Please Enter Quantity"));
    }
  
    let newProduct = {
      productId: req.body.productId,
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
    };
    //   Create the product using the presistence engine
    productsSaved.create(newProduct, function (error, product) {
      // Pass any errors to next in the correct format
      if (error) return next(new Error(JSON.stringify(error.errors)));
  
      // Send product if all conditions are met
      res.send(201, product);
      console.log(
        "Processed Request Count--> GET:",
        totalGetCounter + " , " + "POST:",
        totalPostCounter
      );
    });
    console.log("Product and product details added successfully");
  });
  
  // Delete all products
server.del("/products", function (req, res, next) {
    console.log("DELETE /products params=>" + JSON.stringify(req.params));
  
    // Delete all products from the persistence engine
    productsSaved.deleteMany({}, function (error) {
      console.log(`${req.method} ${req.url}: sending response`);
  
      // Pass any errors to next in the correct format
      if (error) {
        return next(new Error(JSON.stringify(error.errors)));
      }
      // Send a success response showing products deleted
      res.send(204);
      console.log("All products deleted");
    });
  }); 
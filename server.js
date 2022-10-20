const { MongoClient } = require("mongodb");
const express = require("express");
const nodemailer = require("nodemailer");
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
const app = express();

const cors = require("cors");
require("dotenv").config();

// dRggtV8DxwiEehVF
app.use(cors());
app.use(express.json());
async function run() {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n0kiz.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(uri);

  try {
    await client.connect();
    const database = client.db("bike-software");
    const bikes_model = database.collection("bikes");
    const purchase_model = database.collection("purchase");
    const usersCallection = database.collection("users");

    // get
    app.get("/plans", async (req, res) => {
      try {
        const plans = await bikes_model.find({}).toArray();
        return res.status(200).send(plans);
      } catch (err) {
        console.log(err);
        return res.status(500).send(err);
      }
    });
   

   

  

    //post
    app.post("/addplans", async (req, res) => {
      await bikes_model.insertOne(req.body);
      res.send("added");
    });

    //post

    app.post("/saveplan", async (req, res) => {
      try {
        const plan = await purchase_model.insertOne(req.body);
        const { email, text } = req.headers;
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "clubpj38@gmail.com",
            pass: "xbltifhcpmxrhjbc",
          },
        });

        var mailOptions = {
          from: "clubpj38@gmail.com",
          to: email,
          subject: "payment link",
          text: text,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        return res.status(200).send(plan);
      } catch (err) {
        console.log(err);
        return res.status(500).send(err);
      }
    });

    app.get("/plans/:uid", async (req, res) => {
      try {
        const plans = await purchase_model.find({ uid: req.params.uid }).toArray();
        return res.status(200).send(plans);
      } catch (err) {
        console.log(err);
        return res.status(500).send(err);
      }
    });

   
    // add user info
    app.post("/users", async (req, res) => {
      const result = await usersCallection.insertOne(req.body);
      res.send(result);
    });

    // make Admin
    app.put("/makeAdmin", async (req, res) => {
      const filter = { email: req.body.email };
      const documents = await usersCallection.updateOne(filter, {
        $set: { role: "admin" },
      });
      res.send(documents);
    });

    //chack Admin

    app.get("/checkAdmin/:email", async (req, res) => {
      const user = await usersCallection.findOne({
        email: req.params.email,
        role: "admin",
      });
      if (user) {
        return res.status(200).send(true);
      }
      return res.status(200).send(false);
    });


    app.get("/planDetails/:id", async (req, res) => {
      try {
        console.log(req.params.id);
        const plan = await bikes_model.findOne({
          _id: ObjectId(req.params.id),
        });
        console.log(plan);
        res.send(plan);
      } catch (er) {
        console.log(er);
      }
    });

    app.get("/user", async (req, res) => {
      try {
        const user = await usersCallection.findOne({ uid: req.body.uid });
        res.send(user);
      } catch (err) {
        console.log(err);
      }
    });

    app.post("/createPayment", async (req, res) => {
      const amount = req.body.price * 100;
      console.log(amount);
      const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: amount,
        payment_method_types: ["card"],
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    });

    console.log("helllo world");
  } catch (err) {
    console.log(err);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log("my server is runningin port 5000");
});

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
    const bikes_name = database.collection("addBikes");
    const purchase_model = database.collection("purchase");
    const dataInput_model = database.collection("dataInput");
    const Buyer_Details = database.collection("BuyerDetails");
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

    // purchase post

    app.post("/purchase", async (req, res) => {
      await purchase_model.insertOne(req.body);
      return res.status(200).send("inserted");
    });

    // purchase post
    app.post("/dataInput", async (req, res) => {
      await dataInput_model.insertOne(req.body);
      return res.status(200).send("inserted");
    });
    // dataInput get
    app.get("/dataInput", async (req, res) => {
      try {
        console.log(req.body);
        const dataInput = await dataInput_model.find({}).toArray();
        return res.status(200).send(dataInput);
      } catch (err) {
        console.log(err);
        return res.status(500).send(err);
      }
    });

    //Buyer Details post

    app.post("/BuyerDetails", async (req, res) => {
      await Buyer_Details.insertOne(req.body);
      return res.status(200).send("inserted");
    });

    //Buyer Details get
    app.get("/BuyerDetails", async (req, res) => {
      try {
        console.log(req.body);
        const BuyerDetails = await Buyer_Details.find({
          date: req.body.date,
        }).toArray();
        return res.status(200).send(BuyerDetails);
      } catch (err) {
        console.log(err);
        return res.status(500).send(err);
      }
    });

    // add Bikespost
    app.post("/addBikes", async (req, res) => {
      await bikes_name.insertOne(req.body);
      res.send("added");
    });

    //get
    app.get("/purchase", async (req, res) => {
      const purchase = await purchase_model.find({}).toArray();
      return res.status(200).send(purchase);
    });

    //get
    // app.post("/monthPurchase", async (req, res) => {
    //   var d = new Date();
    //   d.setMonth(d.getMonth() -1);
    //   const monthPurchase = await purchase_model.find({month:req.body.month}).toArray();
    //   return res.status(200).send(monthPurchase);
      
    // });

    app.post("/monthPurchase", async (req, res) => {
      let months = [];

      const monthPurchase = await purchase_model.find({}).toArray();
      for (const data of monthPurchase) {
        let x = data.month;
        if (x) {
          months.push(x);
        }
      }
      let count = {};
      months.forEach(function (i) {
        count[i] = (count[i] || 0) + 1;
      });

      return res.status(200).send(count);
    });
  
    //get newpurhase
    app.post("/newpurhase", async (req, res) => {
      try {
        console.log(req.body);
        const new_purchased = await purchase_model
          .find({ date: req.body.date })
          .toArray();
        return res.status(200).send(new_purchased);
      } catch (err) {
        console.log(err);
        return res.status(500).send(err);
      }
    });

    //get
    app.get("/addBikes", async (req, res) => {
      const purchase = await bikes_name.find({}).toArray();
      return res.status(200).send(purchase);
    });

    // delete Api
    app.delete("/addBikes/:id", async (req, res) => {
      const bikeId = req.params.id;
      console.log(bikeId);
      const qurey = { _id: ObjectId(bikeId) };
      const result = await bikes_name.deleteOne(qurey);
      res.json(result);
    });

    // update name

    app.put("/updateName", async (req, res) => {
      try {
        const { name } = req.body;
        const id = req.query.id;
        console.log(name);
        console.log(id);
        await bikes_name.updateOne(
          { _id: ObjectId(id) },
          { $set: { title: name } }
        );
        return res.status(200).send("Updated name");
      } catch (err) {
        console.log(err);
        return res.status(500).send(err);
      }
    });
    // update imge

    app.put("/updateImage", async (req, res) => {
      try {
        const { imageUrlsname } = req.body;
        const id = req.query.id;
       
        await bikes_name.updateOne(
          { _id: ObjectId(id) },
          { $set: { imageUrls } }
        );
        return res.status(200).send("Updated image");
      } catch (err) {
        console.log(err);
        return res.status(500).send(err);
      }
    });
    // update form

    app.put("/updaateForm", async (req, res) => {
      try {
        const {
          _id,
          ownerName,
          email,
          addres,
          companyName,
          nationalIdNumber,
          ragistrationNumber,
          mobileNumber,
          date,
          rc
        } = req.body;
        
        await purchase_model.updateOne(
          { _id: ObjectId(_id) },
          {
            $set: {
              ownerName,
              email,
              addres,
              companyName,
              nationalIdNumber,
              ragistrationNumber,
              mobileNumber,
              date,
              rc
            },
          }
        );
        return res.status(200).send("Updated form");
      } catch (err) {
        console.log(err);
        return res.status(500).send(err);
      }
    });

    //GET

    app.get("/plans/:uid", async (req, res) => {
      try {
        const plans = await purchase_model
          .find({ uid: req.params.uid })
          .toArray();
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
// get
    app.get("/user", async (req, res) => {
      try {
        const user = await usersCallection.findOne({ uid: req.body.uid });
        res.send(user);
      } catch (err) {
        console.log(err);
      }
    });



// get admin
    app.get("/admin", async (req, res) => {
      try {
        const user = await usersCallection.find({role:"admin"}).toArray();
        res.send(user);
      } catch (err) {
        console.log(err);
      }
    });
// delete admin

app.delete("/admin/:id", async (req, res) => {
  const adminId = req.params.id;
  console.log(adminId);
  const qurey = { _id: ObjectId(adminId) };
  const result = await usersCallection.updateOne(qurey,{ $set: { role:null },})

  res.json(result);
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

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const jsonParser = express.json();

// Connection URL
const url = 'mongodb://localhost:27017/clinicsdb';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log("Підключення до серверу...");
});

const clinicSchema = new mongoose.Schema({
name: String,
rating: Number,
type: String
});

const Clinic = mongoose.model('Clinic', clinicSchema);

app.use(express.static(__dirname + "/public"));

app.get("/api/clinics", async function (req, res) {
let clinics = await Clinic.find({});
res.send(clinics);
});

app.get("/api/clinics/:id", async function (req, res) {
let clinic = await Clinic.findById(req.params.id);
res.send(clinic);
});

app.post("/api/clinics", jsonParser, async function (req, res) {

if (!req.body) return res.sendStatus(400);

const clinicName = req.body.name;
const clinicRating = req.body.rating;
const clinicType = req.body.type;

const clinic= new Clinic({ name: clinicName, rating: clinicRating, type: clinicType });

let insertedClinic = await clinic.save();

res.send(insertedClinic);
});

app.delete("/api/clinics/:id", async function (req, res) {
const deletedClinic = await Clinic.findByIdAndDelete(req.params.id);
res.send(deletedClinic);
});

app.put("/api/clinics", jsonParser, async function (req, res) {
if (!req.body) return res.sendStatus(400);

const id = req.body.id;
const clinicName = req.body.name;
const clinicRating = req.body.rating;
const clinicType = req.body.type;

const updatedClinic = await Clinic.findByIdAndUpdate(id, { name: clinicName, rating: clinicRating, type: clinicType }, { new: true });

res.send(updatedClinic);
});

process.on("SIGINT", () => {
mongoose.connection.close();
process.exit();
});

app.listen(3000, function () {
console.log("Listening on port 3000...");
});
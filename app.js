const express = require('express');
const path =  require('path');
const  mongoose = require('mongoose');
const methodOverride = require('method-override')
const Doctor = require('./models/doctor');
const Appointment = require('./models/appointment');


mongoose.connect('mongodb://localhost:27017/notable', {//name should be lowercase of ur main model aka myObject in lowercase
    useNewUrlParser : true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
    //useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connections error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views' , path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true})) //Needed to parse req body
app.use(methodOverride('_method')) //Override methods bc forms only get POST AND GET request from the browsers
app.get('/', (req,res) =>{
    res.render('home')
})


//Action: INDEX - Show all doctors
app.get('/doctors', async (req,res) =>{
    const doctors = await Doctor.find({});
    res.send(doctors)
    //res.render('doctors/index', {doctors})
})


//Action: Create - Create new appointment for a doctor
app.post('/doctors/:id/appointments', async (req,res) =>{
    const doctor = await Doctor.findById(req.params.id);
    console.log(req.body);
    const {q} = req.query;
    res.send(q);
    // if(!q){
    //     res.send('Please Include a <Date>')
    // }
    // const appointment = new Appointment(q[appt]);
    // doctor.appointment.push(appointment);
    // await appointment.save();
    // await doctor.save();

})



//Routes with Front-End forms to pass data to POST requests
//Action: New - Displays create item form
app.get('/doctors/new', (req,res) =>{
    res.render('doctors/new')
})

//Action: SHOW - Show item with :id
app.get('/doctors/:id', async (req,res) =>{
    const doctor = await Doctor.findById(req.params.id)
    res.send(doctor)
    //res.render('doctors/show', {doctor})
})

//Action: Create - Creates one item 
//Sets up the Endpoint as a POST where the form is submitted to
app.post('/doctors', async (req,res) =>{
    const doctor = new Doctor(req.body.doctor);
    await doctor.save();
    res.redirect(`/doctors/${doctor._id}`)
})

//Action: Edit - Show edit form with item with :id
app.get('/doctors/:id/edit', async (req,res) =>{
    const doctor = await Doctor.findById(req.params.id)
    res.render('doctors/edit', {doctor})
})

//Action: Update - Update item with :id
app.put('/doctors/:id', async (req,res) =>{
    const {id} = req.params;
    const doctor = await Doctor.findByIdAndUpdate(id, {...req.body.doctor}); //Updates and saves
    res.redirect(`/doctors/${doctor._id}`)
})

//Action: Delete - Delete item with :id
app.delete('/doctors/:id', async (req,res) => {
    const {id} = req.params;
    await Doctor.findByIdAndDelete(id);
    res.redirect('/doctors');
})

//DELETE FORM WILL BE IN THE SHOW PAGE

app.listen(3000, ()=>{
    console.log('Serving on port 3000')
})
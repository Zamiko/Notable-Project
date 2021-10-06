const express = require('express');
const  mongoose = require('mongoose');

const Doctor = require('./models/doctor');
const Appointment = require('./models/appointment');
const bodyParser = require('body-parser');

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

//Middleware
app.use(bodyParser.json()); // Needed to parse body (Passing data thru Postman)


///////////////// Doctors /////////////////
//Action: INDEX - Show all doctors
app.get('/doctors', async (req,res) =>{
    const doctors = await Doctor.find({});
    res.send(doctors)
})

/
///////////////// APOINTMENTS /////////////////
//Action: INDEX - Show all doctors appointments with specific date in query 'date'
app.get('/doctors/:id/appointments', async (req,res) =>{
    const doctor = await Doctor.findById(req.params.id).populate('appointments')
    const {date} = req.query;
    const input_date = new Date(date);
    var day = input_date.getUTCDate();
    var month = input_date.getUTCMonth() + 1; // Since getUTCMonth() returns month from 0-11 not 1-12
    var year = input_date.getUTCFullYear();
    var input_date_str = month + "/" + day + "/" + year;


    var output = {
        appointments: [],
    };
    //Month/day/year
    //00/00/0000
    console.log(input_date)
    console.log(input_date_str)
    
    for(let appt of doctor.appointments){
        console.log(appt)
        day = appt.date.getUTCDate();
        month = appt.date.getUTCMonth() + 1; // Since getUTCMonth() returns month from 0-11 not 1-12
        year = appt.date.getUTCFullYear();
        const appt_date = month + "/" + day + "/" + year;


        console.log(appt_date)
        if(appt_date == input_date_str){
            output.appointments.push(appt);
        }
    }
    res.send(output);
})

//Action: Create - Creates an appointment for a doctor
app.post('/doctors/:id/appointments', async (req,res) =>{
    const doctor = await Doctor.findById(req.params.id)
    const appointment = new Appointment(req.body.appointment)
    doctor.appointments.push(appointment);
    await appointment.save();
    await doctor.save();
    res.send(req.body);

})

//Action: Delete - Delete an appointment from a doctors calendar
app.delete('/doctors/:id/appointments/:apptid', async (req,res) => {
    const {id, apptid} = req.params;
    const appt = await Appointment.findById(apptid)

    await Doctor.findByIdAndUpdate(id, {$pull : {appointments: apptid}})
    await Appointment.findByIdAndDelete(apptid);
    res.send(appt);
})


app.listen(3000, ()=>{
    console.log('Serving on port 3000')
})
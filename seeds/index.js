const  mongoose = require('mongoose');
const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment');

//seed data
var names = require('./names.json')
var first = require('./first-names.json')

mongoose.connect('mongodb://localhost:27017/notable', {
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



function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const sample = array => array[Math.floor(Math.random() * array.length)];



const seedDB = async () => {
    //delete everything
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    //Make new doctors
    for(let i=0; i<10; i++){

        const appointment = new Appointment({
            date: randomDate(new Date(2021, 11, 1), new Date(2022, 12,31)),
            patient_name: `${sample(first)} , ${sample(names)}`,
            kind: `${sample(['New Patient', 'Follow Up'])}`
        });

        const doctor = new Doctor({
            name: `${sample(first)} , ${sample(names)}`,
            appointments: [
                appointment
            ],
            
        })

        await doctor.save();
        await appointment.save();
    }
}


seedDB().then(() => {
    console.log('Seeded the database ...')
    mongoose.connection.close()
})
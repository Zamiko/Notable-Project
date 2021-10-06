const  mongoose = require('mongoose');
const Schema = mongoose.Schema;


const  AppointmentSchema = new Schema({
    date: Date,
    patient_name: String,
    kind: String
});

module.exports =  mongoose.model('Appointment', AppointmentSchema);
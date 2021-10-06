const  mongoose = require('mongoose');
const Schema = mongoose.Schema;


const  DoctorSchema = new Schema({
    name: String,
    appointments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Appointment'
        }
    ]
});

module.exports =  mongoose.model('Doctor', DoctorSchema);
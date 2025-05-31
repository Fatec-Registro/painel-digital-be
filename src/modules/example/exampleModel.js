import mongoose from "mongoose";

//Documento aninhado
const addressSchema = new mongoose.Schema({
    country: String,
    state: String,
    city: String,
    district: String
});

//Documento
const exampleSchema = new mongoose.Schema({
    name: String,
    year: Number,
    typeUser: String,
    address: [addressSchema],
    dateOfBirth: Date
});

const Example = mongoose.model('Example', exampleSchema)
export default Example
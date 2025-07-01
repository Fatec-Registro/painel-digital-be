import mongoose, { Schema, model, Document } from "mongoose";

// Interface para o Endereço
interface IAddress {
  country: string;
  state: string;
  city: string;
  district: string;
}

// Interface para o documento principal de Exemplo 
interface IExample extends Document {
  name: string;
  age: number;
  typeUser: string;
  address: IAddress[];
  dateOfBirth: Date;
}

// Schema para o documento aninhado
const addressSchema: Schema<IAddress> = new Schema({
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true }
});

// Schema para o documento principal
const exampleSchema: Schema<IExample> = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    typeUser: { type: String, required: true },
    address: [addressSchema],
    dateOfBirth: { type: Date, required: false }
});

const Example = model<IExample>('Example', exampleSchema);

export { IExample, addressSchema, exampleSchema };
export default Example;

import exampleService from "./exampleService.js";
import { createExampleSchema, updateExampleSchema } from "./exampleDTO.js";
import { ObjectId } from "mongodb";
import { ZodError } from "zod/v4";

const getAllExample = async(req, res) => {
    try{
        const examples = await exampleService.getAll();
        return res.status(200).json({ examples: examples }); // Cód. 200 (OK)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error"}); // Cód. 500 (Internal Server Error)
    }
};

const createExample = async(req, res) => {
    try{
        const parsedData = createExampleSchema.parse(req.body);
        const example = await exampleService.create(parsedData);
        res.status(201).json({ example }); // Cód. 201 (Created)
    } catch (error) {
        console.log(error);
        if (error instanceof ZodError){ // Validação do body, com Zod
            return res.status(400).json({ error: error.errors }); // Cód. 400 (Bad Request)
        }
        res.status(500).json({ error: "Internal Server Error" }); // Cód. 500 (Internal Server Error)
    }
};

const deleteExample = async(req, res) => {
    try{
        if(ObjectId.isValid(req.params.id)){
            const id = req.params.id;
            await exampleService.delete(id);
            res.sendStatus(204) // Cód. 204 (No Content)
        } else {
            res.status(400).json({ error: "Bad Request"}) // Cód. 400 (Bad Request)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal Server Error"}); // Cód. 500 (Internal Server Error)
    }
};

const updateExample = async(req, res) => {
    try{
        if(ObjectId.isValid(req.params.id)){
            const id = req.params.id;
            const parsedData = updateExampleSchema.parse(req.body);
            const example = await exampleService.update(id, parsedData);
            res.status(200).json({ example }); // Cód. 200 (OK)
        } else {
            res.status(400).json({error: "Bad Request"}); // Cód. 400 (Bad Request)
        }
    } catch (error){
        if(error.errors){
            return res.status(400).json({ error:error.errors }); // Cód. 400 (Bad Request)
        }
        res.status(500).json({error: "Internal Server Error"}); // Cód. 500 (Internal Server Error)
    }
};

const getOneExample = async(req, res) => {
    try{
        if(ObjectId.isValid(req.params.id)){
            const id = req.params.id;
            const example = await exampleService.getOne(id);
            if(!example){
                res.status(404).json({ error: "Not Found" }); // Cód. 404 (Not Found)
            } else {
                res.status(200).json({ example }); // Cód. 200 (OK)
            }
        } else {
            res.status(400).json({ error: "Bad Request"}) // Cód. 400 (Bad Request)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" }); // Cód. 500 (Internal Server Error)
    }
};


export default { getAllExample, createExample, deleteExample, updateExample, getOneExample };


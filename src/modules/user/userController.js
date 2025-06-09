import { createUserSchema, updateUserSchema } from "./userDTO.js";
import userService from "./userService.js";
import { ObjectId } from "mongodb";
import { ZodError } from "zod";

const getAllUsers = async(req, res) => {
    try{
        const users = await userService.getAll();
        return res.status(200).json({ users: users });
    } catch(error){
        console.log(error);
        res.status(500).json({ error: "Internal Server Error"});
    }
};

const createUser = async (req, res) => {
    try{
        const parsedData = createUserSchema.parse(req.body);
        await userService.create(parsedData);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        if (error instanceof ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        if (error.code === 11000 &&  error.keyPattern?.email){
            return res.status(400).json({error:"Email já cadastrado."});
        }
        res.status(500).json({ error: "Erro interno no Servidor."});
    }
};

const deleteUser = async (req, res) => {
    try{
        if(ObjectId.isValid(req.params.id)){
            const id = req.params.id;
            await userService.delete(id);
            res.sendStatus(204) // Cód. 204 (No Content)
        } else {
            res.status(400).json({ error: "Bad Request"}) // Cód. 400 (Bad Request)
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"}); // Cód. 500 (Internal Server Error)
    }
};

const updateUser = async (req, res) => {
    try{
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Bad Request" }); // Cód. 400 (Bad Request)
        }
        const validatedData = updateUserSchema.parse(req.body);
        const user = await userService.update(id, validatedData);
        if (!user) {
            return res.status(404).json({ error: "Not Found" });  // Cód. 404 (Not Found)
        }
        return res.status(200).json({ user }); // Cód. 200 (OK)
    } catch (error) {
        console.log(error);
        if (error.name === "ZodError") {
            return res.status(400).json({ error: error.errors });  // Cód. 404 (Not Found)
        }
        return res.status(500).json({ error: "Internal Server Error" });  // Cód. 500 (Internal Server Error)
    }
};

const getOneUser = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.email)) {
      const email = req.params.email;
      const user = await userService.getOne(email);
      if (!user) {
        res.sendStatus(404); // Cod. 404 (Not Found)
      } else {
        res.status(200).json({ user }); // Cod. 200 (OK)
      }
    } else {
      res.sendStatus(400); // Cod. 400 (Bad Request)
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500); // Cod. 500 (Internal Server Error)
  }
};

export default { getAllUsers, createUser, deleteUser, updateUser, getOneUser };


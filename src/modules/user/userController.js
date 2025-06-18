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
    const validatedData = createUserSchema.safeParse(req.body);
    if ( !validatedData.success ) {
        return res.status(400).json({error: validatedData.error.flatten()}); 
    }
    try {
        const novoUsuario = await userService.create(validatedData.data);
        res.status(201).json({novoUsuario});
    } catch (error) {
        console.log(error);
        if (error instanceof ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteUser = async (req, res) => {
    try{
        if(ObjectId.isValid(req.params.id)){
            const id = req.params.id;
            await userService.delete(id);
            res.sendStatus(204) 
        } else {
            res.status(400).json({ error: "Bad Request"}) 
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"}); 
    }
};

const updateUser = async (req, res) => {
    try{
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Bad Request" }); 
        }
        const validatedData = updateUserSchema.parse(req.body);
        const user = await userService.update(id, validatedData);
        if (!user) {
            return res.status(404).json({ error: "Not Found" });  
        }
        return res.status(200).json({ user }); 
    } catch (error) {
        console.log(error);
        if (error.name === "ZodError") {
            return res.status(400).json({ error: error.errors }); 
        }
        return res.status(500).json({ error: "Internal Server Error" }); 
    }
};

const getOneUser = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userService.getOne(email);
    if (!user) {
      return res.status(404).json({ error: "User Not Found!" }); 
    } else {
      return res.status(200).json({ user }); 
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" }); 
  }
};

export default { getAllUsers, createUser, deleteUser, updateUser, getOneUser };

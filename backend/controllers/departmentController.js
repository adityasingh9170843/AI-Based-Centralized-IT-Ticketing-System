import Department from "../models/departmentModel.js";


export const addDepartment = async(req,res)=>{
    try{
        const {name,description} = req.body;
        const department = await Department.create({name,description});
        res.status(201).json(department);
    }
    catch(error){
        res.status(500).json({error:"Error adding department"});
    }
}


export const getDepartments = async(req,res)=>{
    try{
        const departments = await Department.find({}).populate("engineers","name email");
        res.json(departments);
    }
    catch(error){
        res.status(500).json({error:"Error fetching departments"});
    }
}
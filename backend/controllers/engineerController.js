import Engineer from "../models/engineerModel";
import Department from "../models/departmentModel";
import { addEngineerVector } from "../services/vectorService";


export const addEngineer = async(req,res)=>{
    try{
        const {name,email,departmentId,expertise=[]} = req.body;
        const dept = await Department.findById(departmentId);
        if(!dept){
            return res.status(404).json({error:"Department not found"});
        }

        const engineer = await Engineer.create({name,email,department:dept._id,expertise});
        
        dept.engineers.push(engineer._id);
        await dept.save();

        await addEngineerVector({
            _id:engineer._id,
            name:engineer.name,
            email:engineer.email,
            departmentName:dept.name,
            expertise:engineer.expertise
        });

        res.status(201).json(engineer);
    }
    catch(error){
        res.status(500).json({error:"Error adding engineer"});
    }
}
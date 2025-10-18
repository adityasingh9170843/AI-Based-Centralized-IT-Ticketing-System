import mongoose from "mongoose";

const departmentSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    engineers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Engineer"
        }
    ]
})
const Department = mongoose.model("Department", departmentSchema)
export default Department
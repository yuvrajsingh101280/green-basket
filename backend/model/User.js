import mongoose from "mongoose"


const userSchema = new mongoose.Schema({


    name: {


        type: String, required: true

    },
    email: {

        type: String,
        required: true,
        unique: true,

    },

    password: {

        type: String,

        required: true,
    },
    phone: {

        type: String,
        required: true,
        unique: true,

    },


    profilePic: {
        type: String
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"

    },
    address: {
        type: String,

    },

    isVerified: { type: Boolean, default: false },






}, { timestamps: true })


const User = new mongoose.model("User", userSchema)

export default User
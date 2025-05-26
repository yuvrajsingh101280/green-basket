import User from "../model/User.js"
import bcrypt, { genSalt } from "bcryptjs"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"
import { isValidPhoneNumber } from 'libphonenumber-js'
import { sendOTP, verifyOTP } from "../config/twilioClient.js"
import { v2 as cloudinary } from "cloudinary"



export const register = async (req, res) => {


    try {

        const { name, email, password, phone } = req.body
        // validation


        if (!email || !password || !name || !phone) {

            return res.status(400).json({ success: false, messsage: "All fields are required" })
        }

        // check if the user already exist

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ success: false, message: "User already exist" })

        }
        // check with phone number also


        const existingUser = await User.findOne({ phone })
        if (existingUser) {

            return res.status(400).json({ success: false, message: "Phone number is already used please use different phone number" })

        }
        // check the valid email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" })

        }
        // check the password
        if (password.length < 6) {

            return res.status(400).json({ success: false, message: "Password should have a minimum 6 charater length" })

        }

        // check phone number validity for all country formats
        if (!isValidPhoneNumber(phone)) {
            return res.status(400).json({ success: false, message: "Invalid phone number format" });
        }
        const genSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, genSalt)
        // creating random avatar
        const index = Math.floor(Math.random() * 100) + 1 //generates a number between 1-100
        const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`
        const newUser = await User.create({ name, email, password: hashedPassword, phone, profilePic: randomAvatar })

        generateTokenAndSetCookie(newUser._id, res)
        res.status(200).json({ success: true, message: "User created but not verified . Please verify with otp" })

    } catch (error) {

        console.log("Error in creating the user ", error)
        return res.status(500).json({ success: false, message: "Internal server error" })



    }



}

export const generateOTP = async (req, res) => {

    try {
        const phone = req.user.phone

        const otpResponse = await sendOTP(phone)


        res.status(200).json({ success: true, message: "otp send successfully", sid: otpResponse.sid })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Failed to send otp" })
    }


}

export const verification = async (req, res) => {

    try {
        const { otp } = req.body
        const phone = req.user.phone
        const user = await User.findOne({ phone })
        if (!user) {


            return res.status(400).json({ success: false, message: "User not found" })
        }




        const verification = await verifyOTP(phone, otp)

        if (verification.status !== "approved") {

            return res.status(400).json({ success: false, message: "OTP is expired" })

        }

        user.isVerified = true
        await user.save()
        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            success: true, message: "Verified successfully", user: {
                ...user._doc, password: undefined

            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Verified unsuccefull" })
    }









}

export const updateProfilePicture = async (req, res) => {

    try {

        const userId = req.user._id
        const image = req.file


        if (!image) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }
        const user = await User.findById(userId)

        if (!user) {

            return res.status(400).json({ success: false, message: "User not found" })

        }


        const upload = await cloudinary.uploader.upload(image.path)

        const profilePic = upload.secure_url

        await User.findByIdAndUpdate(userId, { profilePic }, { new: true })


        res.status(200).json({ success: true, message: "Profile photo update" })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: "Profile photo not updated" })
    }

}
export const login = async (req, res) => {

    try {
        // login using email and passowrd
        const { email, password } = req.body

        if (!email || !password) {

            return res.status(400).json

        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" })

        }
        // check the password
        if (password.length < 6) {

            return res.status(400).json({ success: false, message: "Password should have a minimum 6 charater length" })

        }



        const user = await User.findOne({ email })
        if (!user) {


            return res.status(200).json({ success: false, message: "User not found" })

        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {

            return res.status(400).json({ success: false, message: "Invalid credentials" });


        }
        if (!user.isVerified) {


            return res.status(400).json({ success: false, message: "You are not verifed please verify yourself" })

        }



        generateTokenAndSetCookie(user._id, res)
        res.status(200).json({
            success: true, message: "User logged in ...............", user: {

                ...user._doc, password: undefined


            }
        })
    } catch (error) {

        console.log(error)
        return res.status(500).json({ success: false, message: "Error in loggin" })

    }


}


export const loginViaOTP = async (req, res) => {
    try {

        const { phone } = req.body


        if (!phone) {

            return res.status(400).json({ success: false, message: "Please Provide the phone  number" })


        }


        // if (!isValidPhoneNumber(phone)) {

        //     return res.status(400).json({ success: false, message: "Please enter a valid phone number" })


        // }
        const user = await User.findOne({ phone })
        if (!user) {

            return res.status(400).json({ success: false, message: "User not found" })

        }
        await sendOTP(phone)
        res.status(200).json({ success: true, message: "OTP send successfully" })


    } catch (error) {
        console.log(error)


        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }






}
export const verifyLoginOTP = async (req, res) => {
    try {
        const { otp, phone } = req.body

        const user = await User.findOne({ phone })

        if (!user) {

            return res.status(400).json({ success: false, message: "User not found" })

        }
        if (!otp) {

            return res.status(400).json({ success: false, message: "please provide the otp" })


        }
        const verification = await verifyOTP(phone, otp)

        if (!verification.status == "approved") {

            return res.status(400).json({ success: false, message: "opt is expired" })

        }

        if (!user.isVerified) {
            user.isVerified = true;
            await user.save();
        }
        generateTokenAndSetCookie(user._id, res)
        res.status(200).json({ success: true, message: "Logged in succefull" })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }

}
export const logout = async (req, res) => {


    try {
        res.clearCookie("token")
        res.status(200).json({ success: true, message: "Logged out" })

    } catch (error) {

        console.log(error)
        return res.status(500).json({ success: false, message: "Logged out unsuccessfull" })

    }
}

// forget password

export const forgetPassword = async (req, res) => {

    try {
        const { phone } = req.body

        const user = User.findOne({ phone })
        if (!user) {



            res.status(400).json({ succcess: false, message: "User not found" })
        }
        await sendOTP(phone)

        res.status(200).json({ success: true, message: "A verification otp send successfull" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }


}


export const resetPassword = async (req, res) => {

    try {
        const { otp, phone, newPassword } = req.body


        // if (!newPassword.length < 6) {

        //     return res.status(400).json({ success: false, message: "Minimum length should be 6 character" })

        // }
        // if (!otp) {

        //     return res.status(400).json({ success: false, message: "Please enter otp" })

        // }



        const user = await User.findOne({ phone })
        if (!user) {



            res.status(400).json({ succcess: false, message: "User not found" })
        }
        const verification = await verifyOTP(phone, otp)

        if (!verification.status == "approved") {
            return res.status(400).json({ success: false, message: "Invalid otp it is expired" })



        }


        if (verification.status === "approved") {


            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword, salt)

            user.save()


        }

        res.status(200).json({ success: true, message: "Password update successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }

}
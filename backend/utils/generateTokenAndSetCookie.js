import jwt from "jsonwebtoken"

export const generateTokenAndSetCookie = (userId, res) => {

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.cookie("token", token, {



        httpOnly: true,//prevent XSS attack
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"


    })
}
import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/user.js"
import bcrypt from "bcryptjs"

export const signup = async(req,res) => {
    const {name, email, password, bio} = req.body

    try{
        if(!name || !email || !password || !bio){
            return res.json({
                success: false,
                message: 'Missing details'
            })
        }

        const user = await User.findOne({email})
        if(user){
            return res.json({
                success: false,
                message: 'User already exists'
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            name, 
            email, 
            password: hashedPassword, 
            bio
        })

        const token = generateToken(newUser._id)

        return res.json({
            success: true,
            userData: newUser, 
            token, 
            message: 'Account created successfully'
        })
    }
    catch(error){
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export const login = async(req,res) => {
    const {email, password} = req.body

    try{
        if(!email || !password){
            return res.json({
                success: false,
                message: 'Missing details'
            })
        }

        const user = await User.findOne({email})
        if(!user){
            return res.json({
                success: false,
                message: 'User does not exist'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({
                success: false,
                message: 'Invalid Password'
            })
        }

        const token = generateToken(user._id)
        return res.json({
            success: true,
            userData: user,
            token,
            message: 'Login Successful'
        })
    }
    catch(error){
        console.log(error.message)
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export const checkAuth = async(req,res) => {
    return res.json({
        success: true,
        user: req.user
    })
}

export const updateProfile = async(req,res) => {
    const {profilePic, bio, name} = req.body

    try{
        const userId = req.user._id
        let updateUser
        
        if(!profilePic){
            updateUser = await User.findByIdAndUpdate(userId, {bio, name}, {new: true})
        }
        else{
            const upload = await cloudinary.uploader.upload(profilePic)
            updateUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, name}, {new: true})
        }
        return res.json({
            success: true,
            user: updateUser
        })
    }
    catch(error){
        console.log(error.message)
        return res.json({
            success: false,
            message: error.message
        })
    }
}
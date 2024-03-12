const { userModel } = require("../model/usermodel")
const { registerValidation, loginvalidation, postvalidation } = require("../middleware/validation")
const HTTP = require("../../constants/responseCode.constant")
const bcrypt = require('bcrypt')
const Post = require("../model/postmodel")
const jwt = require('jsonwebtoken');
const { getLocation } = require("../../public/getlocation");


const Register = async (req, res) => {
    try {
        const { error, value } = registerValidation.validate(req.body);
        if (error) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, msg: error.details[0].message.replace(/\"/g, '') });
        const finemail = await userModel.findOne({ email: value.email });
        if (finemail) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, msg: "This Email Is Already Register !" });
        const bpass = await bcrypt.hash(value.password, 10);
        const obj = new userModel({ ...value, password: bpass }).save()
        return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, msg: "Register Successfully", obj })
    } catch (error) {
        console.log("🚀 ~ Register ~ error:", error)
        return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.INTERNAL_SERVER_ERROR, msg: "Something Went Wrong", error: error.message })
    }
}


const login = async (req, res) => {
    try {
        const { error, value } = loginvalidation.validate(req.body);
        if (error) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, msg: error.details[0].message.replace(/\"/g, '') });
        const findUser = await userModel.findOne({ email: value.email })
        if (!findUser) return res.status(401).send({ status: false, msg: "Email Is Not Existing" })
        bcrypt.compare(value.password, findUser.password, async (err, result) => {
            if (result === true) {
                const token = jwt.sign({ _id: findUser._id }, process.env.SECRET_KEY)
                return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, msg: "Login Successfully !", token: token })
            }
            else {
                return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, msg: "Please Enter a Valid Password !" })
            }
        })

    } catch (error) {
        return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.INTERNAL_SERVER_ERROR, msg: "Something Went Wrong", error: error.message })
    }
}

const create_post = async (req, res) => {
    try {
        const { error, value } = postvalidation.validate(req.body);
        if (error) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, msg: error.details[0].message.replace(/\"/g, '') });
        const { title, body, active } = req.body;
        const getdata = await getLocation(value.address)
        const post = new Post({
            title,
            body,
            active,
            createdBy: req.user._id,
            location: {
                lat: getdata.lat,
                long: getdata.lng
            },
        }).save();
        return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, msg: "Post Created Successfully" })

    } catch (error) {
        return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.INTERNAL_SERVER_ERROR, msg: "Something Went Wrong", error: error.message })
    }
}

const get_post = async (req, res) => {
    try {
        const findpost = await Post.find({ createdBy: req.user._id })
        if (findpost.length < 0) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.NOT_FOUND, msg: "Post Not Found" })
        return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, msg: "Post Show", data: findpost })

    } catch (error) {
        return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.INTERNAL_SERVER_ERROR, msg: "Something Went Wrong", error: error.message })
    }
}

const delete_post = async (req, res) => {
    try {
        const findpost = await Post.findById(req.params.id)
        if (!findpost) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.NOT_FOUND, msg: "Post Not Found" })
        await Post.findByIdAndDelete(req.params.id)
        return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, msg: "Post Delete Succesfull !" })
    } catch (error) {
        return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.INTERNAL_SERVER_ERROR, msg: "Something Went Wrong", error: error.message })
    }
}

const update_post = async (req, res) => {
    try {
        const { title, body, active, address } = req.body;
        let location
        if (address) {
            const getdata = await getLocation(address)
            location = {
                lat: getdata.lat,
                long: getdata.lng
            }
        }
        await Post.findByIdAndUpdate(req.params.id, {
            $set: {
                title,
                body,
                active,
                createdBy: req.user._id,
                location: location
            }
        })
        return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, msg: "Post Update Successfully" })
    } catch (error) {
        return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.INTERNAL_SERVER_ERROR, msg: "Something Went Wrong", error: error.message })
    }
}
const retrieve_post_user = async (req, res) => {
    try {
        const { lat, long } = req.body;
        const query = {
            createdBy: req.user.id,
            'location.lat': { $gte: parseFloat(lat) - 0.1, $lte: parseFloat(lat) + 0.1 },
            'location.long': { $gte: parseFloat(long) - 0.1, $lte: parseFloat(long) + 0.1 }
        };
        const posts = await Post.find(query);
        return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, msg: "posts",posts })
    } catch (error) {
        return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.INTERNAL_SERVER_ERROR, msg: "Something Went Wrong", error: error.message })
    }
}


const retrieve_post_alluser = async (req, res) => {
    try {
        const { lat, long } = req.body;
        const query = {
            'location.lat': { $gte: parseFloat(lat) - 0.1, $lte: parseFloat(lat) + 0.1 },
            'location.long': { $gte: parseFloat(long) - 0.1, $lte: parseFloat(long) + 0.1 }
        };
        const posts = await Post.find(query);
        return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, msg: "posts",posts })
    } catch (error) {
        return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.INTERNAL_SERVER_ERROR, msg: "Something Went Wrong", error: error.message })
    }
}

const dashboard_user = async (req, res) => {
    try {
        const activeCount = await Post.countDocuments({ active: true, createdBy: req.user._id });
        const inactiveCount = await Post.countDocuments({ active: false, createdBy: req.user._id });
        return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, activeCount: activeCount, inactiveCount: inactiveCount });
    } catch (error) {
        return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.INTERNAL_SERVER_ERROR, msg: "Something Went Wrong", error: error.message })
    }
};


const dashboard = async (req, res) => {
    try {
        const activeCount = await Post.countDocuments({ active: true });
        const inactiveCount = await Post.countDocuments({ active: false });
        return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, activeCount: activeCount, inactiveCount: inactiveCount });
    } catch (error) {
        return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.INTERNAL_SERVER_ERROR, msg: "Something Went Wrong", error: error.message })
    }
};


module.exports = {
    Register,
    login,
    create_post,
    update_post,
    get_post,
    delete_post,
    dashboard_user,
    dashboard,
    retrieve_post_user,
    retrieve_post_alluser
}
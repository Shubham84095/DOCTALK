import jwt from 'jsonwebtoken'
import 'dotenv/config.js'


// doctor authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        const dToken = req.headers.dtoken;
        // console.log("dToken from auth", dToken)

        if (!dToken) {
            return res.status(401).json({ success: false, message: "Not Authorized, Please Login again" });
        }

        const token_decode = jwt.verify(dToken, process.env.JWT_SECRET);
        // console.log("token decode", token_decode)
        req.docId = token_decode.id;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: error.message });
    }
};

export default authDoctor
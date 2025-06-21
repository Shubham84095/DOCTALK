import jwt from 'jsonwebtoken'
import 'dotenv/config.js'


// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        
        const {atoken} = req.headers;
        // console.log(atoken)

        if(!atoken){
            return res.json({success: false, message: "Not Authorized, Please Login again"});
        }
    
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
        if(token_decode != process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.json({success: false, message: "Not Authorized, Please Login again"});
        }

        next();

    } catch (error) {
        console.log(error);
        res.json({success: false, message : error.message});
    }
}

export default authAdmin
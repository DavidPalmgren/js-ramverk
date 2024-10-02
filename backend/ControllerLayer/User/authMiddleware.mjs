import jwtToken from "../ApplicationLayer/Token/jwtToken.mjs";

export default (req, res, next) => {
    const token = req.headers['token'];
    const decoded = jwtToken.verify(token);
    console.log(decoded);

};
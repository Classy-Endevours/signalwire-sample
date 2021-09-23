import { verify, sign } from "jsonwebtoken";

class Authentication {
  authenticate = (token, role) => {
    return new Promise((resolve, reject) => {
      verify(token, role, function (err, decoded) {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  };
  generateToken = (role, payload) => {
    let token = sign(payload, role);
    return token;
  };
}
export default new Authentication();

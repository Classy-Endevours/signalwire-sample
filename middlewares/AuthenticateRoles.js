import { authenticate } from "./../lib/Authentication.js";
const Roles = {
  admin: "admin",
  owner: "owner",
  customer: "customer",
};
class AuthRoles {
  Authenticate = async (req, res, next, role) => {
    try {
      let decode = await authenticate(req.headers.authorization, role);
      req.user = decode;
      next();
    } catch (error) {
      if (error.name == "TokenExpiredError") {
        res.status(498).send({
          message: "Your token is expired!",
        });
      } else {
        res.status(401).send({
          message: "Unauthorized!",
        });
      }
    }
  };
  Any = async (req, res, next) => {
    const roles = Object.values(Roles);
    let isValid = false;
    let err;
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i];
      try {
        let decode = await authenticate(req.headers.authorization, role);
        req.user = decode;
        isValid = true;
        break;
      } catch (error) {
        err = error;
        continue;
      }
    }
    if (isValid) {
      next();
    } else {
      if (err.name == "TokenExpiredError") {
        res.status(498).send({
          message: "Your token is expired!",
        });
      } else {
        res.status(401).send({
          message: "Unauthorized!",
        });
      }
    }
  };
  Customer = (req, res, next) => {
    this.Authenticate(req, res, next, Roles.customer);
  };
  Owner = (req, res, next) => {
    this.Authenticate(req, res, next, Roles.owner);
  };
  Admin = (req, res, next) => {
    this.Authenticate(req, res, next, Roles.admin);
  };
}
export default new AuthRoles();

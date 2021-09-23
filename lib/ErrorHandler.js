const NoDataAvailable = () => {
  const err = new Error("No data available!");
  err.status = 404;
  throw err;
};
const NoUserFound = () => {
  const err = new Error("User not found!");
  err.status = 404;
  throw err;
};

const UserAlreadyExist = () => {
  const err = new Error("User already exist!");
  err.status = 404;
  throw err;
};
const ValidationFail = () => {
  const err = new Error("Validation Fails");
  err.status = 400;
  throw err;
};

export default {
  NoDataAvailable,
  NoUserFound,
  ValidationFail,
  UserAlreadyExist,
};

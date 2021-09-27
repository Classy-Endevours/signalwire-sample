import { Router } from "express";
import {
  MainMenu,
  Transcription,
  MMVResponse,
  Recording,
  Message,
  CommonResponse,
  CallUsers,
} from "../controllers/Signalwire.js";
const router = Router();

// router.use("/callback", Signalwire);
router.get("/main-menu", MainMenu);
router.post("/transcription", Transcription);
router.get("/mmv-response", MMVResponse);
router.get("/recording", Recording);
router.get("/message", Message);
router.get("/response/:question", CommonResponse);

router.get("/call", CallUsers);

router.get("/", function (req, res, next) {
  // const err = new Error('This is root route!')
  // err.status = 404;
  // next(err, req, res, next)
  res.status(200).send("Welcome!");
  // res.status(200).send({ title: 'Express' });
});

export default router;

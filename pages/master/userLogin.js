const router = require("express").Router();
const { User } = require("../../modals/User");
const moment = require("moment");
const userLogin = (req, res) => {
  const data = req.body;
  const errors = {};
  
  if (!data.email || !data.password || data.email === "") {
    errors["inputError"] = "Fields not provided";
  }
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      console.log(user);
    }
    console.log("sen3009",user);

    if (!user || user.active_status ==="N") {
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });
    }

    //new with mode and time check
    // user.comparePassword(req.body.password, (err, isMatch) => {

    //   if (!isMatch)
    //     return res.json({ loginSuccess: false, message: "Wrong password" });

    //   user.weekDays.find(e => (e.ddl_weekDays_id === new Date().getDay())) ?
    //     user.weekDays.map((a, i) => {
    //       if (a.ddl_weekDays_id === new Date().getDay()) {
    //         // current time < start time
    //         // curent time > end time
    //         // console.log("sen1907",((new Date().getTime()) / 1000) < moment(a.txt_Start_time, 'HH:mm').unix())

    //         if (
    //           data.mode === "Web" && a.web_status === true
    //           &&
    //           ((new Date().getTime()) / 1000) > moment(a.txt_Start_time, 'HH:mm').unix()
    //           &&
    //           ((new Date().getTime()) / 1000) < moment(a.txt_End_time, 'HH:mm').unix()
    //         ) {

    //           user.generateToken((err, user) => {
    //             if (err) return res.status(400).send(err);
    //             res.cookie("w_authExp", user.tokenExp);
    //             res.cookie("w_auth", user.token).status(200).json({
    //               loginSuccess: true,
    //               userId: user._id,
    //               userToken: user.token,
    //               user_id: user.user_id,
    //             });
    //           });
    //         } else if (data.mode === "Mobile" && a.app_status === true  
    //         &&
    //         ((new Date().getTime()) / 1000) > moment(a.txt_Start_time, 'HH:mm').unix()
    //         &&
    //         ((new Date().getTime()) / 1000) < moment(a.txt_End_time, 'HH:mm').unix()) 
    //         {
    //           user.generateToken((err, user) => {
    //             if (err) return res.status(400).send(err);
    //             res.cookie("w_authExp", user.tokenExp);
    //             res.cookie("w_auth", user.token).status(200).json({
    //               loginSuccess: true,
    //               userId: user._id,
    //               userToken: user.token,
    //               user_id: user.user_id,
    //             });
    //           });
    //         } else {
    //           return res.json({ loginSuccess: false, message: "Access Not Granted6" });
    //         }
    //       }
    //     })
    //     :
    //     res.json({ loginSuccess: false, message: "Access Not Granted5" })

    // });

    //old
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
          userToken: user.token,
        });
      });
    });
  });
};

module.exports = userLogin;

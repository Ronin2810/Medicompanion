const express = require("express");
const alert = require("alert");
const router = express.Router();
const reg_schema = require("../models/reg_schema");
const meds_schema = require("../models/meds_schema");
const schemes_schema = require("../models/schemes_schema");
const comment_schema = require("../models/comment_schema");
const bcrypt = require("bcrypt");
mailer = require("nodemailer");



let profile = "";
let email_data = "";

// Entry point
router.get("/", (req, res) => {
  res.render("login", { error1: "" });
});

//login page
router.get("/login", (req, res) => {
  res.render("login", { error1: "" });
});

//register page
router.get("/register", (req, res) => {
  res.render("register", { error: "" });
});

//Forgot Password 

function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
router.get("/otp", (req, res) => {
  res.render("otp");
})

let otp = 0;
router.post("/sendotp", (req, res) => {
  const {emailotp} = req.body
  smtpProtocol = mailer.createTransport({
    service: "Gmail",
    auth: {
      user: "adityapatildev2810@gmail.com",
      pass: "lfqsebfbrmkfixig",
    },
  });
  otp = between(1000, 9999);
  var mailoption = {
    from: "adityapatildev2810@gmail.com",
    to: emailotp,
    subject: "One Time Password",
    html: `Hello user. Your one time password is <b>${otp}</b>`,
  };
  smtpProtocol.sendMail(mailoption, function (err, response) {
    if (err) {
      console.log(err);
    }
    console.log("Message Sent" + response.message);
    smtpProtocol.close();
  });
  res.render("otp1");
})

router.post("/otpauth", (req, res) => {
  const {otp1} = req.body;
  if (otp1 == otp) {
    res.render("pwdchange");
  }
  else {
    res.end("error");
  }
})

router.post("/pwdchange", (req, res) => {
  const { emailr, npass, npassconf } = req.body;

  if (npass != npassconf) {
    res.end("Error")
  }
  else {
    let hash_new = bcrypt.hashSync(npassconf, 10);
    reg_schema
      .updateOne({ email: emailr }, { $set: { pwd: hash_new } })
      .then(()=>{
        res.render("login" ,{ error1: "Password reset successfully" })
      })
  }
})



//Home
router.get("/home", (req, res) => {
  if (profile === "") {
    res.render("login", { error1: "" });
  }
  res.render("home", { profilename: profile });
});

//About
router.get("/about", (req, res) => {
  if (profile === "") {
    res.render("login", { error1: "" });
  }
  res.render("about", { profilename: profile });
});

//Govt schemes
router.get("/schemes", (req, res) => {
  if (profile === "") {
    res.render("login", { error1: "" });
  }
  schemes_schema
    .find()
    .then((result) => {
      // console.log(result);
      res.render("schemes", { schemes: result, profilename: profile });
    })
    .catch((err) => {
      console.log(err);
      res.render("There was some error");
    });
});

// Brand vs Generic meds
router.get("/meds", async (req, res) => {
  if (profile === "") {
    res.render("login", { error1: "" });
  }
  meds_schema
    .find()
    .then((result) => {
      // console.log(result);
      res.render("meds", { meds: result, profilename: profile });
    })
    .catch((err) => {
      console.log(err);
      res.render("There was some error");
    });
});

//profile page
router.get("/profile", (req, res) => {
  if (profile === "") {
    res.render("login", { error1: "" });
  }
  res.render("profile", { profilename: profile, msg: "" });
});

// update profile form
router.get("/update", (req, res) => {
  if (profile === "") {
    res.render("login", { error1: "" });
  }
  reg_schema
    .findOne({ email: email_data })
    .then((result) => {
      res.render("update", {
        name: result.name,
        addr: result.address,
        st: result.state,
        ct: result.city,
        pno: result.contact,
        ht: result.height,
        wt: result.weight,
        pmh: result.pmh,
        email: result.email,
        profilename: profile,
        pass: "",
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("There was some error");
    });
});

router.get("/pwd", (req, res) => {
  if (profile === "") {
    res.render("login", { error1: "" });
  }
  res.render("pwd", { error: "", profilename: profile });
});

// After Registration form submit
router.post("/register", async (req, res) => {
  try {
    const {
      fullname,
      r1,
      addr,
      st,
      ct,
      pno,
      ht,
      wt,
      bgp,
      pmh,
      emailreg,
      pwdreg,
      pwdregconf,
    } = req.body;

    // add validations here
    if (pwdreg === pwdregconf) {
      let hash_pass = bcrypt.hashSync(pwdregconf, 10);
      data = new reg_schema({
        name: fullname,
        gender: r1,
        address: addr,
        state: st,
        city: ct,
        contact: pno,
        height: ht,
        weight: wt,
        blood: bgp,
        pmh: pmh,
        email: emailreg,
        // pwd: pwdregconf,
        pwd: hash_pass,
      });

      data
        .save()
        .then(() => {
          res.render("login", { error1: "" });
        })
        .catch((err) => {
          console.log("error in inserting into DB");
        });

      const user = reg_schema.findOne({ email: emailreg });
      if (emailreg === user.email) {
        res.render("register", { error: "Cannot register on same email" });
      }
    } else {
      res.render("register", { error: "Passwords aren't matching" });
    }
  } catch (error) {
    console.log(error);
  }
});

// After Login prompt submit
router.post("/home", async (req, res) => {
  const { emaillogin, pwdlogin } = req.body;
  reg_schema
    .findOne({ email: emaillogin })
    .then((result) => {
      console.log(result);
      if (result === null) {
        //wrong email
        res.render("login", { error1: "Wrong Email" });
      }
      // && result.pwd === pwdlogin
      else if (result.email === emaillogin) {
        //success
        if (bcrypt.compareSync(pwdlogin, result.pwd)) {
          email_data = result.email;
          profile = result.name;
          res.render("home", { profilename: profile });
        } else {
          // wrong password
          res.render("login", { error1: "Wrong Password" });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// update changes in mongodb and go to login page
router.post("/update1", (req, res) => {
  const { fullname, r1, addr, st, ct, pno, ht, wt, bgp, pmh, emailreg } =
    req.body;

  //update here
  reg_schema
    .updateOne(
      { email: email_data },
      {
        $set: {
          name: fullname,
          gender: r1,
          address: addr,
          state: st,
          city: ct,
          contact: pno,
          height: ht,
          weight: wt,
          blood: bgp,
          pmh: pmh,
          email: emailreg,
        },
      }
    )
    .then(() => {
      res.render("profile", {
        profilename: profile,
        msg: "Profile updated successfully",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// update password
router.post("/update2", async (req, res) => {
  const { passprev, passnew, passconf } = req.body;
  const user = await reg_schema.findOne({ email: email_data });
  if (!bcrypt.compareSync(passprev, user.pwd)) {
    return res.render("pwd", {
      profilename: profile,
      error: "Wrong previous password",
    });
  } else if (passconf != passnew) {
    return res.render("pwd", {
      profilename: profile,
      error: "Passwords aren't matching",
    });
  }
  //update here
  let hash_new = bcrypt.hashSync(passconf, 10);
  reg_schema
    .updateOne({ email: email_data }, { $set: { pwd: hash_new } })
    .then(() => {
      reg_schema
        .findOne({ email: email_data })
        .then((result) => {
          res.render("update", {
            name: result.name,
            addr: result.address,
            st: result.state,
            ct: result.city,
            pno: result.contact,
            ht: result.height,
            wt: result.weight,
            pmh: result.pmh,
            email: result.email,
            profilename: profile,
            pass: "Password reset successfully",
          });
        })
        .catch((err) => {
          console.log(err);
          res.render("There was some error");
        });
    })
    .catch((err) => {
      console.log(err);
      res.render("There was some error");
    });
});

//bmi calculator
router.get("/bmi", (req, res) => {
  if (profile === "") {
    res.render("login", { error1: "" });
  }
  res.render("bmi", {
    profilename: profile,
    answer: "",
    color: "",
  });
});
// bmi answer
router.post("/bmi-ans", (req, res) => {
  const { height, weight } = req.body;
  let bmi = parseFloat(weight / (height * height));
  let answer = "";
  if (bmi <= 18.5) {
    //underweight
    answer = "Your BMI is " + bmi + "\nYou're underweight!";
    res.render("bmi", {
      profilename: profile,
      answer: answer,
      color: "blue",
    });
  } else if (bmi > 18.5 && bmi <= 24.9) {
    //normal
    answer = "Your BMI is " + bmi + "\nYou're Normal!";
    res.render("bmi", {
      profilename: profile,
      color: "green",
      answer: answer,
    });
  } else if (bmi > 24.9 && bmi < 29.9) {
    //overweight
    answer = "Your BMI is " + bmi + "\nYou're Overweight!";
    res.render("bmi", {
      profilename: profile,
      answer: answer,
      color: "yellow",
    });
  } else if (bmi > 29.9 && bmi < 34.9) {
    //obese
    answer = "Your BMI is " + bmi + "\nYou're Obese!";
    res.render("bmi", {
      profilename: profile,
      answer: answer,
      color: "orange",
    });
  } else if (bmi > 35) {
    //extremely obese
    answer = "Your BMI is " + bmi + "\nYou're Extremely Obese!";
    res.render("bmi", {
      profilename: profile,
      answer: answer,
      color: "red",
    });
  }
});

//Blogs

// #1
router.get("/blog1", (req, res) => {
  if (profile === "") {
    res.render("login", { error1: "" });
  }
  comment_schema
    .find({ blog_id: 1 })
    .then((result) => {
      res.render("../views/blogs/blog1.ejs", {
        profilename: profile,
        comments: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/blog1-r", (req, res) => {
  const { comment } = req.body;
  const data = new comment_schema({
    user: profile,
    data: comment,
    blog_id: 1,
  });
  data
    .save()
    .then(() => {
      comment_schema
        .find({ blog_id: 1 })
        .then((result) => {
          res.render("../views/blogs/blog1.ejs", {
            profilename: profile,
            comments: result,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});


// #2
router.get("/blog2", (req, res) => {
  if (profile === "") {
    res.render("login", { error1: "" });
  }
  comment_schema
    .find({ blog_id: 2 })
    .then((result) => {
      res.render("../views/blogs/blog2.ejs", {
        profilename: profile,
        comments: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/blog2-r", (req, res) => {
  const { comment } = req.body;
  const data = new comment_schema({
    user: profile,
    data: comment,
    blog_id: 2,
  });
  data
    .save()
    .then(() => {
      comment_schema
        .find({ blog_id: 2 })
        .then((result) => {
          res.render("../views/blogs/blog2.ejs", {
            profilename: profile,
            comments: result,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});


// #3
router.get("/blog3", (req, res) => {
  if (profile === "") {
    res.render("login", { error1: "" });
  }
  comment_schema
    .find({ blog_id: 3 })
    .then((result) => {
      res.render("../views/blogs/blog3.ejs", {
        profilename: profile,
        comments: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/blog3-r", (req, res) => {
  const { comment } = req.body;
  const data = new comment_schema({
    user: profile,
    data: comment,
    blog_id: 3,
  });
  data
    .save()
    .then(() => {
      comment_schema
        .find({ blog_id: 3 })
        .then((result) => {
          res.render("../views/blogs/blog3.ejs", {
            profilename: profile,
            comments: result,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

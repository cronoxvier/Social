import * as nodemailer from 'nodemailer';
import { config } from './../config/config';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.emailUser, // generated ethereal user
      pass: config.emailPass, // generated ethereal password
    }
  });

const forgotPassEmail = async (email,link)=>{
  try {
      await transporter.sendMail({
      from: '"forgot password" <itsmrcraft@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Forgot password", // Subject line
      html: `
          <b>Please check the following link, or paste this info into your browser to complete the process: <b>
          <a href="${link}">${link}<a>
      `
    });
  } catch (error) {
    return error    
  }
}

  export{forgotPassEmail }
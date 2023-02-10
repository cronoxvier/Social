import express=require('express');
import { sendCaribbean, sendEmail } from '../../controllers/Facilito/emails.controller';

const email:express.Router=express.Router();



email.post('/sendEmail', sendEmail )
email.post('/sendCaribbean', sendCaribbean )

export default email;
const nodemailer = require('nodemailer')

const sendEmail = (to, url, txt) => {


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aymenouerghui17@gmail.com',
      pass: 'aymen98940976'
    }
  });
 	
	var mailOptions = {
		from: 'aymenouerghui17@gmail.com',
		to: to,
		subject: 'Projet',
		html:  `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Social network.</h2>
        <p>Congratulations! You're almost set to start using Social network.
            Just click the button below to validate your email address.
        </p>
        
        <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
    
        <p>If the button doesn't work for any reason, you can also click on the link below:</p>
    
        <div>${url}</div>
        </div>
    `
	};

	transporter.sendMail(mailOptions, (err, infor) => {
        if(err)  
        return err;
        return infor
    })
}
module.exports = sendEmail
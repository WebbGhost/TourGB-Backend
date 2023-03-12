import nodemailer from 'nodemailer';

const sendEmail = async (to: string, subject: string, text: string) => {
  const tranporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text,
  };
  await tranporter.sendMail(mailOptions);
};
export default sendEmail;

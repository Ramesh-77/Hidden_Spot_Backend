// const otpGenerator = require('otp-generator')
import otpGenerator from "otp-generator";

export const generateOTP = async () => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });

 
  return otp;
};

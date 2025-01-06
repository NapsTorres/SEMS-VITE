const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
    try {
      const saltRounds = 10; 
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error("Error hashing password:", error);
      throw new Error("Failed to hash password");
    }
};
  
const comparePassword = async (plainTextPassword, hashedPassword) => {
    try {
      const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
      return isMatch;
    } catch (error) {
      console.error("Error comparing password:", error);
      throw new Error("Failed to compare password");
    }
};

module.exports = {
    hashPassword,
    comparePassword
};
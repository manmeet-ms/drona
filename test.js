const bcrypt = require("bcryptjs");

bcrypt.compare("password123", "$2b$10$z9XGrfiyH9.0KpoiGZEWM.0yOxWp2xUWDohOF2l9dCSPtr7mm2/Vy", (err, res) => {
    console.log(res);
})
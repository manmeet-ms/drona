import { compare } from "bcryptjs";

compare("password123", "$2b$10$78ggorrhQRjuUF9gMS2B6eYfFkCs/ImlYYtpmf9Ic6jH3kY8rUBM2", (err, res) => {
    console.log(res);
})
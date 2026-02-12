import { compare } from "bcryptjs";

compare("123", "$2b$10$Z832M92HMw.h/FvR6rSkee73I3WBD8/EjmvD0frFdWsj7VL.gLCJW", (err, res) => {
    console.log(res);
})
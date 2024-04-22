import jwt from "jsonwebtoken";
import  User from "../database/schema/user.schema.js";
import bcrypt from "bcrypt";

const generateToken = (user) => {
    return jwt.sign({ id: user._id}, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};

export const register = async(firstName, lastName, email, password) => {
    const existingUser = await User.findOne ({ email });
    if (existingUser) {
        throw new Error ("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User ({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });
    await user.save();
    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    };
};


export const login = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error ("User not found");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) {
        throw new Error ("Invalid password");
    }
    const token = generateToken(user);
    return { user, token};
};

/*export const register = async (firstName, lastName, email, password) => {
    //check if email exists
    const user = await User.findOne ({ email });
    if (user) {
        throw new ErrorWithStatus ("User already exists", 400);
    }

    //create new user
    password = await bcrypt.hash(password, 10);
    const newUser = new User ({
        firstName,
        lastName,
        email,
        password,
    });

    await newUser.save();

    delete newUser.password;
    return newUser;
};

export const login = async (email, password) => {
    //check if email exists
    const user = await User.findOne({email});
    if (!user) {
        throw new ErrorWithStatus ("User not found", 404);
    }

    //check if password is correct
    if(!bcrypt.compareSync(password, user.password)) {
        throw new ErrorWithStatus ("Username or password is incorrect", 401);
    }

    //generate access token
    const JWT_SECRET = process.env.JWT_SECRET || "secret";
    const token = jwt.sign ({
        email: user.email,
        _id: user._id
    },
    JWT_SECRET, { expiresIn: "1h" }
);
    return token;
};*/

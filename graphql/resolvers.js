const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");

const { User } = require("../models");

module.exports = {
	Query: {
		getUsers: async () => {
			try {
				const users = await User.findAll();
				return users;
			} catch (err) {
				console.log(err);
			}
		},
	},
	Mutation: {
		register: async (_, args) => {
			let { username, password, email, confirmPassword } = args;

			let errors = {};

			try {
				if (email.trim() === "") errors.email = "email must not be empty";
				if (username.trim() === "")
					errors.username = "username must not be empty";
				if (password.trim() === "")
					errors.password = "password must not be empty";
				if (confirmPassword.trim() === "")
					errors.confirmPassword = "Repeat password must not be empty";
				if (password !== confirmPassword)
					errors.confirmPassword = "Password must match";

				// const userByUsername = await User.findOne({ where: { username } });
				// const userByEmail = await User.findOne({ where: { email } });

				// if (userByUsername) errors.username = "Username is taken";
				// if (username.length <= 3)
				// 	errors.username = "Username must be greater than 3 letters";
				// if (userByEmail) errors.email = "Email is taken";

				if (Object.keys(errors).length > 0) {
					throw errors;
				}

				password = await bcrypt.hash(password, 6);
				const user = await User.create({
					username,
					email,
					password,
				});

				return user;
			} catch (err) {
				console.log(err);
				if (err.name === "SequelizeUniqueConstraintError") {
					err.errors.forEach(
						(e) => (errors[e.path] = `${e.path} is already taken`),
					);
				} else if (err.name === "SequelizeValidationError") {
					err.errors.forEach((e) => (errors[e.path] = e.message));
				}
				throw new UserInputError("Bad Error", { errors });
			}
		},
	},
};

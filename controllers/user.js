const user = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { config } = require('../config/config');
const role = require('../models/role');
const secreteKey = process.env.SECRETE_KEY || config.secreteKey;

exports.register = async (req, res) => {
    try {
        let { firstName, lastName, email, phone, password, confirmPassword } = req.body;

        if (password !== confirmPassword) return res.status(400).send({ success: false, message: "Password and Confirm Password are not same" });

        const alreadyExists = await user.fetchUser({ email });

        if (alreadyExists) return res.status(400).send({ success: false, message: "Already registered with this email" });

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await user.addNew({
            firstName,
            lastName,
            email,
            phone,
            password: hashPassword
        });

        return res.status(200).send({ success: true, message: "Registered successfully", data: newUser });

    } catch (err) {
        return res.status(500).send({ success: false, message: err.message || "Server error" });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email, !password) return res.status(400).send({ success: false, message: "Email and Password is required" });

        const alreadyExists = await user.fetchUser({ email });
        if (!alreadyExists) return res.status(404).send({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, alreadyExists.password);
        if (!isMatch) return res.status(400).send({ success: false, message: "Invalid credentials" });

        const token = await jwt.sign({ id: alreadyExists.id, email: alreadyExists.email }, secreteKey, { expiresIn: '1d' });

        return res.status(200).send({ success: true, message: "Logged in successfully", token });
    } catch (err) {
        return res.status(500).send({ success: false, message: err.message || "Server error" });
    }
}

exports.fetchUserDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).send({ success: false, message: "User ID is required" });

        const userDetails = await user.fetchUserById(id);
        if (!userDetails) return res.status(404).send({ success: false, message: "User not found" });

        return res.status(200).send({ success: true, message: "User details fetched successfully", data: userDetails });
    } catch (err) {
        return res.status(500).send({ success: false, message: err.message || "Server error" });
    }
}

exports.fetchAllUsers = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, role } = req.body;
        const filters = {};

        if (firstName) filters.firstName = new RegExp(firstName, 'i');
        if (lastName) filters.lastName = new RegExp(lastName, 'i');
        if (email) filters.email = new RegExp(email, 'i');
        if (phone) filters.phone = new RegExp(phone, 'i');
        if (role) filters.role = role;

        const users = await user.fetchAllUsers(filters);

        return res.status(200).send({ success: true, message: "Users fetched successfully", data: users });

    } catch (err) {
        return res.status(500).send({ success: false, message: err.message || "Server error" });
    }
}

exports.updateUserDetails = async (req, res) => {
    try {
        const { id, firstName, lastName, email, phone, role } = req.body;

        if (!id) return res.status(400).send({ success: false, message: "User ID is required" });

        const alreadyExists = await user.fetchUserById(id);

        if (!alreadyExists) return res.status(404).send({ success: false, message: "User not found" });

        const updatedData = {};
        if (firstName) updatedData.firstName = firstName;
        if (lastName) updatedData.lastName = lastName;
        if (email) updatedData.email = email;
        if (phone) updatedData.phone = phone;

        const updatedUser = await user.editUserById(id, updatedData);

        return res.status(200).send({ success: true, message: "User deatils updated successfully" });
    } catch (err) {
        return res.status(500).send({ success: false, message: err.message || "Server error" });
    }
}

exports.removeOrDisableUser = async (req, res) => {
    try {
        const { id, disable } = req.query;
        if (!id) return res.status(400).send({ success: false, message: "User ID is required" });
        let msg;
        if (disable) {
            await user.editUserById(id, { isActive: false });
            msg = "User disabled successfully";
        } else {
            await user.deleteUser(id);
            msg = "User deleted successfully";
        }

        return res.status(200).send({ success: true, message: msg });
    } catch (err) {
        return res.status(500).send({ success: false, message: err.message || "Server error" });
    }
}

exports.assignRole = async (req, res) => {
    const { userId, roleId } = req.body;

    try {
        const userDetails = await user.fetchUserById(userId);
        if (!userDetails) return res.status(404).send({ success: false, message: 'User not found' });

        const roleDetails = await role.fetchRoleById(roleId);
        if (!roleDetails) return res.status(404).send({ success: false, message: 'Role not found' });

        userDetails.role = roleDetails.id;
        await userDetails.save();
        return res.status(200).send({ success: true, message: 'Role assigned successfully', userDetails });
    } catch (err) {
        return res.status(500).send({ success: false, message: err.message || "Server error" });
    }
};

exports.addRole = async (req, res) => {
    const { roleName } = req.body;
    try {
        const alreadyExists = await role.fetchRole({ role: roleName });
        if (alreadyExists) return res.status(400).send({ success: false, message: 'Role already exists' });

        const newRole = await role.addNewRole({ role: roleName });
        return res.status(200).send({ success: true, message: "Role added successfully", data: newRole });
    } catch (err) {
        return res.status(500).send({ success: false, message: err.message || "Server error" });
    }
};

exports.fetchRoleById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).send({ success: false, message: "Role ID is required" });

        const roleDetails = await role.fetchRoleById(id);
        return res.status(200).send({ success: true, message: "Role details fetched successfully", data: roleDetails });
    } catch (err) {
        return res.status(500).send({ success: false, message: err.message || "Server error" });
    }
}

exports.fetchAllRoles = async (req, res) => {
    try {
        const roles = await role.fetchAllRoles({});
        return res.status(200).send({ success: true, message: "Role fetched successfully", data: roles });
    } catch (err) {
        return res.status(500).send({ success: false, message: err.message || "Server error" });
    }
};

exports.updateRoleDetails = async (req, res) => {
    try {
        const { id, roleName } = req.body;

        const alreadyExists = await role.fetchRoleById(id);

        if (!alreadyExists) return res.status(404).send({ success: false, message: "Role not found" });

        const updatedRole = await role.editRoleById(id, { role: roleName });

        return res.status(200).send({ success: true, message: "Role deatils updated successfully", data: updatedRole });
    } catch (err) {
        return res.status(500).send({ success: false, message: err.message || "Server error" });
    }
}

exports.removeRole = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).send({ success: false, message: "Role ID is required" });

        const deletedRole = await role.deleteRole(id);

        return res.status(200).send({ success: true, message: "Role deleted successfully" });
    } catch (err) {
        return res.status(500).send({ success: false, message: err.message || "Server error" });
    }
}
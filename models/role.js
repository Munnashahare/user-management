const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

const role = mongoose.model("role", roleSchema);

role.addNewRole = async (data) => {
    return await role.create(data);
}

role.fetchAllRoles = async (query) => {
    return await role.find(query);
}

role.fetchRole = async (query) => {
    return await role.findOne(query);
}

role.fetchRoleById = async (id) => {
    return await role.findById(id);
}

role.editRoleById = async (id, data) => {
    return await role.findByIdAndUpdate(id, { $set: data }, { new: true });
}

role.deleteRole = async (id) => {
    return await role.findByIdAndDelete(id);
}

module.exports = role;
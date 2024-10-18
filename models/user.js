const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    },
    isActive: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const user = mongoose.model('user', userSchema);

user.addNew = async (data) => {
    return await user.create(data);
}

user.fetchAllUsers = async (query) => {
    return await user.find(query, { password: 0 }).sort({ 'createdAt': -1 }).populate('role', 'role');
}

user.fetchUser = async (query) => {
    return await user.findOne(query).populate('role', 'role');
}

user.fetchUserById = async (id) => {
    return await user.findById(id, { password: 0 }).populate('role', 'role');
}

user.editUserById = async (id, data) => {
    return await user.findByIdAndUpdate(id, { $set: data }, { new: true });
}

user.deleteUser = async (id) => {
    return await user.findByIdAndDelete(id);
}

module.exports = user;
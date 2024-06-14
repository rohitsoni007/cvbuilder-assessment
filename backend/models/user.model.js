const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { user } = require('../config/enums')
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            email: true,
            trim: true,
            lowercase: true,
            unique: true,
            sparse: true,
        },
        username: {
          type: String,
        },
        password: {
            type: String,
            select: false,
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        identifier: {
            type: String,
        },
        provider: {
          type: String,
          enum: user.providers,
          default: "email",
        },
        stripeCustomerId: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        deletedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

userSchema.pre('save', function (next) {
    if (this.isModified('isDeleted') && this.isDeleted) {
        this.deletedAt = new Date();
    }
    next();
});



userSchema.methods.comparePassword = function (password, userPassword) {
    return bcrypt.compareSync(password, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

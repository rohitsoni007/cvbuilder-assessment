const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
    {
        name: {
          type: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        address: {
            street: {
                type: String,
            },
            city: {
                type: String,
            },
            state: {
                type: String,
            },
            pincode: {
                type: String,
            },
        },
        introduction: {
            type: String,
        },
        image: {
            type: String,
        },
        education:[{
            _id: 0,
            degree: {
                type: String,
            },
            institute: {
                type: String,
            },
            percent: {
                type: String,
            },
            completedDate: {
                type: Date,
            },
        }],
        experience:[{
            _id: 0,
            organization: {
                type: String,
            },
            location: {
                type: String,
            },
            position: {
                type: String,
            },
            ctc: {
                type: Number,
            },
            joiningDate: {
                type: Date,
            },
            leavingDate: {
                type: Date,
            },
            technologies: {
                type: String,
            },
            description: {
                type: String,
            }
        }],
        projects:[{
            _id: 0,
            title: {
                type: String,
            },
            size: {
                type: String,
            },
            duration: {
                type: Number,
            },
            technologies: {
                type: String,
            },
            description: {
                type: String,
            },
        }],
        skills:[{
            _id: 0, 
            name: {
                type: String,
            },
            perfection: {
                type: String,
            },
        }],
        socialProfiles:[{
            _id: 0,
            platform: {
                type: String,
            },
            link: {
                type: String,
            },
        }],
        template: {
            type: Number,
            default: 1
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


resumeSchema.pre('save', function (next) {
    if (this.isModified('isDeleted') && this.isDeleted) {
        this.deletedAt = new Date();
    }
    next();
});




const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;

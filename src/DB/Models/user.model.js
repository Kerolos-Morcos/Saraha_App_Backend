import { mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "First name must be at least 3 characters long"],
        maxLength: [30, "First name must be at most 30 characters long"],
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, "Last name must be at least 3 characters long"],
        maxLength: [30, "Last name must be at most 30 characters long"],
        trim: true
    },
    email: {
        type: String,
        required: true,
        index: { name: 'idx_email', unique: true }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: [18, "Age must be at least 18"],
        max: [100, "Age must be at most 100"]
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "other"
    },
    phoneNumber: String,
}, {
    // options object
    timestamps: true,
    virtuals: {
        fullName: {
            get() {
                return `${this.firstName} ${this.lastName}`
            }
        }
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtuals - Second Method
// userSchema.virtual('fullName').get(function () {
//     return this.firstName + ' ' + this.lastName;
// });

// Create a model from the schema
const User = mongoose.model("User", userSchema);

export default User;
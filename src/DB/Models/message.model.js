import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        content: String,
        file: String,
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
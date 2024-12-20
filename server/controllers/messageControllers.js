
import asyncHandler from 'express-async-handler';
import User from "../models/UserModel.js"
import generateToken from '../config/generateToken.js';
import Message from "../models/MessageModel.js"
import Chat from '../models/ChatModel.js';
import { response } from 'express';

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body
    console.log("Request Body: ", req.body)
    console.log("User: ", req.user)

    if (!content || !chatId) {
        console.log("Invalid data passed into request")
        return res.sendStatus(400)
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    }
    try {
        var message = await Message.create(newMessage)
        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: 'chat.users',
            select: "name pic email",
        })

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        })
        res.json(message)

    } catch (error) {
        res.status(400).send(error.message)

    }
})

const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name pic email").populate("chat")
        res.json(messages)
    } catch (error) {
        res.status(400).send(error.message)

    }
})

export { sendMessage, allMessages } 
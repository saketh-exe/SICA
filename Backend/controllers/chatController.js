const User = require("../models/User");

// Add a new chat session
const addChat = async (req, res) => {
  const { UserName } = req.body;
  const user = await User.findOne({ name: UserName });

  const newChat = {
    id: user.Chats.length + 1,
    messages: [
      {
        text: "Hello, how can I help you today?",
        model: "Default",
        sender: "Ai",
      },
    ],
  };

  user.Chats.push(newChat);
  await user.save();

  res.send({ status: "Chat Added", chat: newChat });
};

// Get all user chats
const getUserChats = async (req, res) => { 
  const user = await User.findOne({ name: req.query.user });
  res.send(user?.Chats || []);
};

const deleteChat = async (req,res) => {
    const {userName,chatId} = req.body;
    const user = await User.findOne({name:userName})
    user.Chats = user.Chats.filter(chat => chat.id !== chatId);
    await user.save();
    res.send({status:"Chat Deleted"});

}



module.exports = { addChat, getUserChats ,deleteChat };

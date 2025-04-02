const User = require("../models/User");

// Function to get a user
async function getUser(name) {
  const user = await User.find({ name });
  return user.length ? user : [];
}

// User authentication
const authenticateUser = async (req, res) => {
  const { UserName, Password } = req.body;
  const user = await getUser(UserName);

  if (!user.length || !Password.length) {
    await User.create({ name: UserName, Password, Chats: [] });
    return res.send(true);
  } 

  return res.send(user[0].Password === Password);
};

module.exports = { authenticateUser, getUser };

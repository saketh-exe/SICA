function generateHistory(chat){
    let history = [{
      role : "user",
      parts : [{text : " "}]
    }];
  
    for(let i = 0 ; i< chat.messages.length; i++){
      let message = chat.messages[i];
      let role = message.sender === "User" ? "user" : "model";
  
      if(role === "user"){
        history.push({
          role : role,
          parts : [{text : message.text}]
        })
      }
      else{
        history.push({
          role : role,
          parts : [{text : message.text}]
        })
      }
  
    }
   
    return history;
  }
  
  module.exports = { generateHistory };
  
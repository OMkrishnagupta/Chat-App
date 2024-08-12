const mongoose = require("mongoose");
const express = require("express");
// const connectDb = require("./config/db");
const app = express();
const { chats } = require("./data/data");
const router=require("./routes/userRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const {notFound, errorHandler}=require("./middleware/errrormiddleware")
const messageRoutes =require("./routes/messageRoutes")
const dotenv = require("dotenv");
const path=require('path')
// dotenv.config();
// connectDb(); // Connect to MongoDB
app.use(express.json());
mongoose.connect("mongodb+srv://krishnaom1011:krishnaom11@cluster0.xyjdrac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(console.log("connected"));


app.use("/api/user",userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ------------------------------------Deployment------------------------------------------

const __dirname1 = path.resolve();
 app.use(express.static(path.join(__dirname1, "/frontend/build")));

 app.get("*", (req, res) =>
   res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
 );



//===============================================================================

app.use(notFound);
app.use(errorHandler);



const PORT = process.env.PORT || 5000;
const server=app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(process.env.PORT);
 
});
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // Additional event listeners can be added here

  socket.on("disconnect", () => {
    console.log("Disconnected from socket.io");
  });
   socket.on("setup", (userData) => {
     socket.join(userData.id);
     console.log(userData.id);
     socket.emit("connected");
   });
   socket.on("join chat", (room) => {
     socket.join(room);
     console.log("user join room:"+room);})

     socket.on('typing',(room)=>socket.in(room).emit("typing"))
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

     socket.on("new messages", (newMessageReceived) => {
      var chat =newMessageReceived.chat;
      if(!chat.users){return console.log("chat.users not defined")}

      chat.users.forEach(user=>{
        if(user._id==newMessageReceived.sender._id)return;

        socket.in(user._id).emit("message recieved",newMessageReceived)
        console.log("loji aapki userid",user._id)
        console.log(newMessageReceived)

        

      })
     })
});

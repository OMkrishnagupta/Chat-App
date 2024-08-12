import './App.css';
import { ChakraProvider } from "@chakra-ui/react";
import Chatepage from './pages/Chatepage';
import Homepage from './pages/Homepage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatProvider from './Context/ChatProvider';

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <BrowserRouter>
          <ChatProvider>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/chats" element={<Chatepage />} />
            </Routes>
          </ChatProvider>
        </BrowserRouter>
      </ChakraProvider>
    </div>
  );
}

export default App;

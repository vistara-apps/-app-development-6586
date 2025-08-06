import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Recommendations from './pages/Recommendations';
import Subscription from './pages/Subscription';
import { UserProvider } from './context/UserContext';
import { ConversationProvider } from './context/ConversationContext';
import FloatingChatButton from './components/chat/FloatingChatButton';

function App() {
  return (
    <UserProvider>
      <ConversationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/subscription" element={<Subscription />} />
            </Routes>
            <FloatingChatButton />
          </div>
        </Router>
      </ConversationProvider>
    </UserProvider>
  );
}

export default App;

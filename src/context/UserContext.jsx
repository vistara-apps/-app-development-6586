import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    geneticData: null,
    healthProfile: {},
    subscriptionPlan: null,
    recommendations: {
      nutrition: [],
      fitness: [],
      stressSleep: []
    }
  });

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const addRecommendations = (type, recommendations) => {
    setUser(prev => ({
      ...prev,
      recommendations: {
        ...prev.recommendations,
        [type]: recommendations
      }
    }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, addRecommendations }}>
      {children}
    </UserContext.Provider>
  );
};
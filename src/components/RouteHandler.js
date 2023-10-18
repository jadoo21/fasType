import React from 'react';
import { useRoutes } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

const RouteHandler = () => {
  let routes = useRoutes([
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    // ... similary, include more routes
  ]);

  return routes;
};

export default RouteHandler;
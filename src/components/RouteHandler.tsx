import * as React from 'react';
import { useRoutes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Statistics from '../pages/Statistics';
import About from '../pages/About';
import Contact from '../pages/Contact';

const RouteHandler = () => {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/statistics", element: <Statistics /> },
    { path: "/about", element: <About /> },
    { path: "/contact", element: <Contact /> },
  ]);

  return routes;
};

export default RouteHandler;
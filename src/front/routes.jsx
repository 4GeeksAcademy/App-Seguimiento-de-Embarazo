import React from "react";
import { createBrowserRouter } from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";


export const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Home />
			},
			{
				path: "/login",
				element: <Login />
			},
			{
				path: "/register",
				element: <Register />
			},
			{
				path: "/contact",
				element: <Contact />
			},
			{
				path: "/dashboard",
				element: <Dashboard />
			}
		]
	}
]);
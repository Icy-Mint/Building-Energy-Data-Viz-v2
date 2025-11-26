import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './pages/App';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/upload', element: <Upload /> },
  { path: '/dashboard', element: <Dashboard /> },
]);

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}




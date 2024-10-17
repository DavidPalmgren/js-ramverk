import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.tsx'
import Document from './routes/Document.tsx'
import './index.css'

const NotFound = () => <div>404 this will load but nothing else</div>;
const basename = "/~dapa22/editor/";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/:id",
    element: <Document/>
  },
  {
    path: "*", // This will catch all other routes
    element: <NotFound/>
  }
], {basename});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

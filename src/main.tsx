import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.tsx'
import Document from './routes/Document.tsx'
import CreateAccount from "./routes/CreateAccount.tsx";
import Login from "./routes/Login.tsx";
import AllDocuments from "./routes/AllDocuments.tsx";
import './index.css'


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
    path: "/signup",
    element: <CreateAccount/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path:"/documents",
    element: <AllDocuments/>
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
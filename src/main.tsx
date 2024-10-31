import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import Document from './routes/Document.tsx';
import CreateAccount from './routes/CreateAccount.tsx';
import AllDocuments from './routes/AllDocuments.tsx';
import DocumentInvite from './routes/DocumentInvite.tsx';
import Login from './routes/Login.tsx';
import './index.css';

import CodeEditor from './routes/CodeEditor.tsx';

const NotFound = () => <div>404 this will load but nothing else</div>;
const basename = "/~dapa22/editor/";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/:id',
    element: <Document />,
  },
  {
    path: '/signup',
    element: <CreateAccount />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/documents',
    element: <AllDocuments />,
  },

  {
    path: '/document/invite/:id',
    element: <DocumentInvite />,
  },
  {
    path: 'code/:id',
    element: <CodeEditor />,
  },
  {
    path: "*", // This will catch all other routes
    element: <NotFound/>
  }
], {basename});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

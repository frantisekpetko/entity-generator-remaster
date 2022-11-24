import React from 'react'
import {Logger} from "./utils/logger";
import Main from "./pages/Main";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import Welcome from "./pages/Welcome";
import EntityGenerator from "@/pages/EntityGenerator";
import EntityExplorer from "@/pages/EntityExplorer";
import EntityExplorerDetail from "@/pages/EntityExplorerDetail";
import DatabaseAssistant from '@/pages/DatabaseAssistant';


function App() {

  const LOG = Logger(`[${App.name}.tsx]`, {enabled: true})

  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main/>
     
    },
    {
      path: "/entity",
      element: <EntityGenerator />,
    },
    {
      path: "/explorer",
      element: <EntityExplorer />,
    },
    {
      path: "/explorer/:entity",
      element: <EntityExplorerDetail />,
    },
    {
      path: '/assistant',
      element: <DatabaseAssistant/>
    }
  ]);

  return <RouterProvider router={router} />
  
}

export default App

/* 
 * Main React Routing
 * 
 * Configures components and their associated routes (endpoints).
 * If a user navigates to an unrecognized route, an error page appears.
 * 
 */

import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.jsx'
import SearchBooks from './pages/SearchBooks'
import SavedBooks from './pages/SavedBooks'

/* 
 * createBrowserRouter
 *
 * Sets up the root and child routes for the SearchBooks and SavedBooks commponents.
 * Unrecognized routes trigger an error page.
 * 
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <SearchBooks />
      }, {
        path: '/saved',
        element: <SavedBooks />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)

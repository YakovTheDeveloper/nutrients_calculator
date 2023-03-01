import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

const domNode = document.getElementById('root')

const root = createRoot(domNode)
root.render(<RouterProvider router={router} />)

if (module.hot) {
    module.hot.accept()
}

// root.render()

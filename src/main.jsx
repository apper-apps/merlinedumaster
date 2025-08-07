import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { BrowserRouter } from 'react-router-dom'
import userReducer from '@/store/userSlice'
import App from "@/App.jsx"
import "@/index.css"

const store = configureStore({
  reducer: {
    user: userReducer,
  },
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.tsx'
import AddGuestPage from './pages/AddGuestPage.tsx'
import EditGuestPage from './pages/EditGuestPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={null} />
          <Route path="seating-plan" element={null} />
          <Route path="guests/new" element={<AddGuestPage />} />
          <Route path="guests/:id/edit" element={<EditGuestPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

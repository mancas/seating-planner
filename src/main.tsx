import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.tsx'
import GuestListView from './pages/GuestListView.tsx'
import SeatingPlanView from './pages/SeatingPlanView.tsx'
import AddGuestPage from './pages/AddGuestPage.tsx'
import EditGuestPage from './pages/EditGuestPage.tsx'
import ImportGuestsView from './pages/ImportGuestsView.tsx'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="guests/import" element={<ImportGuestsView />} />
          <Route element={<GuestListView />}>
            <Route index element={null} />
            <Route path="guests/new" element={<AddGuestPage />} />
            <Route path="guests/:id/edit" element={<EditGuestPage />} />
          </Route>
          <Route path="seating-plan" element={<SeatingPlanView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

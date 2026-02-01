import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'leaflet/dist/leaflet.css';
import App from './App.tsx'
import { OrgVrfProvider } from "@/context/org-vrf-context"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OrgVrfProvider>
      <App />
    </OrgVrfProvider>
  </StrictMode>,
)

// React DOM render için gerekli kütüphane
import { createRoot } from 'react-dom/client'

// Global CSS stilleri
import './index.css'

// Ana Uygulama Component'i
import App from './App.tsx'

// React uygulamasını DOM'a render et
// id="root" olan HTML element'ini bulur ve buraya render eder
createRoot(document.getElementById('root')!).render(
  <App />
)

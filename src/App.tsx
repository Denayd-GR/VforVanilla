import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import Home from './pages/Home'
import Items from './pages/Items/Items'
import ItemDetail from './pages/Items/ItemDetail'
import Spells from './pages/Spells'
import NPCs from './pages/NPCs'
import Misc from './pages/Misc'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/items" element={<Items />} />
            <Route path="/items/:entry" element={<ItemDetail />} />
            <Route path="/spells" element={<Spells />} />
            <Route path="/npcs" element={<NPCs />} />
            <Route path="/misc" element={<Misc />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App

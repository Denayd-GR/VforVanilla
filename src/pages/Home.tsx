import { Navigate } from 'react-router-dom'

function Home() {
  return <Navigate to="/items" replace />
}

export default Home

import './App.css'
import MapLoader from './components/BurningManMap/MapLoader'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', padding: '20px' }}>
      <h1>Burning Man Bed Map</h1>
      <div style={{ width: '100%', height: 'calc(100% - 60px)' }}>
        <MapLoader />
      </div>
    </div>
  )
}

export default App

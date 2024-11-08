import { memo } from 'react'
import CanvasScreen from './components/Canvas'
import HeroText from './components/HeroText'

function Component() {
  return (
    <div className='App'>
      <CanvasScreen />
      <HeroText />
    </div>
  )
}

const App = memo(Component)
export default App

import { Navbar, Welcome, Dock } from '#components'
import Terminal from '../src/windows/Terminal.jsx'
import gsap from 'gsap';
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);


const App = () => {
  return (
   <main>
   <Navbar />
   <Welcome />
   <Dock />
   <Terminal />
   </main>
  )
}

export default App

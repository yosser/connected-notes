
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import NotesBoard from './components/NotesBoard';
import './App.css';
import './components/NotesBoard.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <NotesBoard />
      </div>
    </DndProvider>
  );
}

export default App;

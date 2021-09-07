import './App.css';
import Board from './board/Board';

function App() {
  return (
    <div className="App">
      <div>
        HELLO!
        <Board width={9} height={9} marker_max={10} />
      </div>
    </div>
  );
}

export default App;


import Marker from '../marker/Marker';
import { SpaceStatus } from './../BoardMap';

function Cell({ text, onMouseOver, status, owner }:
  { text: string, onMouseOver: () => void, status: SpaceStatus, owner: string }) {

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: 'mediumseagreen', borderStyle: "solid", borderWidth: "2px", borderColor: 'WindowFrame', justifyContent: "center", alignItems: "center" }}
      onMouseOver={() => onMouseOver()}>
      {/* {text} */}
      {status === 'marker' ? <Marker owner={owner}></Marker> : ''}
    </div>
  );
}

export default Cell;
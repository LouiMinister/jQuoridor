
import Marker from '../marker/Marker';
import { SpaceStatus } from './../BoardMap';

function Cell({ text, onMouseOver, onClickMarker, status, owner }:
  { text: string, onMouseOver: () => void, onClickMarker: () => void, status: SpaceStatus, owner: string }) {

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: 'mediumseagreen', borderStyle: "solid", borderWidth: "2px", borderColor: 'WindowFrame', justifyContent: "center", alignItems: "center" }}
      onMouseOver={() => onMouseOver()}>
      {/* {status} */}
      {status === 'marker' ? <Marker owner={owner} onClickMarker={() => onClickMarker()} status={status}></Marker> : ''}
      {status === 'pre-marker' ? <Marker owner={owner} onClickMarker={() => { }} status={status}></Marker> : ''}
    </div>
  );
}

export default Cell;
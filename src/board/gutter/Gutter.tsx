
import { SpaceStatus } from './../BoardMap';

function Gutter({ text, onMouseOver, status }:
  { text: string, onMouseOver: () => void, status: SpaceStatus }) {

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: '', borderStyle: "solid", borderWidth: "2px", borderColor: 'WindowFrame', fontSize: "4px", justifyContent: "center", alignItems: "center" }}
      onMouseOver={() => onMouseOver()}>
      {text}
    </div>
  );
}

export default Gutter;
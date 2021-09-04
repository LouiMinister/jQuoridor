
import { SpaceStatus } from './../BoardMap';

function Gutter({ text, onMouseOver, onClick, status }:
  { text: string, onMouseOver: () => void, onClick: () => void, status: SpaceStatus }) {

  let backgroundColor: string = '';
  switch (status) {
    case 'empty':
      backgroundColor = '';
      break;
    case 'pre-obstacle':
      backgroundColor = 'lightcoral';
      break;
    case 'obstacle':
      backgroundColor = 'brown';
      break;
  }

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: backgroundColor, borderStyle: "solid", borderWidth: "2px", borderColor: 'WindowFrame', fontSize: "4px", justifyContent: "center", alignItems: "center" }}
      onClick={() => onClick()}
      onMouseOver={() => onMouseOver()}>
      {text}
    </div>
  );
}

export default Gutter;

function Marker({ owner, onClickMarker, status }:
  { owner: string, onClickMarker: () => void, status: string }) {

  const renderMarker = () => {
    if (owner === 'home') {
      if (status === 'marker') {
        return (
          <div style={{ width: "80%", height: "80%", borderRadius: "20%", backgroundColor: "blue", }} onClick={() => onClickMarker()}></div>
        );
      } else if (status === 'pre-marker') {
        return (
          <div style={{ width: "80%", height: "80%", borderRadius: "20%", backgroundColor: "blue", opacity: 0.5 }} onClick={() => onClickMarker()}></div>
        );
      }
    } else {
      if (status === 'marker') {
        return (
          <div style={{ width: "80%", height: "80%", borderRadius: "20%", backgroundColor: "red" }} onClick={() => onClickMarker()}></div>
        );
      } else if (status === 'pre-marker') {
        return (
          <div style={{ width: "80%", height: "80%", borderRadius: "20%", backgroundColor: "red", opacity: 0.5 }} onClick={() => onClickMarker()}></div>
        );
      }
    }
  }

  return (
    <>
      {renderMarker()}
    </>
  );
}

export default Marker;
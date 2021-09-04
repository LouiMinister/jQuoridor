
function Marker({ owner }:
  { owner: string }) {

  const renderMarker = () => {
    if (owner === 'home') {
      return (
        <div style={{ width: "80%", height: "80%", borderRadius: "20%", backgroundColor: "blue" }}></div>
      );
    } else {
      return (
        <div style={{ width: "80%", height: "80%", borderRadius: "20%", backgroundColor: "red" }}></div>
      );
    }
  }

  return (
    <>
      {renderMarker()}
    </>
  );
}

export default Marker;
function Cell({ text, onMouseOver, status }) {


  return (
    <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: 'mediumseagreen', borderStyle: "solid", borderWidth: "2px", borderColor: 'WindowFrame', justifyContent: "center", alignItems: "center" }}
      onMouseOver={() => onMouseOver()}>
      {text}
    </div>
  );
}

export default Cell;
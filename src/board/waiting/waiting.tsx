function Waiting() {
  const renderWaiting = () => {
    // 보드 크기 832x832
    return (
      <div
        style={{
          borderRadius: "10%",
          backgroundColor: "#82755b",
          borderWidth: "2px",
          borderStyle: "solid",
        }}
      ></div>
    );
  };

  return <>{renderWaiting()}</>;
}

export default Waiting;

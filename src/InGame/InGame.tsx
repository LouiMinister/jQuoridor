// import _ from 'lodash';
import { useState } from 'react';
import Modal from 'react-modal';
import useInput from 'src/hooks/useInput';
import Board from './board/Board';


function InGame() {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [roomNumber, setRoomNumber] = useInput('0');
  const [playerName, setPlayerName] = useInput('UNNAMED');

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  };

  const onSubmit = () => {
    console.log(roomNumber, playerName);
    setModalIsOpen(false);
  }

  return (
    <>
      <div>
        <Modal
          style={customStyles}
          isOpen={modalIsOpen}
          ariaHideApp={false}
        >
          <div>
            roomNumber
            <input value={roomNumber} onChange={setRoomNumber}></input>
          </div>
          <div>
            playerName
            <input value={playerName} onChange={setPlayerName}></input>
          </div>
          <button onClick={() => onSubmit()}>submit</button>
        </Modal>
        <Board width={9} height={9} maxObstacle={10} />
      </div>
    </>
  );
}

export default InGame;
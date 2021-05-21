import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import API_URL from '../constants'

const PlayerResult = () => {
  const { playerId } = useParams();
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);
  // fetch game result here
  useEffect(() => {
    fetch(`${API_URL}/play/${playerId}/results`, {
      method: 'GET',
    }).then(res => {
      if (res.ok) {
        return res.json()
      }
      throw new Error(res.status);
    })
      .then(data => {
        let correct = 0;
        for (let i = 0; i < data.length; ++i) {
          if (data[i].correct) {
            correct += 1;
          }
        }
        setRight(correct);
        setWrong(data.length - correct);
      })
  }, [])
  return (
    <div style={{ marginTop: 20, textAlign: 'center' }}>
      <h2>Yout have answered corrected: {right}</h2>
      <h2>Yout have answered Wrong: {wrong}</h2>
    </div>
  );
}

export default PlayerResult;

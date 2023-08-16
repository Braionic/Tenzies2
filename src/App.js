import React from "react";
import { useEffect, useState } from "react";
import "../src/style.css";
import Dies from "./components/Dies";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  const [myTimer, setmyTimer] = useState(() => 0);
  const [Totalclicks, settotalclick] = useState(() => 0);
  const [bestscore, setbestscore] = useState(()=>JSON.parse(localStorage.getItem("highest score")) || 0)
  const [mynumbers, setmynumbers] = useState(() => {
    return allnewdice();
  });

  const [tenzies, settenzies] = useState(() => false);

  useEffect(()=>{
    if(tenzies){
      let g = localStorage.getItem("highest score");
      if(g > myTimer){
      localStorage.setItem("highest score", JSON.stringify(myTimer))
      setbestscore(()=>{
        return myTimer
      })
      }
    }
  }, [tenzies])

  useEffect(() => {
    let firstNum = mynumbers[0].value;
    let allsame = mynumbers.every((val) => {
      return val.value === firstNum;
    });
    let allheld = mynumbers.every((val) => {
      return val.on === true;
    });
    settenzies((oldval) => {
      if (allheld === true && allsame === true) {
        return !oldval;
      } else {
        return oldval;
      }
    });
  }, [mynumbers]);

  //Set timer function
  useEffect(() => {
    let ctimer = setTimeout(() => {
      setmyTimer((oldval) => {
        return !tenzies ? oldval + 1 : oldval;
      });
    }, 1000);
    return () => clearTimeout(ctimer);
  }, [myTimer]);

  //load new dice
  function loadDice() {
    let rand = Math.floor(Math.random() * 6);
    return {
      value: rand,
      on: false,
      id: nanoid(),
    };
  }
  //Generate random new dice
  function allnewdice() {
    let randNum = [];
    for (let i = 0; i < 10; i++) {
      randNum.push(loadDice());
    }

    return randNum;
  }
  //Roll Dice
  function rollDice() {
    setmynumbers((oldval) => {
      return oldval.map((val) => {
        return val.on ? val : loadDice();
      });
    });
    settotalclick((oldval) => {
      return oldval + 1;
    });
  }
  //Hold Dice
  function handlehold(id) {
    setmynumbers((oldval) => {
      return oldval.map((val) => {
        return val.id === id ? { ...val, on: !val.on } : val;
      });
    });
  }

  //reset dice
  function handleReset() {
    settenzies((oldval) => {
      return !oldval;
    });
    setmynumbers(() => {
      return allnewdice();
    });
    setmyTimer(() => {
      return 0;
    });
    settotalclick(() => {
      return 0;
    });
  }
  let mydies = mynumbers.map((val) => {
    return (
      <Dies
        key={val.id}
        num={val.value}
        on={val.on}
        id={val.id}
        handlehold={handlehold}
      />
    );
  });

  const style = {
    backgroundColor: tenzies? "green": "brown",
    color: tenzies? "white": "white"
  }
  return (
    <div className="App">
      {tenzies && <Confetti />}
      <main>
        <div className="stats">
          <div>
            {!tenzies ? `Time spent ${myTimer}` : `Total time: ${myTimer}`}
          </div>
          <div>{`Best score ${bestscore}`}</div>
          <div>
            {!tenzies ? `Rolls: ${Totalclicks}` : `Total Rolls: ${Totalclicks}`}
          </div>
        </div>
        <h1 style={{ textAlign: "center" }}>Tenzies</h1>
        <p className="info">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between role
        </p>
        <div className="dies">{mydies}</div>
        {tenzies ? (
          <button onClick={handleReset} style={style} className="button" button>
            {tenzies ? "You won, refresh" : "Random Num"}
          </button>
        ) : (
          <button onClick={rollDice} style={style} className="button">
            {tenzies ? "You won" : "Roll Dice"}
          </button>
        )}
      </main>
    </div>
  );
}
export default App;

import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [wons, setWons] = React.useState(
      JSON.parse(localStorage.getItem("wons")) || 0
    )

    React.useEffect(() =>localStorage.setItem("wons", JSON.stringify(wons)) )
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            console.log("You won!")
            setWons(wons + 1)
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
/**
 * Challenge: Allow the user to play a new game when the
 * button is clicked and they've already won
 */
    
    function rollDice() {
      if(!tenzies){
        setDice(oldDice => oldDice.map(die => {
            return die.isHeld ? 
                die :
                generateNewDie()
        }))
        setRolls(rolls +1)
      }else{
        setTenzies(false)
        setDice(allNewDice)
        
      }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">{tenzies ? "You won"  : "Tenzies"}</h1>
            <p className="instructions"> {tenzies ? "Congratulations!" : "Roll until all dice are the same. "+ 
            "Click each die to freeze it at its current value between rolls."}</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <div className="cache-results">
                    <p>Rolls: {rolls}</p>
                    <p>Wons: {wons}</p>
            </div>
           

        </main>
    )
}

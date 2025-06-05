import React, { useState, useEffect, useRef } from 'react';
import './BotListManager.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';

const BotListManager = () => {
  const [bots, setBots] = useState([
    { id: 1, name: "Nose Hair Extractor", status: "Running", task: "Extracting nose hairs..." },
    { id: 2, name: "Pimple Popper", status: "Completed", task: "Popping pimples." },
    { id: 3, name: "Tooth straightener", status: "Stopped", task: "Realigning teeth." }
  ]);
  const [selectedBot, setSelectedBot] = useState(null);
  const [displayAddBotInputs, setDisplayAddBotInputs] = useState(false);
  const [botName, setBotName] = useState("");
  const [botDesc, setBotDesc] = useState("");
  const [filteredBots, setFilteredBots] = useState(bots);
  // Sets a reference for a specific HTML element so I can access it without using event
  const inputRef = useRef();

  // Triggers every time bot is changed, keeps the filters applied
  // useEffect(() => {
  //   console.log("Bots: ", bots)
  // }, [bots]);
  // // useEffect(() => {
  //   console.log('Selected filters:', selectedFilters);
  // }, [selectedFilters]);
  // useEffect(() => {
  //   console.log('Filtered bots:', filteredBots);
  // }, [filteredBots]);
 
  // Makes the relevant dropdown visible when you click "update status"
  const updateJob = (bot) => {
    /*Finds the related select element and sets the class to make it visible*/
    setSelectedBot(bot.id);    
    // Closes other user interactions
    hideAddBotInputs();
  };

  // Hides the dropdown and updates status when you select something from the dropdown
  const changeStatus = (botId, updatedStatus) => {
    // Creates a copy of the array but with the new value for the one being changed
    const updatedBots = bots.map(bot => 
      bot.id === botId ? {...bot, status: updatedStatus} : bot
    );
    // Then applies this using setBots
    setBots(updatedBots);
    updateFilters(updatedBots);
    // Then hides the dropdown
    setSelectedBot(null);
  };

  // Shows the inputs for adding a new bot
  const showAddBotInputs = () => {
    setDisplayAddBotInputs("true");
    // Closes other user interactions
    setSelectedBot(null);
  };
  // Hides the inputs for adding a new bot
  const hideAddBotInputs = () => {
    setDisplayAddBotInputs("false");
    setBotName("");
    setBotDesc("");
  };
  // Adds a new bot based on user inputs
  const addBot = (event) => {    
    event.preventDefault();
    const updatedBots = [...bots, {"id":bots.length+1, "name": botName, "status": "Stopped", "task": botDesc}];
     // Then applies this using setBots
    setBots(updatedBots);
    updateFilters(updatedBots);
    // Hides the inputs for adding a new bot
    setDisplayAddBotInputs("false");
    setBotName("");
    setBotDesc("");
  };

  // Deletes the relevant bot
  const deleteBot = (botId) => {
    // Creates a copy of the array but with the selected bot removed
    const updatedBots = bots.filter(bot => bot.id !== botId);
    // Updates the ids to be accurate
    const updatedBots2 = updatedBots.map((bot, index) => ({...bot, id: index+1})
    );
    // Then applies this using setBots
    setBots(updatedBots2);
    updateFilters(updatedBots2);
  };

  // Updates the display to only show what is filtered
  const updateFilters = (botList = bots) => {
    const filtersList = [];
    // Checks what is currently selected
    for (let i=0; i<inputRef.current.selectedOptions.length; i++) {
      filtersList.push(inputRef.current.selectedOptions[i].value);
    }
    // Need to set filteredBots to map only values from bot whose "status" is in 
    let justFiltered = botList.filter(bot => filtersList.includes(bot.status));
    // If none selected, show all bots
    if (inputRef.current.selectedOptions.length===0) {
      justFiltered = bots.map(bot => bot);
    }
    setFilteredBots(justFiltered);
    // Closes anything open
    setDisplayAddBotInputs("false");
    setBotName("");
    setBotDesc("");
    setSelectedBot(null);
  }

  return (
    <div className="bot-list-manager">
      <h1 style={{width: "auto", display: "inline-block"}}>Bot List Manager&nbsp;</h1>
      <FontAwesomeIcon icon={faPlus} style={{fontSize: "2rem"}} onClick={() => showAddBotInputs()}/><br></br>
      {/*Adds a multi-select filter*/}
      <h2 style={{display: "inline"}}>Filter: </h2>
      <select multiple ref={inputRef} onChange={() => updateFilters()} title="Hold Ctrl to select multiple options. Holding Ctrl also lets you deselect an option.">
        <option value="Running">Running</option>
        <option value="Completed">Completed</option>
        <option value="Stopped">Stopped</option>
      </select>
      <ul>
        {filteredBots.map(bot=><li key={bot.id}><FontAwesomeIcon icon={faTrashCan} onClick={() => deleteBot(bot.id)}/><div className="left"><strong>{bot.name}</strong>: <span className={bot.status}>{bot.status}</span><br></br>
        <p><em>{bot.task}</em></p></div>
        <div className="right"><button onClick={() => updateJob(bot)}>Update status...</button></div>
        <div className="moreRight" style={{display: "flex"}}>
          {/*defaultValue means it puts the current option as the one already selected in the dropdown*/}
          {/*By doing this ternary operator, I rerender it to only show the dropdown next to the "selectedBot"*/}
              <select className="statusChanger" defaultValue={bot.status} id={selectedBot === bot.id ? "selected" : null} onChange={(event) => changeStatus(bot.id, event.target.value)}>
                <option value="Running">Running</option>
                <option value="Completed">Completed</option>
                <option value="Stopped">Stopped</option>
            </select>
            {/*Adds a cancel button that removes the dropdown*/}
            <button style = {{visibility: selectedBot === bot.id ? "visible": "hidden", display: "inline-block"}} onClick={() => setSelectedBot(null)}>Cancel</button>
        </div></li>)}
      </ul>
      <form style={{display: displayAddBotInputs === "true" ? "block" : "none"}} onSubmit={(event) => addBot(event)}>
        <label htmlFor="botName">Bot name: </label>
        {/*The onChange sets a variable to be able to reference their values later (in the addBot function)
        The value being set to the variable lets me set the input to be null later as well*/}
        <input id="botName" type="text" placeholder="Bot name" value={botName} onChange={(event) => setBotName(event.target.value)} required></input><br></br>
        <label htmlFor="botDesc">Bot task: </label>
        <input id="botDesc" type="text" placeholder="Description" value={botDesc} onChange={(event) => setBotDesc(event.target.value)} required></input><br></br>
        <button type="submit">Add bot</button>
        <button type="button" onClick={() => hideAddBotInputs()}>Cancel</button>
      </form>
    </div>
  );
};

export default BotListManager; 
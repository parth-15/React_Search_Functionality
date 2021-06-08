import React from 'react';
import { useEffect, useState } from 'react';
import '../App.css';

function DataDisplayer() {

  const [state, setState] = useState({
      data1: [],
      data2: [],
      search: '',
      filteredData1: [],
      filteredData2: []
  })  
 
  const fetchFile = async (filePath) => {
      return await fetch(filePath)
                .then(response => response.json())
                .then(data => data)
  }


  useEffect(async () => {
  
        const data1 = await fetchFile('res/data_5.json')
        setState(prevState => ({  
            ...prevState,
            data1,
            filteredData1:data1
        }
        ))

        const data2 = await fetchFile('res/data_6.json')
        setState(prevState => ({
            ...prevState,
            data2,
            filteredData2:data2
        }
        ))
    },[])

  useEffect(() => {

    if(state.search === '') {
        setState(prevState => ({
            ...prevState,
            filteredData1: state.data1,
            filteredData2: state.data2
        })
        )
    } else {
    setState(prevState => {
        return {
            ...prevState,
            filteredData1: state.data1.filter(filterSearch)
        }
    })
    setState(prevState => {
       return {
           ...prevState,
           filteredData2: state.data2.filter(filterSearch)
       }
   })
}

  },[state.search])

  const fuzzysearch = (fileElement, search) => {
    let toReturn = false
    for (const property in fileElement) {
        if (property === 'id') {
            continue;
        } else {
            let elementStringToArray = (fileElement[property]).toLowerCase().split(' ');
            let searchStringToArray = search.split(' ');

      let j = 0;
      for (let i = 0; i < elementStringToArray.length && j < searchStringToArray.length; i++) {
        if (elementStringToArray[i] === searchStringToArray[j]) {
          j++;
        }
      }
      if (j === searchStringToArray.length){
        toReturn = true;
        break;
      }
    }
}
    return toReturn;
  }

  const absoluteSearch = (fileElement, search) => {
    let toReturn = false
    console.log(search)
    for (const property in fileElement) {
      if (property === 'id') {
          continue;
      }
      else if (fileElement[property].toLowerCase().includes(search)) {
        toReturn = true;
        break;
      }
    }
    return toReturn
  }

  const filterSearch = (fileElement) => {
    if(state.search[0]===`"` && state.search[state.search.length-1]===`"`) {
        return absoluteSearch(fileElement, state.search.substring(1,state.search.length-1).toLowerCase());
    }
    return fuzzysearch(fileElement, state.search.toLowerCase())

  }
  

  return (
    <div className="App">
        <input placeholder="Search" value={state.search} onChange={e => {setState(prevState => ({
            ...prevState,
            search: e.target.value
        }
        ));
        console.log(e.target.value) }}></input>
        {state.filteredData1.map((item) => <p key={item.id}>Name:{item.name}  Location:{item.location}</p>)}
        {state.filteredData2.map((item) => <p key={item.id}>Company:{item.company}  Location:{item.location}</p>)}
    </div>
  );

}

export default DataDisplayer;
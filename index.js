const inputForm = document.getElementById('search-form')
const searchInput = document.getElementById('search-input')
const resultsDiv = document.getElementById('results')
//This function uses an event listener at the input form element where when the submit button in the form  is clicked, the word a user has input into the input field is captured
//That word is then used in the fetch() method and after the promise returned by fetch is fulfilled, the response is processed using async and await 
//The processed data is then passed to the displayResults() function for displaying to the user
function handleFetchResults(){
inputForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    resultsDiv.innerHTML = `<p id="loading">Loading result...</p>`
    const queryWord = searchInput.value.trim()
    searchInput.value = ""
    try {
    const response =  await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${queryWord}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    if (!response.ok) {
        throw new Error(`word not found`)
    }
    const data = await response.json()
    displayResults(data)
    }
    catch (error) {
        resultsDiv.innerHTML = `<p id="error">Word not found!!!</p>`

    }
    
})
}
handleFetchResults()

//This function handles displaying of the word and its details to the user using DOM manipulation
// It takes the processed data as an argument and uses template literals to create HTML elements that are then inserted into the resultsDiv element
//The content in each element is accessed based on the structure of the data that results from processing the API response. 
function displayResults(data) {
    const meanings = data[0].meanings
    resultsDiv.innerHTML = `
    <div id ="word" >
    <h2>${data[0].word}</h2>
    <button id="favorites-btn" onclick="saveToFavorites('${data[0].word}')" title = "Click to save to favorites"><span class="favorite-star">&#9734</span></button>
    </div>
    <p><strong>Phonetic:</strong> ${data[0].phonetic || 'Not available'}</p>
    <p><strong>Part of Speech:</strong> ${meanings[0].partOfSpeech}</p>
    <p><strong>Definition:</strong> ${meanings[0].definitions[0].definition}</p>
    <p><strong>Example:</strong> ${meanings[0].definitions[0].example || 'No example available'}</p>
    <p><strong>Listen to pronunciation:</strong></p>
    <audio controls>
       <source src="${data[0].phonetics[0].audio} " type="audio/mpeg">
    </audio>`

}

//This function uses the built in local storage of the browser to store favorite words which persist even when the browser is closed
//The local storage stores key value pairs where both the key and value must always be strings
//JSON.parse() is used to transform the stringified array in local storage back to an array that can be manipulated in JavaScript
//JSON.stringify() is used to convert the array of favorite words into a string that can be stored in local storage
function saveToFavorites(word) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []
    if (favorites.includes(word)) {
            alert('The word exists in favorites!')
            return handleDisplayFavorites()
        }
    favorites.push(word)
    alert('The word has been saved to favorites!')
    localStorage.setItem('favorites', JSON.stringify(favorites))
    handleDisplayFavorites()
}

//This function handles displaying the favorites to the user
//A button is provided for each favorite word that allows the user to remove a word from the favorites list. 
// When the button is clicked, the handleRemoveFromFavorites() function is called with the specific word to be removed as an argument.
function handleDisplayFavorites(){
   
        resultsDiv.innerHTML = '<h2>Favorite Words</h2>'
        const favorites = JSON.parse(localStorage.getItem('favorites')) || []
        if (favorites.length === 0) {
            return resultsDiv.innerHTML += `<p id="no-favorites">Please add some favorite words to view!</p>`
        }
        favorites.forEach((word) => {
            resultsDiv.innerHTML += `
        <div id="favorite-words">
        <p>${word}</p>
        <button id = "remove-favorite-btn" onclick="handleRemoveFromFavorites('${word}')" title = "Click to remove from favorites">Remove</button>
        </div>
        `
        })
    }
//This function handles removing a word from the favorites list in local storage. 
// It takes the word to be removed as an argument, retrieves the current list of favorites from local storage, filters out the specified word, and then updates local storage with the new list of favorites. 
// Finally, it alerts the user that the word has been removed and calls handleDisplayFavorites() to update the displayed list of favorite words.
function handleRemoveFromFavorites(word) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []
    favorites = favorites.filter(favorite => favorite !== word)
    localStorage.setItem('favorites', JSON.stringify(favorites))
    alert(`${word} removed from favorites!`)
    handleDisplayFavorites()       
}





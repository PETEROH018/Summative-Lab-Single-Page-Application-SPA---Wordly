const inputForm = document.getElementById('search-form')
const searchInput = document.getElementById('search-input')
const resultsDiv = document.getElementById('results')

function handleFetchResults(){
inputForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    resultsDiv.innerHTML = `<p id="loading">Loading result...</p>`
    const query = searchInput.value.trim()
    try {
    const response =  await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`, {
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
    DisplayResults(data)
    }
    catch (error) {
        resultsDiv.innerHTML = `<p id="error">Word not found!!!</p>`

    }
    
})
}
handleFetchResults()

function DisplayResults(data) {
    const meanings = data[0].meanings
    resultsDiv.innerHTML = `
    <div id ="word" title = "Click to save to favorites">
    <h2>${data[0].word}</h2>
    <button id="favorites-btn" onclick="saveToFavorites('${data[0].word}')">Save to favorites</button>
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

function saveToFavorites(word) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []
    if (favorites.includes(word)) {
            alert('Word already in favorites!')
            return
        }
    favorites.push(word)
    alert('Word saved to favorites!')
    localStorage.setItem('favorites', JSON.stringify(favorites))
    handleDisplayFavorites()
}

function handleDisplayFavorites(){
   
    
        const favorites = JSON.parse(localStorage.getItem('favorites')) || []
        if (favorites.length === 0) {
            alert('No favorites saved yet!')
            return
        }
        resultsDiv.innerHTML = '<h2>Favorite Words</h2>'
        favorites.forEach((word) => {
            resultsDiv.innerHTML += `
        <p>${word}</p>
        `})
    }





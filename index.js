const textInput = document.getElementById('textinput');
const searchbutton = document.getElementById('searchbutton');

const word = document.getElementById('word');
const phonetic = document.getElementById('phonetic');
const audio = document.getElementById('audio');
const pos = document.getElementById('pos');
const def = document.getElementById('def');

searchbutton.addEventListener('click', () => {
    const inputValue = textInput.value.trim();
    if (!inputValue) {
        alert('Please enter a word to search');
        return;
    }
    fetchDict(inputValue);
});

function fetchDict(value) {
    const apiKey = '48f66f84-d86c-4251-8deb-7a0d7a6a8daa';
    const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${value}?key=${apiKey}`;

    fetch(url)
        .then(res => res.ok ? res.json() : Promise.reject(`HTTP error! status: ${res.status}`))
        .then(data => {
            if (!data.length || typeof data[0] === 'string') {
                alert(typeof data[0] === 'string' ? `Did you mean: ${data.join(', ')}?` : 'No results found');
                return;
            }

            const wordData = data[0];
            word.innerText = wordData.meta?.id || 'No word available';
            phonetic.innerText = wordData.hwi?.prs?.[0]?.mw || 'No phonetic available';

            const audioSrc = wordData.hwi?.prs?.[0]?.sound?.audio 
                ? `https://media.merriam-webster.com/audio/prons/en/us/mp3/${wordData.hwi.prs[0].sound.audio[0]}/${wordData.hwi.prs[0].sound.audio}.mp3` 
                : null;
            if (audioSrc) {
                audio.src = audioSrc;
                audio.style.display = 'block';
            } else {
                audio.src = '';
                audio.style.display = 'none';
            }

            pos.innerText = `Part of Speech: ${wordData.fl || 'N/A'}`;
            def.innerText = `Definition: ${wordData.shortdef?.[0] || 'No definition available'}`;
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            alert(`Error: ${error}. Please try again.`);
        });
}
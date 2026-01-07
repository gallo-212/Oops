// *** SOSTITUISCI CON LA TUA CHIAVE API DI OPENAI ***
const OPENAI_API_KEY = 'API_KEY_SEGRETISSIMA'; 

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const userText = userInput.value.trim();

    if (userText === '') return;

    // Visualizza il messaggio dell'utente
    addMessage(userText, 'user-message');
    userInput.value = '';

    // Mostra un messaggio di attesa
    const loadingMessage = addMessage('L\'IA sta pensando...', 'ai-message');

    try {
        const response = await fetch('api.openai.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                // QUI DEFINISCI LA PERSONALITA' DELLA TUA IA (PROMPT DI SISTEMA)
                model: "gpt-4o", 
                messages: [
                    {"role": "system", "content": "Sei un assistente IA personale, amichevole e molto conciso. Parli solo italiano e rispondi in modo diretto."},
                    {"role": "user", "content": userText}
                ],
                max_tokens: 150
            })
        });

        const data = await response.json();
        const aiText = data.choices[0].message.content.trim();

        // Rimuovi il messaggio di attesa e aggiungi la risposta reale
        chatBox.removeChild(loadingMessage);
        addMessage(aiText, 'ai-message');

    } catch (error) {
        console.error('Errore durante la chiamata API:', error);
        chatBox.removeChild(loadingMessage);
        addMessage('Errore: Impossibile connettersi all\'IA.', 'ai-message');
    }
}

function addMessage(text, className) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = text;
    messageDiv.classList.add('message', className);
    chatBox.appendChild(messageDiv);
    // Scorre automaticamente verso il basso
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageDiv; // Restituisce l'elemento per poterlo rimuovere/modificare (es. messaggio di loading)
}

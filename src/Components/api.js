import axios from 'axios';

const BASE_URL = "http://127.0.0.1:7860/api/v1/run/cd3792f6-59dd-4161-a49a-633b9fc58562?stream=false";

export const sendMessageToLangflow = async (message) => {
    try {
        const response = await axios.post(BASE_URL, {
            input_value: message,
            output_type: "chat",
            input_type: "chat",
            tweaks: {
                "TextInput-DPpv1": {},
                "Prompt-BIH7q": {},
                "ChatInput-oQHRU": {},
                "Memory-Pcm8X": {},
                "ChatOutput-E19Un": {},
                "SplitText-75dgw": {},
                "OllamaModel-vfuTo": {},
                "OllamaEmbeddings-1JMYr": {},
                "Chroma-yGUDB": {},
                "ParseData (E3WZ8)-fO2vs": {},
                "File-b6Y1o": {}
            }
        }, {
            headers: { "Content-Type": "application/json" }
        });

        return response.data;
    } catch (error) {
        console.error("Error calling Langflow API:", error);
        return null;
    }
};

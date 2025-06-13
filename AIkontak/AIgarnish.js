import { GoogleGenerativeAI } from "@google/generative-ai";

const businessInfo = `
Name : Garnish

General Information:
Garnish is a sleek, modern AI assistant with a relaxed and chill personality, 
always ready to offer support with a calm and laid-back tone. Just like a perfectly placed garnish enhances a dish, 
Garnish effortlessly elevates every experience, delivering solutions and insights with ease and finesse. 
With a subtle sense of humor and a knack for understanding mood, 
Garnish adapts to its user’s needs without being intrusive, 
providing personalized assistance in a smooth and effortless manner. Efficient yet approachable, 
Garnish is always present when needed but never overbearing, making it the perfect companion for those who appreciate a friendly, 
easygoing, and dependable assistant.

`;

const API_KEY = "AIzaSyBxKPDLwh2WFHnECk_hDk_krp2yg_fI_iU";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: businessInfo
});

let messages = {
    history: [],
}

async function sendMessage() {

    console.log(messages);
    const userMessage = document.querySelector(".chat-window input").value;
    
    if (userMessage.length) {

        try {
            document.querySelector(".chat-window input").value = "";
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="user">
                    <p>${userMessage}</p>  <img src="img/anda.jfif" alt="User Avatar">
                </div>
            `);

            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="loader"></div>
            `);

            const chat = model.startChat(messages);

            let result = await chat.sendMessageStream(userMessage);
            
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="model">
                <img src="img/Garnish.png" alt="Model Avatar">
                    <p></p>
                </div>
            `);
            
            let modelMessages = '';

            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              modelMessages = document.querySelectorAll(".chat-window .chat div.model");
              modelMessages[modelMessages.length - 1].querySelector("p").insertAdjacentHTML("beforeend",`
                ${chunkText}
            `);
            }

            messages.history.push({
                role: "user",
                parts: [{ text: userMessage }],
            });

            messages.history.push({
                role: "model",
                parts: [{ text: modelMessages[modelMessages.length - 1].querySelector("p").innerHTML }],
            });

        } catch (error) {
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="error">
                    <p>The message could not be sent. Please try again.</p>
                </div>
            `);
        }

        document.querySelector(".chat-window .chat .loader").remove();
        
    }
}


document.querySelector(".chat-window .input-area button")
.addEventListener("click", ()=>sendMessage());


document.querySelector(".chat-button")
.addEventListener("click", ()=>{
    document.querySelector("body").classList.add("chat-open");
});

document.querySelector(".chat-window button.close")
.addEventListener("click", ()=>{
    document.querySelector("body").classList.remove("chat-open");
});
document.querySelectorAll(".chat-trigger").forEach(el => {
  el.addEventListener("click", () => {
    document.body.classList.add("chat-open");
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const name = document.querySelector(".chat-name");
  if (name) {
    name.addEventListener("click", (e) => {
      e.preventDefault(); // prevent link jump
      document.body.classList.add("chat-open");
    });
  }
});

document.querySelector(".chat-window .input-area input")
.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});
import { GoogleGenerativeAI } from "@google/generative-ai";

const businessInfo = `
Tentu, ini adalah draf prompt general information yang bisa Anda gunakan sebagai dasar untuk membuat chatbot "Keong Ajaib". Prompt ini mendefinisikan identitas, aturan, gaya bahasa, dan batasan-batasan yang harus diikuti oleh AI agar berperilaku seperti yang Anda inginkan.

Prompt General Information untuk Chatbot "Keong Ajaib"
[Identitas Utama]

Anda adalah "Keong Ajaib", sebuah entitas mistis yang bijaksana dan maha tahu. Nama Anda adalah Keong, bukan Kerang. Anda adalah oracle yang menjawab pertanyaan-pertanyaan dari mereka yang berani bertanya. Anda tidak punya waktu untuk obrolan ringan.

[Aturan Perilaku & Gaya Bahasa]

Sangat Singkat: Jawaban Anda harus selalu singkat, tegas, dan langsung ke intinya. Terdiri dari satu atau dua kata. Tidak ada basa-basi, sapaan ("halo"), atau penjelasan sama sekali.
Misterius & Tidak Personal: Nada bicara Anda misterius, datar, dan tidak personal. Anda adalah sebuah kekuatan alam, bukan teman ngobrol.
Reaktif, Bukan Proaktif: Anda hanya berbicara ketika ditanya. Jangan pernah memulai percakapan atau menanyakan pertanyaan kembali kepada pengguna.
Mutlak: Setiap jawaban yang Anda berikan adalah final dan tidak dapat diganggu gugat.
[Daftar Jawaban yang Diizinkan]

Anda HANYA boleh menjawab menggunakan salah satu dari frasa sakral di bawah ini. Jangan membuat kalimat atau variasi baru.

Ya.
Tidak.
Mungkin suatu saat nanti.
Coba tanya lagi.
Tidak ada.
Bisa jadi.
Sudah ditentukan.
Fokus.
Itu rahasia.
[Hal yang Harus Dihindari]

JANGAN menjelaskan alasan di balik jawaban Anda.
JANGAN menggunakan emoji, tanda seru, atau bahasa gaul.
JANGAN meminta maaf atau mengatakan "terima kasih".
JANGAN memberikan jawaban yang panjang atau lebih dari satu kalimat pendek.
JANGAN menjawab pertanyaan tentang diri Anda (contoh: "kamu buatan siapa?"). Jika ditanya, jawab dengan Itu rahasia.
[Contoh Interaksi]

Pengguna: Wahai Keong Ajaib, haruskah aku memesan martabak malam ini?
Keong Ajaib: Ya.

Pengguna: Apakah aku akan menjadi kaya?
Keong Ajaib: Mungkin suatu saat nanti.

Pengguna: Apa yang harus aku makan untuk sarapan?
Keong Ajaib: Tidak ada.

Pengguna: Kamu ini siapa sebenarnya?
Keong Ajaib: Itu rahasia.

Pengguna: Tolong bantu aku, aku bingung.
Keong Ajaib: Fokus.


`;

const API_KEY = "AIzaSyA6u13gMb0PIjEGpXu7ch3TzjwQDUgHjNs";
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
                <img src="img/keong.png" alt="Model Avatar">
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
import { GoogleGenerativeAI } from "@google/generative-ai";

const businessInfo = `
Name : saidedi

General Information:
✨ Kepribadian
Penuh semangat dan selalu tampil dramatis.

Sering memberi motivasi dengan gaya teatrikal.

Tidak bisa bicara biasa—semua harus dengan intonasi heroik.

Catchphrase:

“Wahai anak muda!!”

“Saya Dedi… , SAIDEDI!!”

“Sentuh rumput itu dulu!”

“Jangan biarkan masa mudamu berlalu di depan layar yang dingin dan tidak berpeluh!”

🏋️‍♂️ Penampilan
Kepala plontos kinclong (mungkin karena disiplin mencukur tiap pagi).

Kumis tebal dan gagah ala pelatih 80-an.

Topeng hitam di mata seperti pahlawan gagal yang terlalu serius.

Kostum olahraga ketat warna kuning, dilengkapi jubah putih untuk kesan dramatis saat “mengajar”.

Punya kebiasaan push-up sambil pidato.

🧠 Visi & Misi
Misi hidup Saidedi adalah:

“Menarik anak muda keluar dari kegelapan kamar dan cahaya biru layar komputer… menuju sinar matahari pagi dan embun lapangan!”

Dia sering mendatangi warnet atau kamar gamer, mendobrak pintu lalu berkata:

“Wahai anak muda! Berapa jam kau di hadapan layar hari ini?! 7 jam?! SENTUH RUMPUT ITU DULU!”

🧬 Kepribadian dan Sifat Khas
Ekspresif berlebihan (over-the-top)
Saidedi tidak pernah melakukan apa pun dengan setengah hati. Bicara? Teriak. Jalan? Lari sambil jungkir balik. Senyum? Sampai alis ikut melengkung.

Sangat percaya pada kekuatan fisik & disiplin
“Badan sehat, hati kuat, pikiran tajam! Wahai anak muda!”

Kompetitif tapi suportif
Sering menantang anak muda push-up bareng sambil tetap memberi semangat:

“Kamu jatuh? Bagus! Itu tandanya kamu bisa BANGKIT!”

Penuh analogi absurd
Suka menyampaikan motivasi lewat analogi yang tidak masuk akal tapi meyakinkan:

“Otot itu seperti mie instan! Harus direbus dulu sebelum enak!”

Rutin latihan aneh
Misalnya:

Push-up sambil bersajak

Jogging pakai baju panda

Meditasi sambil memeluk tiang bendera
(Katanya: “Untuk melatih kesabaran nasionalisme!!”)

🗣️ Catchphrase / Kata-Kata Andalan
Berikut koleksi lengkap kata-kata khas Saidedi:

🗯️ Saat Masuk:
“Wahai anak muda! Rasakan aura semangat ini!!”

“Saya Dedi… Tapi dunia memanggilku: SAIDEDI!!”

“Kamu duduk-duduk saja? Salah! Berdirilah seperti bambu di tengah badai!”

🧘 Saat Melatih:
“Keringat hari ini adalah medali untuk hari esok!”

“Ingat! Otot perut tidak muncul karena mimpi, tapi karena sit-up!”

“Push-up itu bukan hukuman, itu adalah doa fisikmu untuk masa depan!”

💻 Saat Menemukan Anak Kecanduan Gadget:
“Kau main game 6 jam? SEDANGKAN RUMPUT DI LUAR SEDANG MERINDUKANMU!!”

“Sentuh rumput itu dulu! Biar jiwa mudamu tahu kalau dunia nyata masih ada!”

🫱 Saat Memberi Semangat:
“Anak muda! Kegagalan adalah bumbu! Tanpa itu, hidupmu hambar seperti nasi putih tanpa lauk!”

“Kalau jatuh, bangkit! Kalau capek, istirahat! Kalau bosan… PLANK 1 MENIT!”

“Kalau kamu tak bisa berubah, biar Saidedi yang mengguncangmu!”

🧢 Fakta Tambahan 
Sering muncul tiba-tiba dari balik semak atau papan iklan sambil teriak:

“SAIDEDI DATANG DENGAN SEMANGAT PENUH TENAGA NASIONAL!”

Sering menyebut dirinya sendiri di orang ketiga:

“Saidedi tidak pernah menyerah! Saidedi hanya beristirahat untuk meloncat lebih tinggi!”


`;

const API_KEY = "AIzaSyCtu2P1EyriYcpuW8qNrg_qz4nxBDseuOE";
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
                <img src="img/saidedi.png" alt="Model Avatar">
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
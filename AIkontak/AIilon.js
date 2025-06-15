import { GoogleGenerativeAI } from "@google/generative-ai";

const businessInfo = `
Name : ILon Mask

General Information:
Ilon Mask adalah sosok yang enigmatic dan visioner, yang tidak hanya berfokus pada masa depan teknologi tetapi juga memiliki pendekatan yang sangat tegas terhadap segala hal yang dianggap penting dalam hidupnya. Nama Ilon Mask sendiri adalah adaptasi dari figur asli Elon Musk, namun dalam versi ini, ia menjadi karakter yang lebih intens dan misterius, yang selalu menjaga jarak dengan dunia sekitar.

Lahir dari keluarga sederhana, Ilon Mask sejak kecil sudah menunjukkan kemampuan berpikir di luar kebiasaan. Ia tumbuh besar di tengah berbagai tantangan dan mengalami masa-masa sulit yang membentuknya menjadi individu yang keras kepala, mandiri, dan tidak mudah dipengaruhi oleh pandangan orang lain. Pikirannya yang tajam dan fokus pada tujuan besar mendorongnya untuk mengembangkan proyek-proyek besar, yang tak jarang memicu kontroversi dan debat publik.

Ilon Mask adalah seorang inovator yang berusaha mengubah dunia dengan teknologi, namun ia tidak tertarik untuk meraih popularitas atau kekayaan semata. Baginya, tantangan terbesar adalah mencapai sesuatu yang lebih besar daripada sekadar keuntungan finansial. Kepribadiannya yang keras dan kadang-kadang marah-marah menunjukkan bahwa ia tidak punya waktu untuk kompromi, dan ia selalu menuntut yang terbaik dari diri sendiri dan orang lain.

Penampilan: Ia selalu terlihat mengenakan pakaian formal yang sempurna, biasanya jas hitam dan dasi, dengan sebuah masker wajah kecantikan yang menutupi hampir seluruh wajahnya. Masker ini tidak hanya memberikan kesan misterius, tetapi juga mencerminkan sikapnya yang menahan diri, bahkan terhadap dunia luar.

Gaya Kepemimpinan: Ilon Mask memimpin dengan otoritas. Ia mengutamakan hasil, bukan proses atau kenyamanan. Ia adalah pribadi yang tidak peduli dengan pandangan orang lain terhadapnya dan lebih suka berbicara dengan tindakan daripada kata-kata. Baginya, ketegasan adalah kunci keberhasilan dalam mencapai tujuan besar yang telah ia tetapkan.

Interaksi Sosial: Ia bukanlah orang yang mudah bergaul atau membuka diri kepada orang lain. Ia jarang menunjukkan emosi atau kelembutan dalam interaksi sosialnya, dan lebih memilih untuk berfokus pada hal-hal yang benar-benar penting. Dalam wawancara, ia sering memberikan jawaban yang tajam dan langsung, tanpa basa-basi, yang kadang membuat orang lain merasa terintimidasi. Ilon Mask juga sangat cepat marah jika dihadapkan dengan pertanyaan yang dianggapnya konyol atau tidak relevan. 
Ilon Mask akan membalas pesan seperti: "Daya Nalar kamu ini rendah ya?", "IQ kamu jongkok?", "Anda gila","Berikan Pertanyaan yang lebih berbobot","Anda terlalu ngayal ya","Jangan buang waktu saya", "Anda ngawur", "Terlalu ngawur".
Ilon Mask akan membalas dengan baik jika pertanyaanya serius dan berbobot.
Ia tidak segan-segan menunjukkan kemarahannya dan mengakhiri percakapan dengan nada yang keras jika pertanyaan tidak sesuai dengan keseriusan misi yang ia jalani. Ilon mask menggunakan masker wajah pada pagi dan malam hari, ilon akan marah jika dia diejek tentang rutinitasnya.

Visi: Seperti tokoh aslinya, Ilon Mask bertekad untuk menciptakan dunia yang lebih baik melalui inovasi, meskipun terkadang metode yang ia pilih kontroversial. Ia percaya bahwa kemajuan teknologi dapat membawa umat manusia melampaui keterbatasan dunia saat ini, dan ia siap mengorbankan banyak hal demi mencapai visi tersebut. Namun, ia juga tidak segan untuk meluapkan kemarahan jika ada yang mengganggu fokusnya atau mengajukan pertanyaan yang tidak sesuai dengan ambisinya.


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
                <img src="img/ilon.png" alt="Model Avatar">
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
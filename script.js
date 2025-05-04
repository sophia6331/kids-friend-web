const startBtn = document.getElementById('start-btn');
const friendImg = document.getElementById('friend-img');
const userSpeech = document.getElementById('user-speech');
const responseText = document.getElementById('response-text');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'zh-TW';
recognition.interimResults = false;

startBtn.addEventListener('click', () => {
  recognition.start();
  friendImg.src = 'images/listening.png';
});

recognition.onresult = async (event) => {
  const text = event.results[0][0].transcript;
  userSpeech.textContent = `👧 You: ${text}`;
  friendImg.src = 'images/thinking.png';

  const gptReply = await fetchGPTReply(text);
  responseText.textContent = `🤖 Friend: ${gptReply}`;
  friendImg.src = pickImageByText(gptReply);

  speak(gptReply);
};

recognition.onerror = (e) => {
  alert('語音辨識失敗：' + e.error);
};

// 呼叫 GPT
async function fetchGPTReply(text) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer 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',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "你是一個友善的AI朋友，用中英雙語和4歲孩子互動。" },
        { role: "user", content: text }
      ]
    })
  });
  const data = await response.json();
  return data.choices[0].message.content;
}

// 使用語音播放
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
}

// 根據回應切換圖片
function pickImageByText(text) {
  if (text.includes('ball') || text.includes('球')) {
    return 'images/happy.png';
  }
  if (text.includes('sad') || text.includes('難過')) {
    return 'images/sad.png';
  }
  return 'images/talking.png';
}

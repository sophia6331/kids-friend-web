window.onload = () => {
  const startButton = document.getElementById('startButton');
  const userTextDiv = document.getElementById('userText');
  const aiTextDiv = document.getElementById('aiText');

  if (!startButton || !userTextDiv || !aiTextDiv) {
    console.error("某些 DOM 元素找不到，請確認 HTML 結構是否正確！");
    return;
  }

  startButton.addEventListener('click', async () => {
    // 確認瀏覽器支援
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("你的瀏覽器不支援語音辨識，請使用 Chrome！");
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'zh-TW'; // 使用中文語音輸入
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

startButton.textContent = '🎤 聆聽中...';

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      userTextDiv.textContent = `👧 你說：「${transcript}」`;

      // 呼叫 ChatGPT API，取得回覆
      const response = await fetch("http://localhost:3000/chat", ...), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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" // 👈 請替換為你的 API 金鑰
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "你是一位可愛會說中英文的 AI 好朋友，回答要親切、簡單、雙語（中英文）。" },
            { role: "user", content: transcript }
          ]
        })
      });

      const data = await response.json();
      const reply = data.choices[0].message.content;
      aiTextDiv.textContent = `🤖 AI 朋友說：「${reply}」`;

      // 文字轉語音播放
      const utterance = new SpeechSynthesisUtterance(reply);
      utterance.lang = 'en-US'; // 可視情況切換為 zh-TW
      speechSynthesis.speak(utterance);

      startButton.textContent = '🎤 Start Chat';
    };

    recognition.onerror = (event) => {
      console.error("語音辨識錯誤：", event.error);
      startButton.textContent = '🎤 Start Chat';
    };

    recognition.onend = () => {
      console.log("語音辨識結束");
    };
  });
};
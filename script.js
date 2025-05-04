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

    startButton.textContent = '🎤

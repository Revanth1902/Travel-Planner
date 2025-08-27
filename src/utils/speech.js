export const handleVoiceInput = (setInterests) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.onresult = (event) => {
    setInterests(event.results[0][0].transcript);
  };
  recognition.start();
};

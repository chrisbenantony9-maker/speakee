let recognition= null;
let finalTranscript = "";

function startSpeech() {
  const speakBtn = document.getElementById("speakBtn");
  const stopBtn = document.getElementById("stopBtn");
  const status = document.getElementById("status");

  finalTranscript = "";
  document.getElementById("output").innerText = "";

  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;        // ✅ keeps listening
  recognition.interimResults = true;    // ✅ live text

  speakBtn.disabled = true;
  stopBtn.disabled = false;

  status.innerText = "Listening (you can speak freely)";
  status.classList.add("loading");

  recognition.onresult = function (event) {
    let interim = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript + " ";
      } else {
        interim += event.results[i][0].transcript;
      }
    }

    document.getElementById("output").innerText =
      finalTranscript + interim;
  };

  recognition.onerror = function (event) {
    console.error("Speech error:", event.error);
  };

  recognition.start();
}

function stopSpeech() {
  if (!recognition) return;   // 👈 prevents crash

  const speakBtn = document.getElementById("speakBtn");
  const stopBtn = document.getElementById("stopBtn");
  const status = document.getElementById("status");

  recognition.stop();

  speakBtn.disabled = false;
  stopBtn.disabled = true;

  status.innerText = "Processing text...";
  status.classList.remove("loading");

  fetch("/correct", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: finalTranscript })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("corrected").innerText = data.corrected;
    })
    .finally(() => {
      status.innerText = "Idle";
      recognition = null;   // 👈 reset safely
    });
}
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}




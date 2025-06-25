const currentTimeEl = document.getElementById('current-time');
const alarmTimeEl = document.getElementById('alarm-time');
const alarmToneEl = document.getElementById('alarm-tone');
const addAlarmBtn = document.getElementById('add-alarm-btn');
const alarmListEl = document.getElementById('alarm-list');
const alarmSound = document.getElementById('alarm-sound');

let alarms = [];

function updateTime() {
  const now = new Date();
  currentTimeEl.textContent = now.toLocaleTimeString() + ' | ' + now.toLocaleDateString();

  alarms.forEach(alarm => {
    if (alarm.on && alarm.time === now.toTimeString().slice(0,5)) {
      ringAlarm(alarm);
    }
  });
}

function ringAlarm(alarm) {
  if (alarm.tone === 'beep') {
    alarmSound.src = 'https://www.soundjay.com/button/beep-07.wav';
  } else if (alarm.tone === 'ring') {
    alarmSound.src = 'https://www.soundjay.com/button/beep-09.wav';
  } else {
    alarmSound.src = 'https://www.soundjay.com/button/beep-05.wav';
  }
  alarmSound.play();

  if (confirm(`Alarm ${alarm.time} is ringing!\nSnooze?`)) {
    snoozeAlarm(alarm);
  } else {
    dismissAlarm(alarm);
  }
}

function snoozeAlarm(alarm) {
  const [hour, min] = alarm.time.split(':').map(Number);
  const newMin = (min + 5) % 60;
  const newHour = newMin < min ? (hour + 1) % 24 : hour;
  alarm.time = `${String(newHour).padStart(2, '0')}:${String(newMin).padStart(2, '0')}`;
  updateAlarmList();
}

function dismissAlarm(alarm) {
  alarm.on = false;
  updateAlarmList();
}

function addAlarm() {
  const time = alarmTimeEl.value;
  const tone = alarmToneEl.value;
  if (!time) {
    alert("Please select a time!");
    return;
  }
  alarms.push({ time, tone, on: true });
  updateAlarmList();
}

function updateAlarmList() {
  alarmListEl.innerHTML = '';
  alarms.forEach((alarm, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${alarm.time} (${alarm.tone}) 
      <input type="checkbox" ${alarm.on ? 'checked' : ''} onchange="toggleAlarm(${index})">
      <button onclick="deleteAlarm(${index})">Delete</button>
    `;
    alarmListEl.appendChild(li);
  });
}

function toggleAlarm(index) {
  alarms[index].on = !alarms[index].on;
  updateAlarmList();
}

function deleteAlarm(index) {
  alarms.splice(index, 1);
  updateAlarmList();
}

addAlarmBtn.addEventListener('click', addAlarm);

setInterval(updateTime, 1000);
updateTime();

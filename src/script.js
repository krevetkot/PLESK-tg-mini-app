window.onload = function () {
  console.log('load');
  const initData = Telegram.WebApp.initData;

  // Передаем initData на сервер
  fetch("https://telebot-dev.03it.ru:8443/web-app/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ initData })
  }).then(response => response.text()).then(data => {
    console.log("Ответ от сервера:", data);
    //$('.response').text(data);
  });

};

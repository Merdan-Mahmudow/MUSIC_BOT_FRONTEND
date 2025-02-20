import { useState } from 'react';

const TelegramWebApp = window.Telegram.WebApp;

export default function SurveyForm() {
  const [formData, setFormData] = useState({
    name: '',
    recipient: '',
    relationship: '',
    // timeApart: '',
    // lastDayTogether: '',
    // firstWords: '',
    // hardestPart: '',
    // stayingConnected: '',
    // cherishedMoments: '',
    // supportiveWords: '',
    // sourceOfStrength: '',
    // specialThing: '',
    // cherishedThings: '',
    // describeLovedOnes: '',
    // unspokenWords: '',
    // sharedDream: '',
    // reunionMoment: '',
    // emotionalTone: '',
    // musicalStyle: '',
    // essentialWords: '',
    // desiredEmotions: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const botToken = '8151650888:AAFSJqYDHUtrii-7WS8sBDgi0MGtmYosg9k';
      const chatId = TelegramWebApp.initDataUnsafe.user?.id; // Получаем ID пользователя
      if (!chatId) {
        alert("Ошибка: Не удалось получить ваш Telegram ID.");
        return;
      }

      const message = `
📋 *Новая анкета*  
👤 *Имя:* ${formData.name}  
🎵 *Кому песня:* ${formData.recipient}  
❤️ *Кто они для вас:* ${formData.relationship}  
      `;

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown"
        })
      });

      const result = await response.json();
      if (result.ok) {
        alert("✅ Данные успешно отправлены!");
        TelegramWebApp.close(); // Закрываем WebApp
      } else {
        alert("❌ Ошибка при отправке данных.");
      }

    } catch (error) {
      console.error("Ошибка:", error);
      alert("❌ Не удалось отправить данные.");
    }
  };

  return (
    <form className="survey-form" onSubmit={handleSubmit}>
      <h2>🔹 Личность и связь с близкими</h2>
      <label>1. Как вас зовут?</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} />

      <label>2. Кому вы отправляете эту песню?</label>
      <input type="text" name="recipient" value={formData.recipient} onChange={handleChange} />

      <label>Расскажите, кто эти люди для вас:</label>
      <textarea name="relationship" value={formData.relationship} onChange={handleChange}></textarea>

      {/* <label>3. Как долго вы в разлуке?</label>
      <input type="text" name="timeApart" value={formData.timeApart} onChange={handleChange} /> */}

      <button type="submit">Отправить</button>
    </form>
  );
}

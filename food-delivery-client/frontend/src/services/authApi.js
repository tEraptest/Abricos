// Базовый URL твоего API (возьми из application.properties или укажи явно)
const API_BASE_URL = "http://localhost:8080/api/auth"; // Путь к AuthController

export const loginUserApi = async (loginData) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  const data = await response.json(); // Пытаемся распарсить JSON

  if (!response.ok) {
    // Если статус не 2xx, выбрасываем ошибку с текстом ответа сервера
    // Сервер может вернуть просто текст ошибки, а не JSON
    throw new Error(data.message || response.statusText || "Login failed");
    // Или если сервер ТОЧНО возвращает JSON с ошибкой: throw new Error(data.error || 'Login failed');
  }

  return data; // Возвращаем { token: "...", username: "..." }
};

export const registerUserApi = async (registerData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  });

  const data = await response.json();

  if (!response.ok) {
    // Сервер может вернуть просто текст ошибки (как в AuthController)
    // Пытаемся получить текст, если JSON парсинг не удался или message нет
    let errorMessage = "Registration failed";
    try {
      // Попробуем получить текст из ответа, если это не JSON
      if (!response.headers.get("content-type")?.includes("application/json")) {
        errorMessage = await response.text();
      } else {
        errorMessage = data.message || data; // Если JSON, берем message или сам объект/строку
      }
    } catch (e) {
      errorMessage = response.statusText; // На крайний случай статус
    }

    throw new Error(errorMessage);
  }

  return data; // Возвращаем { token: "...", username: "..." }
};

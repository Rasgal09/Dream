import axios from 'axios';
import { useState } from 'react';

const useDietAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dietData, setDietData] = useState(null);

  const generatePrompt = (preferences) => {
    const { goal, activity, dietType, allergies, dislikes, mealsPerDay, cookingTime } = preferences;
    
    const goalsMap = {
      'weight_loss': 'pérdida de peso',
      'muscle_gain': 'ganancia muscular',
      'maintenance': 'mantenimiento',
      'health': 'mejorar salud general'
    };
    
    const activityMap = {
      'sedentary': 'sedentario',
      'light': 'ligero',
      'moderate': 'moderado',
      'active': 'activo',
      'very_active': 'muy activo'
    };
    
    const dietTypeMap = {
      'recommended': 'recomendada',
      'high_protein': 'alta en proteínas',
      'low_carb': 'baja en carbohidratos',
      'keto': 'keto',
      'mediterranean': 'mediterránea',
      'vegetarian': 'vegetariana'
    };
    
    let prompt = `Genera un plan de alimentación detallado con estas características:
    - Objetivo: ${goalsMap[goal] || goal}
    - Nivel de actividad: ${activityMap[activity] || activity}
    - Tipo de dieta: ${dietTypeMap[dietType] || dietType}
    - Comidas por día: ${mealsPerDay}
    - Tiempo máximo de preparación: ${cookingTime} minutos`;
    
    if (allergies && allergies.length > 0) {
      prompt += `\n- Alergias/intolerancias: ${allergies.join(', ')}`;
    }
    
    if (dislikes && dislikes.length > 0) {
      prompt += `\n- Alimentos a evitar: ${dislikes.join(', ')}`;
    }
    
    prompt += `\n\nFormato requerido:
    1. Desglose diario por comidas (desayuno, almuerzo, cena, snacks)
    2. Ingredientes exactos y cantidades
    3. Tiempo de preparación por comida
    4. Valores nutricionales aproximados (calorías, proteínas, carbos, grasas)
    5. 2 opciones de sustitución por comida
    
    Usa emojis (🍎🥑🍗) para hacerlo más visual y separadores claros entre secciones.`;
    
    return prompt;
  };

  const saveDietToDB = async (userId, dietData) => {
    try {
      const response = await axios.post('http://192.168.1.115:3000/guardar-dieta', {
        userId,
        dietText: dietData.dietPlan,
        preferences: dietData.preferences
      });
      return response.data;
    } catch (err) {
      console.error('Error al guardar la dieta:', err);
      throw err;
    }
  };

  const generateDiet = async (userPreferences, userId) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!userPreferences?.goal || !userPreferences?.dietType) {
        throw new Error('Faltan preferencias esenciales para generar la dieta');
      }

      const response = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'Eres un nutricionista experto que genera planes de alimentación personalizados. Proporciona dietas detalladas, saludables y alcanzables con formato claro para móviles.'
            },
            {
              role: 'user',
              content: generatePrompt(userPreferences)
            }
          ],
          temperature: 0.7,
          max_tokens: 3000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${'sk-e7a1e1740ae844fea047b7aac80488d4'}`
          },
          timeout: 1000000
        }
      );

      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('La respuesta de la API no contiene datos válidos');
      }

      const generatedDiet = response.data.choices[0].message.content;
      const dietData = {
        dietPlan: generatedDiet,
        preferences: userPreferences
      };
      
      // Guardar en MongoDB si hay userId
      if (userId) {
        await saveDietToDB(userId, dietData);
      }
      
      setDietData(dietData);
      return dietData;

    } catch (err) {
      console.error('Error al generar la dieta:', err);
      
      let errorMessage = 'Ocurrió un error al generar tu dieta. Por favor intenta nuevamente.';
      
      if (err.response) {
        if (err.response.status === 402) {
          errorMessage = 'Error de suscripción: Verifica tu plan de pago con DeepSeek API.';
        } else if (err.response.status === 401) {
          errorMessage = 'Error de autenticación: API Key inválida.';
        } else if (err.response.status === 429) {
          errorMessage = 'Límite de solicitudes excedido. Intenta más tarde.';
        } else {
          errorMessage = `Error del servidor (${err.response.status}): ${err.response.data?.message || 'Sin detalles'}`;
        }
      } else if (err.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'La solicitud tardó demasiado. Intenta nuevamente.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateDiet, dietData, loading, error, setError };
};

export default useDietAPI;
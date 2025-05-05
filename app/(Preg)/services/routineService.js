const API_URL = 'http://localhost:3000';

export const saveRoutineToDB = async (userId, routineData) => {
    try {
        const response = await fetch(`${API_URL}/rutinas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                ...routineData
            })
        });

        if (!response.ok) throw new Error('Error al guardar la rutina');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const fetchUserRoutines = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/rutinas?userId=${userId}`);
        if (!response.ok) throw new Error('Error al cargar rutinas');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
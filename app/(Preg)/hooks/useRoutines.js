import axios from 'axios';

export const useRoutines = (userId) => {
    const saveRoutine = async (routineData) => {
        try {
            const response = await axios.post('http://192.168.1.126:3000/api/routines/create', {
                userId,
                routineData
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error al guardar la rutina');
        }
    };

    const getUserRoutines = async () => {
        try {
            const response = await axios.get(`http://192.168.1.126:3000/api/routines/user-routines?userId=${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error al obtener rutinas');
        }
    };

    return { saveRoutine, getUserRoutines };
};
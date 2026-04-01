export const getTodayAndTomorrow = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayFormatted = today.toISOString().slice(0, 10);
    const tomorrowFormatted = tomorrow.toISOString().slice(0, 10);

    return {
        today: todayFormatted,
        tomorrow: tomorrowFormatted
    };
};
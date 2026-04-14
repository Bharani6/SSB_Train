/**
 * This engine guarantees that all generic test variables randomly shift specifically at 4:00 AM every single day.
 * It works by taking the current Date, shifting it backwards by 4 hours, and using that absolute YYYY-MM-DD as a seeded hash.
 */
export const getDailySeed = () => {
    const now = new Date();
    // Shift back 4 hours. So if it's 3:59 AM, it counts as yesterday. If it's 4:00 AM, it counts as today.
    now.setHours(now.getHours() - 4);
    const dateString = now.toISOString().split('T')[0];
    
    // Simple hash of date string
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
        hash |= 0; 
    }
    return Math.abs(hash);
};

export const shuffleArrayWithSeed = (originalArray, seed) => {
    const array = [...originalArray];
    let m = array.length, t, i;
    let currentSeed = seed;

    // Fast deterministic seeded random
    const random = () => {
      const x = Math.sin(currentSeed++) * 10000;
      return x - Math.floor(x);
    };

    while (m) {
      i = Math.floor(random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
};

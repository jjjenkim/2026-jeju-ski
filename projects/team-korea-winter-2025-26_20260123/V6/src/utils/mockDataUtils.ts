export const generateAthleteStats = (athleteId: string | number) => {
      // Simple hash function to generate consistent pseudo-random numbers based on ID
      const hash = (str: string) => {
            let h = 0;
            for (let i = 0; i < str.length; i++) {
                  h = 31 * h + str.charCodeAt(i);
            }
            return Math.abs(h);
      };

      const seed = hash(String(athleteId));
      const rand = (min: number, max: number, offset: number = 0) => {
            const x = Math.sin(seed + offset) * 10000;
            const r = x - Math.floor(x);
            return Math.floor(r * (max - min + 1)) + min;
      };

      return {
            radar: {
                  technical: rand(70, 95, 1),
                  stamina: rand(65, 90, 2),
                  strategy: rand(75, 98, 3),
                  mental: rand(60, 95, 4),
                  experience: rand(50, 90, 5),
            },
            volatility: [
                  rand(20, 40, 6),
                  rand(25, 45, 7),
                  rand(30, 50, 8),
                  rand(45, 70, 9),
                  rand(60, 85, 10),
                  rand(80, 100, 11), // Trending up usually looks better
            ],
            probability: rand(25, 85, 12),
            currentRank: rand(1, 50, 13),
      };
};

// Zodiac Signs with symbols, elements, traits, and compatibility
export const zodiacSigns = [
  {
    name: "Aries",
    symbol: "♈",
    element: "Fire",
    dates: "Mar 21 – Apr 19",
    traits: ["Bold", "Ambitious", "Energetic", "Courageous", "Impatient"],
    color: "#FF4444",
    compatible: ["Leo", "Sagittarius", "Gemini", "Aquarius"],
    incompatible: ["Cancer", "Capricorn"]
  },
  {
    name: "Taurus",
    symbol: "♉",
    element: "Earth",
    dates: "Apr 20 – May 20",
    traits: ["Reliable", "Patient", "Devoted", "Stubborn", "Sensual"],
    color: "#4CAF50",
    compatible: ["Virgo", "Capricorn", "Cancer", "Pisces"],
    incompatible: ["Leo", "Aquarius"]
  },
  {
    name: "Gemini",
    symbol: "♊",
    element: "Air",
    dates: "May 21 – Jun 20",
    traits: ["Adaptable", "Curious", "Witty", "Restless", "Social"],
    color: "#FFD700",
    compatible: ["Libra", "Aquarius", "Aries", "Leo"],
    incompatible: ["Virgo", "Pisces"]
  },
  {
    name: "Cancer",
    symbol: "♋",
    element: "Water",
    dates: "Jun 21 – Jul 22",
    traits: ["Intuitive", "Nurturing", "Emotional", "Protective", "Loyal"],
    color: "#C0C0C0",
    compatible: ["Scorpio", "Pisces", "Taurus", "Virgo"],
    incompatible: ["Aries", "Libra"]
  },
  {
    name: "Leo",
    symbol: "♌",
    element: "Fire",
    dates: "Jul 23 – Aug 22",
    traits: ["Dramatic", "Confident", "Creative", "Generous", "Proud"],
    color: "#FF8C00",
    compatible: ["Aries", "Sagittarius", "Gemini", "Libra"],
    incompatible: ["Taurus", "Scorpio"]
  },
  {
    name: "Virgo",
    symbol: "♍",
    element: "Earth",
    dates: "Aug 23 – Sep 22",
    traits: ["Analytical", "Practical", "Kind", "Perfectionist", "Helpful"],
    color: "#8B4513",
    compatible: ["Taurus", "Capricorn", "Cancer", "Scorpio"],
    incompatible: ["Gemini", "Sagittarius"]
  },
  {
    name: "Libra",
    symbol: "♎",
    element: "Air",
    dates: "Sep 23 – Oct 22",
    traits: ["Diplomatic", "Fair", "Romantic", "Indecisive", "Charming"],
    color: "#FF69B4",
    compatible: ["Gemini", "Aquarius", "Leo", "Sagittarius"],
    incompatible: ["Cancer", "Capricorn"]
  },
  {
    name: "Scorpio",
    symbol: "♏",
    element: "Water",
    dates: "Oct 23 – Nov 21",
    traits: ["Passionate", "Resourceful", "Mysterious", "Intense", "Loyal"],
    color: "#8B0000",
    compatible: ["Cancer", "Pisces", "Virgo", "Capricorn"],
    incompatible: ["Leo", "Aquarius"]
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    element: "Fire",
    dates: "Nov 22 – Dec 21",
    traits: ["Adventurous", "Optimistic", "Honest", "Restless", "Philosophical"],
    color: "#9400D3",
    compatible: ["Aries", "Leo", "Libra", "Aquarius"],
    incompatible: ["Virgo", "Pisces"]
  },
  {
    name: "Capricorn",
    symbol: "♑",
    element: "Earth",
    dates: "Dec 22 – Jan 19",
    traits: ["Disciplined", "Ambitious", "Responsible", "Reserved", "Patient"],
    color: "#2F4F4F",
    compatible: ["Taurus", "Virgo", "Scorpio", "Pisces"],
    incompatible: ["Aries", "Libra"]
  },
  {
    name: "Aquarius",
    symbol: "♒",
    element: "Air",
    dates: "Jan 20 – Feb 18",
    traits: ["Independent", "Innovative", "Humanitarian", "Eccentric", "Visionary"],
    color: "#00CED1",
    compatible: ["Gemini", "Libra", "Aries", "Sagittarius"],
    incompatible: ["Taurus", "Scorpio"]
  },
  {
    name: "Pisces",
    symbol: "♓",
    element: "Water",
    dates: "Feb 19 – Mar 20",
    traits: ["Compassionate", "Artistic", "Dreamy", "Intuitive", "Sensitive"],
    color: "#7B68EE",
    compatible: ["Cancer", "Scorpio", "Taurus", "Capricorn"],
    incompatible: ["Gemini", "Sagittarius"]
  }
];

export function getCompatibility(sign1Name, sign2Name) {
  const s1 = zodiacSigns.find(s => s.name === sign1Name);
  const s2 = zodiacSigns.find(s => s.name === sign2Name);
  if (!s1 || !s2) return null;

  if (s1.compatible.includes(sign2Name)) {
    return { level: "High", emoji: "💖", description: `${sign1Name} and ${sign2Name} share a natural harmony. Their energies complement each other beautifully.` };
  } else if (s1.incompatible.includes(sign2Name)) {
    return { level: "Challenging", emoji: "⚡", description: `${sign1Name} and ${sign2Name} may face friction. Their contrasting natures require patience and understanding.` };
  } else {
    return { level: "Moderate", emoji: "🤝", description: `${sign1Name} and ${sign2Name} have a balanced dynamic. With effort, they can build a strong connection.` };
  }
}

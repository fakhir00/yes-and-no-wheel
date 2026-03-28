// Hair Color database — classic + fantasy colors with hex codes
export const hairColors = [
  // Natural / Classic
  { name: "Jet Black", hex: "#0A0A0A", category: "Classic" },
  { name: "Off Black", hex: "#1B1B1B", category: "Classic" },
  { name: "Darkest Brown", hex: "#1C1007", category: "Classic" },
  { name: "Dark Brown", hex: "#3B2219", category: "Classic" },
  { name: "Medium Brown", hex: "#6B4226", category: "Classic" },
  { name: "Light Brown", hex: "#A0522D", category: "Classic" },
  { name: "Chestnut", hex: "#954535", category: "Classic" },
  { name: "Auburn", hex: "#A52A2A", category: "Classic" },
  { name: "Copper", hex: "#B87333", category: "Classic" },
  { name: "Ginger", hex: "#C65D3E", category: "Classic" },
  { name: "Strawberry Blonde", hex: "#D4A76A", category: "Classic" },
  { name: "Dark Blonde", hex: "#B8860B", category: "Classic" },
  { name: "Golden Blonde", hex: "#D4A017", category: "Classic" },
  { name: "Honey Blonde", hex: "#E8B960", category: "Classic" },
  { name: "Light Blonde", hex: "#F0E68C", category: "Classic" },
  { name: "Platinum Blonde", hex: "#E8E4C9", category: "Classic" },
  { name: "Ash Blonde", hex: "#C2B280", category: "Classic" },
  { name: "Silver", hex: "#C0C0C0", category: "Classic" },
  { name: "Grey", hex: "#808080", category: "Classic" },
  { name: "White", hex: "#F5F5F5", category: "Classic" },
  { name: "Dark Red", hex: "#8B0000", category: "Classic" },
  { name: "Burgundy", hex: "#800020", category: "Classic" },
  { name: "Mahogany", hex: "#C04000", category: "Classic" },

  // Fantasy
  { name: "Hot Pink", hex: "#FF69B4", category: "Fantasy" },
  { name: "Bubblegum Pink", hex: "#FFC1CC", category: "Fantasy" },
  { name: "Rose Gold", hex: "#B76E79", category: "Fantasy" },
  { name: "Pastel Pink", hex: "#FFD1DC", category: "Fantasy" },
  { name: "Magenta", hex: "#FF00FF", category: "Fantasy" },
  { name: "Fuchsia", hex: "#FF00FF", category: "Fantasy" },
  { name: "Coral", hex: "#FF7F50", category: "Fantasy" },
  { name: "Fire Engine Red", hex: "#CE2029", category: "Fantasy" },
  { name: "Electric Blue", hex: "#7DF9FF", category: "Fantasy" },
  { name: "Royal Blue", hex: "#4169E1", category: "Fantasy" },
  { name: "Navy Blue", hex: "#000080", category: "Fantasy" },
  { name: "Sky Blue", hex: "#87CEEB", category: "Fantasy" },
  { name: "Pastel Blue", hex: "#AEC6CF", category: "Fantasy" },
  { name: "Teal", hex: "#008080", category: "Fantasy" },
  { name: "Turquoise", hex: "#40E0D0", category: "Fantasy" },
  { name: "Mint Green", hex: "#98FF98", category: "Fantasy" },
  { name: "Emerald Green", hex: "#50C878", category: "Fantasy" },
  { name: "Forest Green", hex: "#228B22", category: "Fantasy" },
  { name: "Lime Green", hex: "#32CD32", category: "Fantasy" },
  { name: "Neon Green", hex: "#39FF14", category: "Fantasy" },
  { name: "Lavender", hex: "#E6E6FA", category: "Fantasy" },
  { name: "Purple", hex: "#800080", category: "Fantasy" },
  { name: "Deep Purple", hex: "#301934", category: "Fantasy" },
  { name: "Lilac", hex: "#C8A2C8", category: "Fantasy" },
  { name: "Violet", hex: "#8F00FF", category: "Fantasy" },
  { name: "Peach", hex: "#FFDAB9", category: "Fantasy" },
  { name: "Sunset Orange", hex: "#FF5F15", category: "Fantasy" },
  { name: "Tangerine", hex: "#FF9966", category: "Fantasy" },
  { name: "Lemon Yellow", hex: "#FFF44F", category: "Fantasy" },
  { name: "Neon Yellow", hex: "#DFFF00", category: "Fantasy" },
  { name: "Rainbow", hex: "#FF0000", category: "Fantasy" },
  { name: "Oil Slick", hex: "#1F1F2E", category: "Fantasy" },
  { name: "Galaxy", hex: "#2B0057", category: "Fantasy" },
  { name: "Cotton Candy", hex: "#FFBCD9", category: "Fantasy" },
  { name: "Mermaid", hex: "#009B77", category: "Fantasy" },
  { name: "Unicorn", hex: "#D473D4", category: "Fantasy" },
];

export const hairCategories = [...new Set(hairColors.map(c => c.category))];

export function getColorsByCategory(category) {
  return hairColors.filter(c => c.category === category);
}

// Name to hex lookup with fuzzy matching
export function nameToHex(name) {
  const found = hairColors.find(c => c.name.toLowerCase() === name.toLowerCase());
  return found ? found.hex : null;
}

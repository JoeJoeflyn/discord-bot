export const getDictionary = async (word: string) => {
  try {
    const response = await fetch(
      `${process.env.URBAN_DICTIONARY_API_URL}${word}`
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch Notion page:", error);
    throw error;
  }
};

export const getFootballStats = async (search: string) => {
  try {
    const response = await fetch(
      `${process.env.FOOTBALL_URL}?q=${search}&location=austin,+texas,+united+states&api_key=${process.env.FOOTBALL_TOKEN}`
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch Notion page:", error);
    throw error;
  }
};

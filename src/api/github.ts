export const getGithub = async (user: string) => {
  try {
    const response = await fetch(`${process.env.GITHUB_URL}${user}`);

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch Notion page:", error);
    throw error;
  }
};

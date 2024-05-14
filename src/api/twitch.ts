export const getTwitch = async () => {
  try {
    const response = await fetch(
      `${process.env.TWITCH_URL}streams?user_login=caseoh_`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITCH_TOKEN}`,
          "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
        },
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch Notion page:", error);
    throw error;
  }
};

export const getTwitchUser = async () => {
  try {
    const response = await fetch(
      `${process.env.TWITCH_URL}users?login=caseoh_`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITCH_TOKEN}`,
          "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
        },
      }
    );

    const { data } = await response.json();

    return data.find((item: unknown) => item);
  } catch (error) {
    console.error("Failed to fetch Notion page:", error);
    throw error;
  }
};

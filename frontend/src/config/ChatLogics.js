export const isSameSenderMargin = (messages, m, i, userId) => {
  // Check if there are more messages
  if (i < messages.length - 1) {
    // If the next message is from the same sender and it's not the logged-in user
    if (
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    ) {
      return 33; // Margin for the same sender
    }
    // If the next message is from a different sender or it's the last message
    if (
      (messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      i === messages.length - 1
    ) {
      return 0; // No margin needed
    }
  }
  // Default margin for the logged-in user's messages
  if (messages[i].sender._id === userId) {
    return 0; // No margin needed
  }
  // Default margin for messages from other users
  return 0;
};

// Gets the name of the other user in the chat who is not the logged-in user
export const getSender = (loggedUser, users) => {
  if (!loggedUser || !users || users.length < 2) {
    return "Unknown"; // Handle missing or invalid data
  }

  // Return the name of the user who is not the logged-in user
  const participant =
    users[0]._id === loggedUser.id ? users[1].name : users[0].name;
  return participant;
};

// Checks if the current message is from a different sender than the next message
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

// Checks if the current message is the last message from a non-logged-in user
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id !== undefined
  );
};

// Checks if the current message is from the same sender as the previous message
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

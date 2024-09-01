const createRoomId = (user1, user2) => `room-${user1.id}-${user2.id}`;

module.exports = createRoomId;

const usersById = new Map();
const usersByEmail = new Map();
let nextId = 1;

function createUser({ name, email, passwordHash }) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = {
    id: String(nextId++),
    name,
    email: normalizedEmail,
    passwordHash,
    role: 'member',
    createdAt: new Date().toISOString(),
  };

  usersById.set(user.id, user);
  usersByEmail.set(normalizedEmail, user);
  return user;
}

function findByEmail(email) {
  return usersByEmail.get(email.trim().toLowerCase()) || null;
}

function findById(id) {
  return usersById.get(String(id)) || null;
}

module.exports = {
  createUser,
  findByEmail,
  findById,
};

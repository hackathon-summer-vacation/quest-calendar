import AsyncStorage from '@react-native-async-storage/async-storage';
import seedUsers from '../data/users.json';
import seedHomework from '../data/homework.json';

const USERS_KEY = 'questCalendar.users';
const HOMEWORK_KEY = 'questCalendar.homework';
const CURRENT_USER_KEY = 'userId';

const clone = (value) => JSON.parse(JSON.stringify(value));

const readJson = async (key, fallback) => {
  const stored = await AsyncStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored);
  }

  const initialValue = clone(fallback);
  await AsyncStorage.setItem(key, JSON.stringify(initialValue));
  return initialValue;
};

const writeJson = async (key, value) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
  return value;
};

export const getUsers = async () => readJson(USERS_KEY, seedUsers);

export const saveUsers = async (users) => writeJson(USERS_KEY, users);

export const getHomework = async () => readJson(HOMEWORK_KEY, seedHomework);

export const saveHomework = async (homework) => writeJson(HOMEWORK_KEY, homework);

export const getCurrentUser = async () => {
  const users = await getUsers();
  const currentUserId = await AsyncStorage.getItem(CURRENT_USER_KEY);
  return users.find((user) => String(user.user_id) === String(currentUserId)) || null;
};

export const loginLocalUser = async (username, password) => {
  const users = await getUsers();
  const user = users.find((item) => item.username === username && item.password === password);

  if (!user) {
    return 'ユーザー名またはパスワードが違います。';
  }

  await AsyncStorage.setItem(CURRENT_USER_KEY, String(user.user_id));
  const { password: _password, ...publicUser } = user;
  return {
    token: `local-${user.user_id}`,
    user: publicUser,
    userId: user.user_id,
  };
};

export const registerLocalUser = async (username, password) => {
  if (!username || !password) {
    return 'ユーザー名とパスワードを入力してください。';
  }

  const users = await getUsers();
  const exists = users.some((user) => user.username === username);
  if (exists) {
    return 'このユーザー名はすでに使われています。';
  }

  const nextId = users.reduce((maxId, user) => Math.max(maxId, Number(user.user_id)), 0) + 1;
  const nextUser = {
    user_id: nextId,
    username,
    password,
    level: 1,
    enemies_defeated: 0,
    bosses_defeated: 0,
    days_until_deadline: 0,
  };

  await saveUsers([...users, nextUser]);
  return '登録できました。ログインしてください。';
};

export const logoutLocalUser = async () => {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
  return { message: 'ログアウトしました。' };
};

export const getUserInfo = async (userId) => {
  const users = await getUsers();
  return users.find((user) => String(user.user_id) === String(userId)) || users[0] || null;
};

export const addHomework = async (payload) => {
  const homework = await getHomework();
  const user = await getUserInfo(payload.user_id);
  const nextId = homework.reduce((maxId, item) => Math.max(maxId, Number(item.id)), 0) + 1;
  const type = Number(payload.type);

  const details = type === 0
    ? {
        frequency: Number(payload.extra?.frequency || 1),
        frequencyText: Number(payload.extra?.frequency || 1) === 1
          ? '毎日'
          : Number(payload.extra?.frequency || 1) === 2
            ? '毎週'
            : `${Number(payload.extra?.frequency || 1)}日おき`,
      }
    : type === 1
      ? { total_pages: Number(payload.extra?.total_pages || 0) }
      : { theme: payload.extra?.theme || '', tasks: [] };

  const nextHomework = {
    id: nextId,
    user_id: Number(payload.user_id || user?.user_id || 1),
    username: user?.username || 'demo',
    title: payload.title,
    deadline: payload.deadline,
    days: Number(payload.days),
    description: payload.description || '',
    type,
    is_done: 0,
    type_name: type === 0 ? '習慣' : type === 1 ? 'ページ' : '研究',
    details,
  };

  await saveHomework([...homework, nextHomework]);
  return nextHomework;
};

export const getCombinedHomework = async (userId = null) => {
  const homework = await getHomework();
  const filteredHomework = userId
    ? homework.filter((item) => String(item.user_id) === String(userId))
    : homework;

  const habits = filteredHomework.filter((item) => Number(item.type) === 0);
  const pages = filteredHomework.filter((item) => Number(item.type) === 1);
  const research = filteredHomework.filter((item) => Number(item.type) === 2);

  return {
    user_id: userId ? Number(userId) : undefined,
    username: filteredHomework[0]?.username || null,
    habits,
    pages,
    research,
    summary: {
      total_homeworks: filteredHomework.length,
      habits_count: habits.length,
      pages_count: pages.length,
      research_count: research.length,
    },
  };
};

export const getUserHomeworkList = async (userId = null) => {
  const homework = await getHomework();
  return userId ? homework.filter((item) => String(item.user_id) === String(userId)) : homework;
};

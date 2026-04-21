import AsyncStorage from '@react-native-async-storage/async-storage';
import seedUsers from '../data/users.json';
import seedHomework from '../data/homework.json';

const USERS_KEY = 'questCalendar.users';
const HOMEWORK_KEY = 'questCalendar.homework';
const CURRENT_USER_KEY = 'userId';
export const GUEST_USER_ID = 1;

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

export const ensureGuestUser = async () => {
  const users = await getUsers();
  const existingUser = users.find((item) => Number(item.user_id) === GUEST_USER_ID) || users[0];
  const guestUser = {
    ...(existingUser || {}),
    user_id: GUEST_USER_ID,
    username: 'ゲスト',
    password: '',
    level: existingUser?.level || 1,
    enemies_defeated: existingUser?.enemies_defeated || 0,
    bosses_defeated: existingUser?.bosses_defeated || 0,
    days_until_deadline: existingUser?.days_until_deadline || 0,
  };
  const normalizedUsers = users.some((item) => Number(item.user_id) === GUEST_USER_ID)
    ? users.map((item) => Number(item.user_id) === GUEST_USER_ID ? guestUser : item)
    : [guestUser, ...users];

  await saveUsers(normalizedUsers);
  await AsyncStorage.setItem(CURRENT_USER_KEY, String(GUEST_USER_ID));
  return guestUser;
};

export const loginLocalUser = async () => {
  const user = await ensureGuestUser();
  const { password: _password, ...publicUser } = user;
  return {
    token: `local-${user.user_id}`,
    user: publicUser,
    userId: user.user_id,
  };
};

export const registerLocalUser = async () => {
  await ensureGuestUser();
  return 'ゲストとして開始します。';
};

export const logoutLocalUser = async () => {
  const user = await ensureGuestUser();
  return { message: 'ゲストとして利用中です。', user };
};

export const getUserInfo = async (userId) => {
  const users = await getUsers();
  return users.find((user) => String(user.user_id) === String(userId || GUEST_USER_ID)) || users[0] || null;
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
    username: user?.username || 'ゲスト',
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

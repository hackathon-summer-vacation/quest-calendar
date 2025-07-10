// カレンダーデータを取得するAPIクライアント

const API_BASE_URL = 'http://localhost:3000/api'; // バックエンドのURL

// 課題データを取得
export const getQuests = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/quests`);
    if (!response.ok) {
      throw new Error('課題データの取得に失敗しました');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('課題データ取得エラー:', error);
    // エラー時はモックデータを返す
    return getMockQuests();
  }
};

// 期間課題データを取得
export const getPeriodQuests = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/period-quests`);
    if (!response.ok) {
      throw new Error('期間課題データの取得に失敗しました');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('期間課題データ取得エラー:', error);
    // エラー時はモックデータを返す
    return getMockPeriodQuests();
  }
};

// 新しい課題を作成
export const createQuest = async (questData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/quests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questData),
    });
    if (!response.ok) {
      throw new Error('課題の作成に失敗しました');
    }
    return await response.json();
  } catch (error) {
    console.error('課題作成エラー:', error);
    throw error;
  }
};

// 新しい期間課題を作成
export const createPeriodQuest = async (periodQuestData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/period-quests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(periodQuestData),
    });
    if (!response.ok) {
      throw new Error('期間課題の作成に失敗しました');
    }
    return await response.json();
  } catch (error) {
    console.error('期間課題作成エラー:', error);
    throw error;
  }
};

// 課題を更新
export const updateQuest = async (questId, questData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/quests/${questId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questData),
    });
    if (!response.ok) {
      throw new Error('課題の更新に失敗しました');
    }
    return await response.json();
  } catch (error) {
    console.error('課題更新エラー:', error);
    throw error;
  }
};

// 課題を削除
export const deleteQuest = async (questId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/quests/${questId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('課題の削除に失敗しました');
    }
    return true;
  } catch (error) {
    console.error('課題削除エラー:', error);
    throw error;
  }
};

// モックデータ（オフライン時やエラー時に使用）
const getMockQuests = () => {
  return {
    '2025-07-03': [
      { id: 1, difficulty: '易', type: '数学', name: '基礎計算問題集', color: '#4CAF50' },
      { id: 2, difficulty: '中', type: '英語', name: 'リーディング演習', color: '#FF9800' }
    ],
    '2025-07-05': [{ id: 3, difficulty: '中', type: '英語', name: 'リーディング演習', color: '#FF9800' }],
    '2025-07-08': [{ id: 4, difficulty: '難', type: '物理', name: '力学応用問題', color: '#F44336' }],
    '2025-07-09': [{ id: 5, difficulty: '易', type: '化学', name: '化学式の暗記', color: '#4CAF50' }],
    '2025-07-10': [{ id: 6, difficulty: '易', type: '化学', name: '化学式の暗記', color: '#4CAF50' }],
    '2025-07-12': [
      { id: 7, difficulty: '中', type: '数学', name: '二次関数グラフ', color: '#FF9800' },
      { id: 8, difficulty: '易', type: '国語', name: '漢字練習', color: '#4CAF50' }
    ],
    '2025-07-15': [{ id: 9, difficulty: '難', type: '英語', name: 'TOEIC模試', color: '#F44336' }],
    '2025-07-18': [{ id: 10, difficulty: '易', type: '生物', name: '細胞の構造', color: '#4CAF50' }],
    '2025-07-20': [{ id: 11, difficulty: '中', type: '物理', name: '波動の基礎', color: '#FF9800' }],
    '2025-07-22': [{ id: 12, difficulty: '難', type: '化学', name: '有機化学反応', color: '#F44336' }],
    '2025-07-25': [{ id: 13, difficulty: '易', type: '数学', name: '確率の基本', color: '#4CAF50' }],
    '2025-07-28': [{ id: 14, difficulty: '中', type: '英語', name: 'ライティング練習', color: '#FF9800' }],
    '2025-07-30': [{ id: 15, difficulty: '難', type: '物理', name: '電磁気学総合', color: '#F44336' }],
  };
};

const getMockPeriodQuests = () => {
  return [
    {
      id: 1,
      startDate: '2025-07-06',
      endDate: '2025-07-09',
      difficulty: '中',
      type: 'プロジェクト',
      name: '夏休み研究',
      color: '#9C27B0'
    },
    {
      id: 2,
      startDate: '2025-07-14',
      endDate: '2025-07-17',
      difficulty: '難',
      type: '試験',
      name: '期末試験週間',
      color: '#FF5722'
    },
    {
      id: 3,
      startDate: '2025-07-23',
      endDate: '2025-07-26',
      difficulty: '易',
      type: '復習',
      name: '復習期間',
      color: '#607D8B'
    }
  ];
};

// 特定の月のデータを取得
export const getQuestsForMonth = async (year, month) => {
  try {
    const response = await fetch(`${API_BASE_URL}/quests/${year}/${month}`);
    if (!response.ok) {
      throw new Error('月別課題データの取得に失敗しました');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('月別課題データ取得エラー:', error);
    // エラー時は現在の月がリクエスト月と一致する場合のみモックデータを返す
    if (year === 2025 && month === 7) {
      return {
        quests: getMockQuests(),
        periodQuests: getMockPeriodQuests()
      };
    }
    return { quests: {}, periodQuests: [] };
  }
};

// データをリフレッシュ
export const refreshCalendarData = async () => {
  try {
    const [quests, periodQuests] = await Promise.all([
      getQuests(),
      getPeriodQuests()
    ]);
    return { quests, periodQuests };
  } catch (error) {
    console.error('カレンダーデータリフレッシュエラー:', error);
    return {
      quests: getMockQuests(),
      periodQuests: getMockPeriodQuests()
    };
  }
};

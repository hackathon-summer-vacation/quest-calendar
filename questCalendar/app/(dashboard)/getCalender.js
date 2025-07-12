// 宿題データをカレンダー用に変換する関数
const convertHomeworkToCalendarData = (homeworkData) => {
  const quests = {};
  const periodQuests = [];

  // 習慣系宿題の処理
  homeworkData.habits.forEach((homework) => {
    // 習慣系は期間課題として処理（現在の日付から締切まで）
    const today = new Date('2025-07-10');
    
    periodQuests.push({
      id: homework.id,
      name: homework.title,
      type: homework.type_name,
      difficulty: homework.details.frequencyText,
      color: '#4CAF50', // 習慣系は緑色
      startDate: today.toISOString().split('T')[0],
      endDate: homework.deadline,
      user: homework.username,
      description: homework.description,
      is_done: homework.is_done,
    });
  });

  // ページ系宿題の処理
  homeworkData.pages.forEach((homework) => {
    // ページ系は締切日までの期間課題として処理
    const today = new Date('2025-07-10');
    const deadline = new Date(homework.deadline);

    periodQuests.push({
      id: homework.id,
      name: homework.title,
      type: homework.type_name,
      difficulty: `${homework.details.total_pages}ページ`,
      color: '#FF9800', // ページ系はオレンジ色
      startDate: today.toISOString().split('T')[0],
      endDate: homework.deadline,
      user: homework.username,
      description: homework.description,
      totalPages: homework.details.total_pages,
      is_done: homework.is_done,
    });
  });

  // 研究系宿題の処理
  homeworkData.research.forEach((homework) => {
    // 研究系メイン課題を締切日に単発課題として追加
    const deadlineDate = homework.deadline;

    if (!quests[deadlineDate]) {
      quests[deadlineDate] = [];
    }

    quests[deadlineDate].push({
      id: homework.id,
      name: homework.title,
      type: homework.type_name,
      difficulty: homework.details.theme,
      color: '#9C27B0', // 研究系は紫色
      user: homework.username,
      description: homework.description,
      theme: homework.details.theme,
      is_done: homework.is_done,
    });

    // 研究タスクを個別の単発課題として追加
    homework.details.tasks.forEach((task) => {
      if (task.deadline) {
        const taskDate = task.deadline;

        if (!quests[taskDate]) {
          quests[taskDate] = [];
        }

        quests[taskDate].push({
          id: `${homework.id}_task_${task.id}`,
          name: `${homework.title}: ${task.content}`,
          type: `${homework.type_name}タスク`,
          difficulty: `タスク${task.task_number}`,
          color: '#673AB7', // 研究タスクは濃い紫色
          user: homework.username,
          description: task.content,
          is_done: task.is_done,
          parentHomework: homework.title,
        });
      }
    });
  });

  return { quests, periodQuests };
};

// homework/combined APIからデータを取得
export const fetchHomeworkData = async (userId = null) => {
  try {
    const baseUrl = 'http://localhost:8000'; // サーバーのベースURL
    const endpoint = userId ? `/homework/combined/user/${userId}` : '/homework/combined';

    const response = await fetch(`${baseUrl}${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const homeworkData = await response.json();
    return homeworkData;
  } catch (error) {
    console.error('宿題データの取得エラー:', error);
    throw error;
  }
};

// カレンダーデータを更新する関数
export const refreshCalendarData = async (userId = null) => {
  try {
    // homework/combined APIからデータを取得
    const homeworkData = await fetchHomeworkData(userId);
    console.log('宿題データ:', homeworkData);
    // カレンダー用データに変換
    const calendarData = convertHomeworkToCalendarData(homeworkData);

    console.log(calendarData)

    return calendarData;
  } catch (error) {
    console.error('カレンダーデータの更新エラー:', error);
    throw error;
  }
};

// 特定ユーザーのカレンダーデータを取得
export const getUserCalendarData = async (userId) => {
  return await refreshCalendarData(userId);
};

// 全ユーザーのカレンダーデータを取得
export const getAllCalendarData = async () => {
  return await refreshCalendarData();
};

// 後方互換性のため既存の関数も残す
export const getQuests = async () => {
  try {
    const data = await refreshCalendarData();
    return data.quests;
  } catch (error) {
    console.error('課題データの取得エラー:', error);
    return {};
  }
};

export const getPeriodQuests = async () => {
  try {
    const data = await refreshCalendarData();
    return data.periodQuests;
  } catch (error) {
    console.error('期間課題データの取得エラー:', error);
    return [];
  }
};

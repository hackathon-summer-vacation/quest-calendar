'use strict';

const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'example.db');
const db = new Database(dbPath);

// 全部の宿題を取得するAPI
router.get('/all', async (req, res) => {
  try {
    // 基本の宿題情報を取得（ユーザー名も含める）
    const homeworks = db
      .prepare(
        `
      SELECT 
        h.id,
        h.user_id,
        u.username,
        h.title,
        h.deadline,
        h.days,
        h.description,
        h.type,
        h.is_done
      FROM homework h
      LEFT JOIN user u ON h.user_id = u.user_id
      ORDER BY h.deadline ASC
    `
      )
      .all();

    // 各宿題の詳細情報を追加
    const homeworksWithDetails = homeworks.map((homework) => {
      let details = {};

      switch (homework.type) {
        case 0: // habit
          const habitInfo = db
            .prepare(
              `
            SELECT frequency 
            FROM habit 
            WHERE homework_id = ?
          `
            )
            .get(homework.id);
          if (habitInfo) {
            details = {
              frequency: habitInfo.frequency,
              frequencyText:
                habitInfo.frequency === 1
                  ? '毎日'
                  : habitInfo.frequency === 2
                  ? '毎週'
                  : `${habitInfo.frequency}日おき`,
            };
          }
          break;

        case 1: // pages
          const pagesInfo = db
            .prepare(
              `
            SELECT total_pages 
            FROM pages 
            WHERE homework_id = ?
          `
            )
            .get(homework.id);
          if (pagesInfo) {
            details = {
              total_pages: pagesInfo.total_pages,
            };
          }
          break;

        case 2: // research
          const researchInfo = db
            .prepare(
              `
            SELECT theme 
            FROM research 
            WHERE homework_id = ?
          `
            )
            .get(homework.id);

          const researchTasks = db
            .prepare(
              `
            SELECT id, task_number, content, deadline, is_done
            FROM research_task 
            WHERE research_id = ?
            ORDER BY task_number ASC
          `
            )
            .all(homework.id);

          if (researchInfo) {
            details = {
              theme: researchInfo.theme,
              tasks: researchTasks,
            };
          }
          break;
      }

      return {
        ...homework,
        type_name: homework.type === 0 ? '習慣' : homework.type === 1 ? 'ページ' : '研究',
        details,
      };
    });

    res.json(homeworksWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 特定のユーザーの宿題を取得するAPI
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // 特定ユーザーの宿題情報を取得
    const homeworks = db
      .prepare(
        `
      SELECT 
        h.id,
        h.user_id,
        u.username,
        h.title,
        h.deadline,
        h.days,
        h.description,
        h.type,
        h.is_done
      FROM homework h
      LEFT JOIN user u ON h.user_id = u.user_id
      WHERE h.user_id = ?
      ORDER BY h.deadline ASC
    `
      )
      .all(userId);

    // 各宿題の詳細情報を追加
    const homeworksWithDetails = homeworks.map((homework) => {
      let details = {};

      switch (homework.type) {
        case 0: // habit
          const habitInfo = db
            .prepare(
              `
            SELECT frequency 
            FROM habit 
            WHERE homework_id = ?
          `
            )
            .get(homework.id);
          if (habitInfo) {
            details = {
              frequency: habitInfo.frequency,
              frequencyText:
                habitInfo.frequency === 1
                  ? '毎日'
                  : habitInfo.frequency === 2
                  ? '毎週'
                  : `${habitInfo.frequency}日おき`,
            };
          }
          break;

        case 1: // pages
          const pagesInfo = db
            .prepare(
              `
            SELECT total_pages 
            FROM pages 
            WHERE homework_id = ?
          `
            )
            .get(homework.id);
          if (pagesInfo) {
            details = {
              total_pages: pagesInfo.total_pages,
            };
          }
          break;

        case 2: // research
          const researchInfo = db
            .prepare(
              `
            SELECT theme 
            FROM research 
            WHERE homework_id = ?
          `
            )
            .get(homework.id);

          const researchTasks = db
            .prepare(
              `
            SELECT id, task_number, content, deadline, is_done
            FROM research_task 
            WHERE research_id = ?
            ORDER BY task_number ASC
          `
            )
            .all(homework.id);

          if (researchInfo) {
            details = {
              theme: researchInfo.theme,
              tasks: researchTasks,
            };
          }
          break;
      }

      return {
        ...homework,
        type_name: homework.type === 0 ? '習慣' : homework.type === 1 ? 'ページ' : '研究',
        details,
      };
    });

    res.json(homeworksWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 宿題テーブル本体のみを取得するAPI
router.get('/basic', async (req, res) => {
  try {
    const homeworks = db
      .prepare(
        `
      SELECT 
        h.id,
        h.user_id,
        u.username,
        h.title,
        h.deadline,
        h.days,
        h.description,
        h.type,
        h.is_done
      FROM homework h
      LEFT JOIN user u ON h.user_id = u.user_id
      ORDER BY h.deadline ASC
    `
      )
      .all();

    const homeworksWithTypeName = homeworks.map((homework) => ({
      ...homework,
      type_name: homework.type === 0 ? '習慣' : homework.type === 1 ? 'ページ' : '研究',
    }));

    res.json(homeworksWithTypeName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 特定ユーザーの宿題テーブル本体のみを取得するAPI
router.get('/basic/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const homeworks = db
      .prepare(
        `
      SELECT 
        h.id,
        h.user_id,
        u.username,
        h.title,
        h.deadline,
        h.days,
        h.description,
        h.type,
        h.is_done
      FROM homework h
      LEFT JOIN user u ON h.user_id = u.user_id
      WHERE h.user_id = ?
      ORDER BY h.deadline ASC
    `
      )
      .all(userId);

    const homeworksWithTypeName = homeworks.map((homework) => ({
      ...homework,
      type_name: homework.type === 0 ? '習慣' : homework.type === 1 ? 'ページ' : '研究',
    }));

    res.json(homeworksWithTypeName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 習慣系宿題のみを取得するAPI
router.get('/habits', async (req, res) => {
  try {
    const habits = db
      .prepare(
        `
      SELECT 
        h.id,
        h.user_id,
        u.username,
        h.title,
        h.deadline,
        h.days,
        h.description,
        h.type,
        h.is_done,
        hab.frequency
      FROM homework h
      LEFT JOIN user u ON h.user_id = u.user_id
      INNER JOIN habit hab ON h.id = hab.homework_id
      WHERE h.type = 0
      ORDER BY h.deadline ASC
    `
      )
      .all();

    const habitsWithDetails = habits.map((habit) => ({
      ...habit,
      type_name: '習慣',
      details: {
        frequency: habit.frequency,
        frequencyText: habit.frequency === 1 ? '毎日' : habit.frequency === 2 ? '毎週' : `${habit.frequency}日おき`,
      },
    }));

    res.json(habitsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 特定ユーザーの習慣系宿題のみを取得するAPI
router.get('/habits/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const habits = db
      .prepare(
        `
      SELECT 
        h.id,
        h.user_id,
        u.username,
        h.title,
        h.deadline,
        h.days,
        h.description,
        h.type,
        h.is_done,
        hab.frequency
      FROM homework h
      LEFT JOIN user u ON h.user_id = u.user_id
      INNER JOIN habit hab ON h.id = hab.homework_id
      WHERE h.type = 0 AND h.user_id = ?
      ORDER BY h.deadline ASC
    `
      )
      .all(userId);

    const habitsWithDetails = habits.map((habit) => ({
      ...habit,
      type_name: '習慣',
      details: {
        frequency: habit.frequency,
        frequencyText: habit.frequency === 1 ? '毎日' : habit.frequency === 2 ? '毎週' : `${habit.frequency}日おき`,
      },
    }));

    res.json(habitsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ページ系宿題のみを取得するAPI
router.get('/pages', async (req, res) => {
  try {
    const pages = db
      .prepare(
        `
      SELECT 
        h.id,
        h.user_id,
        u.username,
        h.title,
        h.deadline,
        h.days,
        h.description,
        h.type,
        h.is_done,
        p.total_pages
      FROM homework h
      LEFT JOIN user u ON h.user_id = u.user_id
      INNER JOIN pages p ON h.id = p.homework_id
      WHERE h.type = 1
      ORDER BY h.deadline ASC
    `
      )
      .all();

    const pagesWithDetails = pages.map((page) => ({
      ...page,
      type_name: 'ページ',
      details: {
        total_pages: page.total_pages,
      },
    }));

    res.json(pagesWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 特定ユーザーのページ系宿題のみを取得するAPI
router.get('/pages/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const pages = db
      .prepare(
        `
      SELECT 
        h.id,
        h.user_id,
        u.username,
        h.title,
        h.deadline,
        h.days,
        h.description,
        h.type,
        h.is_done,
        p.total_pages
      FROM homework h
      LEFT JOIN user u ON h.user_id = u.user_id
      INNER JOIN pages p ON h.id = p.homework_id
      WHERE h.type = 1 AND h.user_id = ?
      ORDER BY h.deadline ASC
    `
      )
      .all(userId);

    const pagesWithDetails = pages.map((page) => ({
      ...page,
      type_name: 'ページ',
      details: {
        total_pages: page.total_pages,
      },
    }));

    res.json(pagesWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 研究系宿題のみを取得するAPI
router.get('/research', async (req, res) => {
  try {
    const research = db
      .prepare(
        `
      SELECT 
        h.id,
        h.user_id,
        u.username,
        h.title,
        h.deadline,
        h.days,
        h.description,
        h.type,
        h.is_done,
        r.theme
      FROM homework h
      LEFT JOIN user u ON h.user_id = u.user_id
      INNER JOIN research r ON h.id = r.homework_id
      WHERE h.type = 2
      ORDER BY h.deadline ASC
    `
      )
      .all();

    const researchWithDetails = research.map((res) => {
      const researchTasks = db
        .prepare(
          `
        SELECT id, task_number, content, deadline, is_done
        FROM research_task 
        WHERE research_id = ?
        ORDER BY task_number ASC
      `
        )
        .all(res.id);

      return {
        ...res,
        type_name: '研究',
        details: {
          theme: res.theme,
          tasks: researchTasks,
        },
      };
    });

    res.json(researchWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 特定ユーザーの研究系宿題のみを取得するAPI
router.get('/research/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const research = db
      .prepare(
        `
      SELECT 
        h.id,
        h.user_id,
        u.username,
        h.title,
        h.deadline,
        h.days,
        h.description,
        h.type,
        h.is_done,
        r.theme
      FROM homework h
      LEFT JOIN user u ON h.user_id = u.user_id
      INNER JOIN research r ON h.id = r.homework_id
      WHERE h.type = 2 AND h.user_id = ?
      ORDER BY h.deadline ASC
    `
      )
      .all(userId);

    const researchWithDetails = research.map((res) => {
      const researchTasks = db
        .prepare(
          `
        SELECT id, task_number, content, deadline, is_done
        FROM research_task 
        WHERE research_id = ?
        ORDER BY task_number ASC
      `
        )
        .all(res.id);

      return {
        ...res,
        type_name: '研究',
        details: {
          theme: res.theme,
          tasks: researchTasks,
        },
      };
    });

    res.json(researchWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 三つのテーブルをまとめて取得するAPI
router.get('/combined', async (req, res) => {
  try {
    // 習慣系宿題を取得
    const habits = db
      .prepare(
        `
      SELECT 
        h.id,
        h.user_id,
        u.username,
        h.title,
        h.deadline,
        h.days,
        h.description,
        h.type,
        h.is_done,
        hab.frequency
      FROM homework h
      LEFT JOIN user u ON h.user_id = u.user_id
      INNER JOIN habit hab ON h.id = hab.homework_id
      WHERE h.type = 0
      ORDER BY h.deadline ASC
    `
      )
      .all();

    // ページ系宿題を取得
    const pages = db
      .prepare(
        `
      SELECT 
        h.id,
        h.user_id,
        u.username,
        h.title,
        h.deadline,
        h.days,
        h.description,
        h.type,
        h.is_done,
        p.total_pages
      FROM homework h
      LEFT JOIN user u ON h.user_id = u.user_id
      INNER JOIN pages p ON h.id = p.homework_id
      WHERE h.type = 1
      ORDER BY h.deadline ASC
    `
      )
      .all();

    // 研究系宿題を取得
    const research = db
      .prepare(
        `
      SELECT 
        h.id,
        h.user_id,
        u.username,
        h.title,
        h.deadline,
        h.days,
        h.description,
        h.type,
        h.is_done,
        r.theme
      FROM homework h
      LEFT JOIN user u ON h.user_id = u.user_id
      INNER JOIN research r ON h.id = r.homework_id
      WHERE h.type = 2
      ORDER BY h.deadline ASC
    `
      )
      .all();

    // 習慣系の詳細情報を追加
    const habitsWithDetails = habits.map((habit) => ({
      ...habit,
      type_name: '習慣',
      details: {
        frequency: habit.frequency,
        frequencyText: habit.frequency === 1 ? '毎日' : habit.frequency === 2 ? '毎週' : `${habit.frequency}日おき`,
      },
    }));

    // ページ系の詳細情報を追加
    const pagesWithDetails = pages.map((page) => ({
      ...page,
      type_name: 'ページ',
      details: {
        total_pages: page.total_pages,
      },
    }));

    // 研究系の詳細情報を追加（タスクも含む）
    const researchWithDetails = research.map((res) => {
      const researchTasks = db
        .prepare(
          `
        SELECT id, task_number, content, deadline, is_done
        FROM research_task 
        WHERE research_id = ?
        ORDER BY task_number ASC
      `
        )
        .all(res.id);

      return {
        ...res,
        type_name: '研究',
        details: {
          theme: res.theme,
          tasks: researchTasks,
        },
      };
    });

    // 全部をまとめて返す
    const combinedData = {
      habits: habitsWithDetails,
      pages: pagesWithDetails,
      research: researchWithDetails,
      summary: {
        total_homeworks: habitsWithDetails.length + pagesWithDetails.length + researchWithDetails.length,
        habits_count: habitsWithDetails.length,
        pages_count: pagesWithDetails.length,
        research_count: researchWithDetails.length,
      },
    };

    res.json(combinedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 特定ユーザーの三つのテーブルをまとめて取得するAPI
router.get('/combined/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // 習慣系宿題を取得
    const habits = db
      .prepare(
        `
      SELECT 
        h.id,
        h.user_id,
        u.username,
        h.title,
        h.deadline,
        h.days,
        h.description,
        h.type,
        h.is_done,
        hab.frequency
      FROM homework h
      LEFT JOIN user u ON h.user_id = u.user_id
      INNER JOIN habit hab ON h.id = hab.homework_id
      WHERE h.type = 0 AND h.user_id = ?
      ORDER BY h.deadline ASC
    `
      )
      .all(userId);

    // ページ系宿題を取得
    const pages = db
      .prepare(
        `
      SELECT 
        h.id,
        h.user_id,
        u.username,
        h.title,
        h.deadline,
        h.days,
        h.description,
        h.type,
        h.is_done,
        p.total_pages
      FROM homework h
      LEFT JOIN user u ON h.user_id = u.user_id
      INNER JOIN pages p ON h.id = p.homework_id
      WHERE h.type = 1 AND h.user_id = ?
      ORDER BY h.deadline ASC
    `
      )
      .all(userId);

    // 研究系宿題を取得
    const research = db
      .prepare(
        `
      SELECT 
        h.id,
        h.user_id,
        u.username,
        h.title,
        h.deadline,
        h.days,
        h.description,
        h.type,
        h.is_done,
        r.theme
      FROM homework h
      LEFT JOIN user u ON h.user_id = u.user_id
      INNER JOIN research r ON h.id = r.homework_id
      WHERE h.type = 2 AND h.user_id = ?
      ORDER BY h.deadline ASC
    `
      )
      .all(userId);

    // 習慣系の詳細情報を追加
    const habitsWithDetails = habits.map((habit) => ({
      ...habit,
      type_name: '習慣',
      details: {
        frequency: habit.frequency,
        frequencyText: habit.frequency === 1 ? '毎日' : habit.frequency === 2 ? '毎週' : `${habit.frequency}日おき`,
      },
    }));

    // ページ系の詳細情報を追加
    const pagesWithDetails = pages.map((page) => ({
      ...page,
      type_name: 'ページ',
      details: {
        total_pages: page.total_pages,
      },
    }));

    // 研究系の詳細情報を追加（タスクも含む）
    const researchWithDetails = research.map((res) => {
      const researchTasks = db
        .prepare(
          `
        SELECT id, task_number, content, deadline, is_done
        FROM research_task 
        WHERE research_id = ?
        ORDER BY task_number ASC
      `
        )
        .all(res.id);

      return {
        ...res,
        type_name: '研究',
        details: {
          theme: res.theme,
          tasks: researchTasks,
        },
      };
    });

    // 全部をまとめて返す
    const combinedData = {
      user_id: parseInt(userId),
      username: habits[0]?.username || pages[0]?.username || research[0]?.username || null,
      habits: habitsWithDetails,
      pages: pagesWithDetails,
      research: researchWithDetails,
      summary: {
        total_homeworks: habitsWithDetails.length + pagesWithDetails.length + researchWithDetails.length,
        habits_count: habitsWithDetails.length,
        pages_count: pagesWithDetails.length,
        research_count: researchWithDetails.length,
      },
    };

    res.json(combinedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

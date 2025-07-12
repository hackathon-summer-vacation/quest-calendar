import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Calendar } from 'react-native-calendars'
import { getQuests, getPeriodQuests, refreshCalendarData } from './getCalender'
import { useRouter } from 'expo-router'

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('')
  const [quests, setQuests] = useState({})
  const [periodQuests, setPeriodQuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    loadCalendarData()
  }, [])

  const loadCalendarData = async () => {
    try {
      setLoading(true)
      setError(null)
      // ユーザーIDを1に固定
      const data = await refreshCalendarData(1)
      console.log(data)
      
      setQuests(data.quests)
      setPeriodQuests(data.periodQuests)
    } catch (err) {
      console.error('カレンダーデータの読み込みエラー:', err)
      setError('データの読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // 課題を始める機能
  const handleStartQuest = (quest) => {
    console.log('課題を始める:', quest)
    Alert.alert(
      '課題を開始',
      `「${quest.title}」を開始しますか？`,
      [
        {
          text: 'キャンセル',
          style: 'cancel'
        },
        {
          text: '開始',
          onPress: () => {
            // 実際の実装ではここで課題詳細画面や実行画面に遷移
            Alert.alert('開始', `「${quest.title}」を開始しました！\n※仮実装：実際の課題画面に遷移予定`)
            // 仮の画面遷移例
            // router.push(`/quest-detail/${quest.id}`)
          }
        }
      ]
    )
  }

  // データを再読み込み
  const handleRefresh = () => {
    loadCalendarData()
  }

  // 特定の日付に該当するすべての課題を取得
  const getAllQuestsForDate = (dateString) => {
    const questsForDate = []

    // 単発課題をチェック（配列形式）
    if (quests[dateString]) {
      quests[dateString].forEach(quest => {
        questsForDate.push({
          ...quest,
          isPeriodQuest: false
        })
      })
    }

    // 期間課題をチェック
    for (const periodQuest of periodQuests) {
      if (dateString >= periodQuest.startDate && dateString <= periodQuest.endDate) {
        questsForDate.push({
          ...periodQuest,
          isPeriodQuest: true
        })
      }
    }

    return questsForDate
  }

  // 後方互換性のため残しておく（カスタム日付コンポーネントで使用）
  const getQuestForDate = (dateString) => {
    // 単発課題の最初の課題を返す
    if (quests[dateString] && quests[dateString].length > 0) {
      return quests[dateString][0]
    }

    // 期間課題をチェック
    for (const periodQuest of periodQuests) {
      if (dateString >= periodQuest.startDate && dateString <= periodQuest.endDate) {
        return periodQuest
      }
    }

    return null
  }

  const onDayPress = (day) => {
    setSelectedDate(day.dateString)
  }

  // カスタム日付コンポーネント（単発課題と期間課題の両方を表示）
  const renderDay = ({date, state}) => {
    // state: 'disabled', 'today', or undefined
    const singleQuests = quests[date.dateString] || [] // 単発課題のみ
    const periodQuestsForDate = periodQuests.filter(pq => 
      date.dateString >= pq.startDate && date.dateString <= pq.endDate
    ) // その日の期間課題を全て取得
    
    // 課題を完了状態でソート（未完了 → 完了済み）
    const sortedSingleQuests = singleQuests.sort((a, b) => (a.is_done || 0) - (b.is_done || 0))
    const sortedPeriodQuests = periodQuestsForDate.sort((a, b) => (a.is_done || 0) - (b.is_done || 0))
    
    const periodQuest = sortedPeriodQuests[0] // 背景色用（最初の期間課題）
    const isSelected = selectedDate === date.dateString
    let textColor = '#2d4150'
    let backgroundColor = 'transparent'
    
    if (state === 'disabled') textColor = '#d9e1e8'
    if (state === 'today') textColor = '#007AFF'
    
    // 背景色の優先順位：未完了の単発課題 > 未完了の期間課題 > 完了済み課題
    const incompleteSingleQuests = sortedSingleQuests.filter(q => !q.is_done)
    const incompletePeriodQuests = sortedPeriodQuests.filter(q => !q.is_done)
    
    if (incompleteSingleQuests.length > 0) {
      backgroundColor = incompleteSingleQuests[0].color + '20'
    } else if (incompletePeriodQuests.length > 0) {
      backgroundColor = incompletePeriodQuests[0].color + '40'
    } else if (sortedSingleQuests.length > 0 || sortedPeriodQuests.length > 0) {
      backgroundColor = '#E0E0E0' // 完了済み課題のみの場合は灰色
    }
    
    if (isSelected) {
      backgroundColor = '#007AFF'
      textColor = '#ffffff'
    }

    // 期間課題の帯状表示スタイル
    let containerStyle = { ...styles.dayContainer }
    
    if (periodQuest) {
      // 期間課題がある場合は、日付間の境界を削除して連続した帯を作成
      containerStyle = {
        ...styles.dayContainer,
        margin: 0,
        marginHorizontal: 0,
        paddingHorizontal: 2,
        borderRadius: 0,
        position: 'relative',
      }
    }

    return (
      <TouchableOpacity 
        style={[containerStyle, { backgroundColor }]}
        onPress={() => onDayPress({dateString: date.dateString})}
      >
        {/* 期間課題の帯を表示 */}
        {periodQuest && (
          <View style={styles.periodQuestBar}>
            {/* メインの帯 */}
            <View 
              style={[
                styles.periodBar,
                {
                  backgroundColor: periodQuest.is_done ? '#BDBDBD' : periodQuest.color,
                  width: '100%',
                  height: 8,
                  top: 6,
                  opacity: 0.8,
                }
              ]} 
            />
            {/* 影効果 */}
            <View 
              style={[
                styles.periodBar,
                {
                  backgroundColor: periodQuest.is_done ? '#BDBDBD' : periodQuest.color,
                  width: '100%',
                  height: 6,
                  top: 7,
                  opacity: 0.4,
                }
              ]} 
            />
            {/* 期間の開始/終了を示すマーカー */}
            {date.dateString === periodQuest.startDate && (
              <View style={[styles.periodMarker, { backgroundColor: periodQuest.is_done ? '#BDBDBD' : periodQuest.color, left: 2 }]} />
            )}
            {date.dateString === periodQuest.endDate && (
              <View style={[styles.periodMarker, { backgroundColor: periodQuest.is_done ? '#BDBDBD' : periodQuest.color, right: 2 }]} />
            )}
          </View>
        )}
        
        <Text style={[styles.dayText, { color: textColor }]}>
          {date.day}
        </Text>
        {/* 単発課題と期間課題の両方を表示 */}
        {(sortedSingleQuests.length > 0 || sortedPeriodQuests.length > 0) && (
          <View style={styles.questsInDayContainer}>
            {/* 単発課題を表示 */}
            {sortedSingleQuests.slice(0, 2).map((quest, index) => (
              <Text
                key={`single-${index}`}
                style={[
                  styles.questNameText,
                  { 
                    color: isSelected ? '#ffffff' : (quest.is_done ? '#888888' : quest.color),
                    fontSize: (sortedSingleQuests.length + sortedPeriodQuests.length) > 1 ? 8 : 9,
                    textDecorationLine: quest.is_done ? 'line-through' : 'none'
                  }
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {quest.is_done ? '✓ ' : ''}{quest.name}
              </Text>
            ))}
            {/* 期間課題を表示（残りスペースに応じて） */}
            {sortedPeriodQuests.slice(0, Math.max(0, 2 - sortedSingleQuests.length)).map((quest, index) => (
              <Text
                key={`period-${index}`}
                style={[
                  styles.questNameText,
                  { 
                    color: isSelected ? '#ffffff' : (quest.is_done ? '#888888' : quest.color),
                    fontSize: (sortedSingleQuests.length + sortedPeriodQuests.length) > 1 ? 8 : 9,
                    textDecorationLine: quest.is_done ? 'line-through' : 'none'
                  }
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {quest.is_done ? '✓ ' : ''}{quest.name}
              </Text>
            ))}
            {/* 課題数が多い場合の表示 */}
            {(sortedSingleQuests.length + sortedPeriodQuests.length) > 2 && (
              <Text
                style={[
                  styles.moreQuestsText,
                  { color: isSelected ? '#ffffff' : '#666' }
                ]}
              >
                +{(sortedSingleQuests.length + sortedPeriodQuests.length) - 2}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    )
  }

  // markedDatesを課題データと選択日付で構築
  const getMarkedDates = () => {
    const marked = {}
    
    // 期間課題の帯状表示設定
    periodQuests.forEach((periodQuest, index) => {
      const startDate = new Date(periodQuest.startDate)
      const endDate = new Date(periodQuest.endDate)
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0]
        const isStart = dateString === periodQuest.startDate
        const isEnd = dateString === periodQuest.endDate
        
        if (!marked[dateString]) {
          marked[dateString] = { periods: [] }
        }
        
        marked[dateString].periods.push({
          startingDay: isStart,
          endingDay: isEnd,
          color: periodQuest.color,
        })
      }
    })
    
    // 単発課題がある日付をマーク（ドットで表示）
    Object.keys(quests).forEach(date => {
      if (!marked[date]) {
        marked[date] = { periods: [] }
      }
      
      // 既存のdotsがあれば追加、なければ新規作成
      if (!marked[date].dots) {
        marked[date].dots = []
      }
      
      // 配列内のすべての課題をドットとして追加
      quests[date].forEach(quest => {
        marked[date].dots.push({ color: quest.color })
      })
    })
    
    // 選択された日付をマーク
    if (selectedDate) {
      if (!marked[selectedDate]) {
        marked[selectedDate] = { periods: [] }
      }
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#007AFF',
      }
    }
    
    return marked
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>課題カレンダー</Text>
      
      {/* ローディング表示 */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>データを読み込み中...</Text>
        </View>
      )}

      {/* エラー表示 */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>再試行</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* カレンダー表示 */}
      {!loading && !error && (
        <>
          <Calendar
            onDayPress={onDayPress}
            markedDates={getMarkedDates()}
            markingType={'custom'}
            current={'2025-07-01'}
            style={styles.calendar}
            dayComponent={renderDay}
            calendarWidth={360}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#007AFF',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#007AFF',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#007AFF',
              selectedDotColor: '#ffffff',
              arrowColor: '#007AFF',
              monthTextColor: '#2d4150',
              indicatorColor: '#007AFF',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
              'stylesheet.calendar.main': {
                container: {
                  paddingLeft: 5,
                  paddingRight: 5,
                }
              }
            }}
          />
          
          {/* リフレッシュボタン */}
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Text style={styles.refreshButtonText}>🔄 更新</Text>
          </TouchableOpacity>
        </>
      )}
      {selectedDate && (
        <View style={styles.selectedDateContainer}>
          {/* 閉じるボタン */}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setSelectedDate('')}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          
          <Text style={styles.selectedDateText}>
            選択された日付: {selectedDate}
          </Text>
          <View style={styles.questsContainer}>
            {getAllQuestsForDate(selectedDate)
              .sort((a, b) => (a.is_done || 0) - (b.is_done || 0)) // 未完了を先に表示
              .map((quest, index) => (
              <View key={index} style={[
                styles.questInfo,
                quest.is_done ? styles.completedQuestInfo : {}
              ]}>
                <Text style={[
                  styles.questName,
                  quest.is_done ? styles.completedQuestName : {}
                ]}>
                  {quest.is_done ? '✓ ' : ''}{quest.isPeriodQuest ? '期間課題: ' : ''}{quest.name}
                </Text>
                <Text style={[
                  styles.questText,
                  quest.is_done ? styles.completedQuestText : {}
                ]}>
                  種類: {quest.type}
                </Text>
                <Text style={[
                  styles.difficultyText, 
                  { color: quest.is_done ? '#888888' : quest.color },
                  quest.is_done ? styles.completedQuestText : {}
                ]}>
                  難易度: {quest.difficulty}
                </Text>
                {quest.isPeriodQuest && (
                  <Text style={[
                    styles.questText,
                    quest.is_done ? styles.completedQuestText : {}
                  ]}>
                    期間: {quest.startDate} ~ {quest.endDate}
                  </Text>
                )}
                <Text style={[
                  styles.completedLabel,
                  { color:  '#000'}
                ]}>
                  {quest.is_done ? '完了済み' : '未完了'}
                </Text>
                {/* 課題を始めるボタン */}
                <TouchableOpacity 
                  style={[
                    styles.startQuestButton,
                    quest.is_done ? styles.completedButton : {}
                  ]}
                  onPress={() => handleStartQuest({ id: quest.id, title: quest.name })}
                  disabled={quest.is_done}
                >
                  <Text style={[
                    styles.startQuestButtonText,
                    quest.is_done ? styles.completedButtonText : {}
                  ]}>
                    {quest.is_done ? '完了済み' : '課題を始める'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {getAllQuestsForDate(selectedDate).length === 0 && (
            <Text style={styles.noQuestText}>この日に課題はありません</Text>
          )}
        </View>
      )}
    </SafeAreaView>
  )
}

export default CalendarScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  calendar: {
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 340,
    marginBottom: 15,
  },
  dayContainer: {
    width: 52,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 0.5,
    padding: 2,
    position: 'relative',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#2d4150',
    textAlign: 'center',
  },
  questNameText: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 1,
    width: 55,
    lineHeight: 9,
  },
  questsInDayContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 1,
  },
  moreQuestsText: {
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 1,
  },
  selectedDateContainer: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  selectedDateText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#007AFF',
    marginBottom: 10,
  },
  questsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  questInfo: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 160,
    maxWidth: 180,
    flex: 1,
    marginBottom: 5,
  },
  questName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  questText: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  noQuestText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  periodQuestBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  periodBar: {
    position: 'absolute',
    borderRadius: 3,
  },
  periodMarker: {
    position: 'absolute',
    width: 4,
    height: 25,
    top: 2,
    borderRadius: 2,
    opacity: 0.9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  startQuestButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  startQuestButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  completedQuestInfo: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },
  completedQuestName: {
    color: '#888888',
    textDecorationLine: 'line-through',
  },
  completedQuestText: {
    color: '#AAAAAA',
  },
  completedLabel: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 4,
  },
  completedButton: {
    backgroundColor: '#CCCCCC',
  },
  completedButtonText: {
    color: '#888888',
  },
});

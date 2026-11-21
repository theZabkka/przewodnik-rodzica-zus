import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
} from 'lucide-react-native';

interface Milestone {
  id: string;
  dayOffset: number;
  timeframe: string;
  title: string;
  description: string;
  institution: string;
  isCrucial?: boolean;
}

const MILESTONES: Milestone[] = [
  {
    id: 'm1',
    dayOffset: 0,
    timeframe: 'Dzień porodu',
    title: 'Karta urodzenia w szpitalu',
    description: 'Szpital przekazuje kartę martwego/żywego urodzenia do USC w ciągu 1-3 dni.',
    institution: 'Szpital',
  },
  {
    id: 'm2',
    dayOffset: 7,
    timeframe: 'Do 7 dni',
    title: 'Zgłoszenie dziecka do ubezpieczenia zdrowotnego NFZ',
    description: 'Jeden z ubezpieczonych rodziców zgłasza dziecko u swojego pracodawcy / w ZUS.',
    institution: 'NFZ / Pracodawca',
  },
  {
    id: 'm3',
    dayOffset: 21,
    timeframe: 'Do 21 dni',
    title: 'Wniosek o zasiłek macierzyński ZAM (stawka 81,5%)',
    description: 'Kluczowy termin! Złożenie wniosku gwarantuje uśrednioną stawkę 81,5% przez cały rok opieki.',
    institution: 'ZUS',
    isCrucial: true,
  },
  {
    id: 'm4',
    dayOffset: 98,
    timeframe: '14. tydzień',
    title: 'Koniec obowiązkowego urlopu macierzyńskiego matki',
    description: 'Od 15. tygodnia matka może wrócić do pracy i przekazać pozostałe 6 tygodni ojcu dziecka.',
    institution: 'Pracodawca',
  },
  {
    id: 'm5',
    dayOffset: 140,
    timeframe: '20. tydzień',
    title: 'Zakończenie podstawowego urlopu macierzyńskiego',
    description: 'Płynne przejście na urlop rodzicielski lub wykorzystanie urlopu uzupełniającego (wcześniaki).',
    institution: 'ZUS',
  },
  {
    id: 'm6',
    dayOffset: 365,
    timeframe: '12. miesiąc życia',
    title: 'Koniec prawa do 14 dni urlopu ojcowskiego',
    description: 'Ojciec musi wykorzystać 2 tygodnie urlopu ojcowskiego przed 1. urodzinami dziecka (potem przepada).',
    institution: 'Pracodawca',
    isCrucial: true,
  },
];

export default function MobileTimelineScreen() {
  const [completedMilestones, setCompletedMilestones] = useState<{ [key: string]: boolean }>({
    m1: true,
    m2: true,
  });

  const toggleMilestone = (id: string) => {
    setCompletedMilestones((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = Object.values(completedMilestones).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / MILESTONES.length) * 100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Nagłówek */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Calendar size={14} color="#00823C" />
            <Text style={styles.badgeText}>TERMINARZ RODZICA</Text>
          </View>
          <Text style={styles.title}>Oś Czasu i Formalności</Text>
          <Text style={styles.subtitle}>
            Krok po kroku od narodzin po pierwszy rok życia dziecka
          </Text>
        </View>

        {/* Pasek Postępu */}
        <View style={styles.progressCard}>
          <View style={styles.progressTopRow}>
            <Text style={styles.progressLabel}>Postęp załatwionych spraw:</Text>
            <Text style={styles.progressPercentText}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressSubtext}>
            Ukończono {completedCount} z {MILESTONES.length} kluczowych formalności
          </Text>
        </View>

        {/* Lista Kroków Osi Czasu */}
        <View style={styles.timelineList}>
          {MILESTONES.map((item, index) => {
            const isDone = !!completedMilestones[item.id];
            const isLast = index === MILESTONES.length - 1;

            return (
              <View key={item.id} style={styles.timelineItemRow}>
                {/* Linia i wskaźnik osi */}
                <View style={styles.timelineIndicatorColumn}>
                  <TouchableOpacity onPress={() => toggleMilestone(item.id)} activeOpacity={0.8}>
                    {isDone ? (
                      <CheckCircle2 size={24} color="#00823C" />
                    ) : (
                      <Circle size={24} color={item.isCrucial ? '#D97706' : '#94A3B8'} />
                    )}
                  </TouchableOpacity>
                  {!isLast && <View style={[styles.timelineVerticalLine, isDone && styles.timelineLineDone]} />}
                </View>

                {/* Zawartość Kafelka */}
                <TouchableOpacity
                  style={[
                    styles.milestoneCard,
                    isDone && styles.milestoneCardDone,
                    item.isCrucial && !isDone && styles.milestoneCardCrucial,
                  ]}
                  onPress={() => toggleMilestone(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.milestoneTopRow}>
                    <View style={styles.timeframeBadge}>
                      <Clock size={11} color="#00823C" />
                      <Text style={styles.timeframeText}>{item.timeframe}</Text>
                    </View>
                    <Text style={styles.institutionTag}>{item.institution}</Text>
                  </View>

                  <Text style={[styles.milestoneTitle, isDone && styles.milestoneTitleDone]}>
                    {item.title}
                  </Text>
                  <Text style={styles.milestoneDescription}>{item.description}</Text>

                  {item.isCrucial && !isDone && (
                    <View style={styles.crucialWarningBox}>
                      <AlertCircle size={14} color="#D97706" />
                      <Text style={styles.crucialWarningText}>Krytyczny termin ustawowy!</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00823C',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  progressPercentText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#00823C',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00823C',
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 11,
    color: '#64748B',
  },
  timelineList: {
    gap: 0,
  },
  timelineItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timelineIndicatorColumn: {
    alignItems: 'center',
    width: 24,
  },
  timelineVerticalLine: {
    width: 2,
    flex: 1,
    minHeight: 80,
    backgroundColor: '#CBD5E1',
    marginVertical: 4,
  },
  timelineLineDone: {
    backgroundColor: '#00823C',
  },
  milestoneCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  milestoneCardDone: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    opacity: 0.85,
  },
  milestoneCardCrucial: {
    borderColor: '#D97706',
    backgroundColor: '#FFFBEB',
  },
  milestoneTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timeframeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  timeframeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00823C',
  },
  institutionTag: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  milestoneTitleDone: {
    textDecorationLine: 'line-through',
    color: '#64748B',
  },
  milestoneDescription: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },
  crucialWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#FDE68A',
  },
  crucialWarningText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
});

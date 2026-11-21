import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Clock,
  ArrowRight,
  Calculator,
  Calendar,
  FileCheck2,
  Phone,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedStage, setSelectedStage] = useState<'pregnancy' | 'newborn' | 'parental'>('newborn');
  const [daysRemaining] = useState<number>(14);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Górny pasek instytucjonalny */}
        <View style={styles.header}>
          <View style={styles.brandBadge}>
            <View style={styles.zusDot} />
            <Text style={styles.zusBadgeText}>ZUS &bull; RZECZPOSPOLITA POLSKA</Text>
          </View>
          <Text style={styles.headerTitle}>Przewodnik Rodzica</Text>
          <Text style={styles.headerSubtitle}>
            Wszystkie prawa, zasiłki i terminy w jednym spokojnym miejscu
          </Text>
        </View>

        {/* Karta głównego terminu 21 dni */}
        <View style={styles.deadlineCard}>
          <View style={styles.deadlineTopRow}>
            <View style={styles.deadlineBadge}>
              <Clock size={14} color="#00823C" />
              <Text style={styles.deadlineBadgeText}>KLUCZOWY TERMIN</Text>
            </View>
            <Text style={styles.deadlineDaysRemaining}>{daysRemaining} dni pozostało</Text>
          </View>

          <Text style={styles.deadlineTitle}>
            Wniosek o zasiłek w stawce 81,5% (ZAM)
          </Text>
          <Text style={styles.deadlineDescription}>
            Złóż wniosek w ciągu 21 dni od narodzin dziecka, aby otrzymać równą, uśrednioną stawkę 81,5% przez cały rok opieki.
          </Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/mobywatel')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>Wypełnij wniosek ZAM</Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Wybór etapu rodzica */}
        <Text style={styles.sectionTitle}>Twój aktualny etap</Text>
        <View style={styles.stageSwitcher}>
          <TouchableOpacity
            style={[styles.stageTab, selectedStage === 'pregnancy' && styles.stageTabActive]}
            onPress={() => setSelectedStage('pregnancy')}
          >
            <Text style={[styles.stageTabText, selectedStage === 'pregnancy' && styles.stageTabTextActive]}>
              W ciąży
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stageTab, selectedStage === 'newborn' && styles.stageTabActive]}
            onPress={() => setSelectedStage('newborn')}
          >
            <Text style={[styles.stageTabText, selectedStage === 'newborn' && styles.stageTabTextActive]}>
              Po porodzie
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stageTab, selectedStage === 'parental' && styles.stageTabActive]}
            onPress={() => setSelectedStage('parental')}
          >
            <Text style={[styles.stageTabText, selectedStage === 'parental' && styles.stageTabTextActive]}>
              Rodzicielski
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamiczny widok etapu */}
        <View style={styles.stageCard}>
          {selectedStage === 'newborn' ? (
            <View style={styles.stageContent}>
              <View style={styles.stageInfoRow}>
                <CheckCircle2 size={18} color="#00823C" />
                <Text style={styles.stageInfoText}>
                  Prawo do 20 tygodni urlopu macierzyńskiego (100% lub 81,5%).
                </Text>
              </View>
              <View style={styles.stageInfoRow}>
                <CheckCircle2 size={18} color="#00823C" />
                <Text style={styles.stageInfoText}>
                  Tata ma 14 dni urlopu ojcowskiego (100% płatne, do 12 m-cy).
                </Text>
              </View>
              <View style={styles.stageInfoRow}>
                <AlertCircle size={18} color="#00823C" />
                <Text style={styles.stageInfoText}>
                  Pamiętaj o zarejestrowaniu dziecka w USC i zgłoszeniu do NFZ w 7 dni.
                </Text>
              </View>
            </View>
          ) : selectedStage === 'pregnancy' ? (
            <View style={styles.stageContent}>
              <View style={styles.stageInfoRow}>
                <CheckCircle2 size={18} color="#00823C" />
                <Text style={styles.stageInfoText}>
                  Zwolnienie e-ZLA z kodem „B” jest płatne w 100% do 270 dni.
                </Text>
              </View>
              <View style={styles.stageInfoRow}>
                <CheckCircle2 size={18} color="#00823C" />
                <Text style={styles.stageInfoText}>
                  Twoja umowa o pracę jest chroniona przed rozwiązaniem.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.stageContent}>
              <View style={styles.stageInfoRow}>
                <CheckCircle2 size={18} color="#00823C" />
                <Text style={styles.stageInfoText}>
                  Możesz łączyć rodzicielski z pracą do 1/2 etatu i wydłużyć urlop!
                </Text>
              </View>
              <View style={styles.stageInfoRow}>
                <AlertCircle size={18} color="#00823C" />
                <Text style={styles.stageInfoText}>
                  Tata ma 9 nieprzenoszalnych tygodni (stawka 70%) – nie pozwól im przepaść!
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Szybkie skróty */}
        <Text style={styles.sectionTitle}>Szybki dostęp</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(tabs)/kalkulator')}
            activeOpacity={0.8}
          >
            <View style={styles.quickIconContainer}>
              <Calculator size={22} color="#00823C" />
            </View>
            <Text style={styles.quickCardTitle}>Kalkulator zasiłków</Text>
            <Text style={styles.quickCardSubtitle}>Sprawdź dokładne kwoty miesięczne</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(tabs)/terminarz')}
            activeOpacity={0.8}
          >
            <View style={styles.quickIconContainer}>
              <Calendar size={22} color="#00823C" />
            </View>
            <Text style={styles.quickCardTitle}>Terminarz i checklista</Text>
            <Text style={styles.quickCardSubtitle}>Krok po kroku przez formalności</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(tabs)/mobywatel')}
            activeOpacity={0.8}
          >
            <View style={styles.quickIconContainer}>
              <FileCheck2 size={22} color="#00823C" />
            </View>
            <Text style={styles.quickCardTitle}>mObywatel ZUS</Text>
            <Text style={styles.quickCardSubtitle}>Cyfrowa karta i wniosek ZAM</Text>
          </TouchableOpacity>
        </View>

        {/* Infolinia wsparcia */}
        <View style={styles.helplineCard}>
          <Phone size={20} color="#00823C" />
          <View style={styles.helplineTextContainer}>
            <Text style={styles.helplineTitle}>Bezpłatna pomoc psychologiczna i medyczna</Text>
            <Text style={styles.helplinePhone}>800 190 590 &bull; Rzecznik Praw Pacjenta</Text>
          </View>
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
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  zusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00823C',
    marginRight: 6,
  },
  zusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00823C',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  deadlineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#00823C',
    marginBottom: 24,
    shadowColor: '#00823C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  deadlineTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deadlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deadlineBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00823C',
    letterSpacing: 0.5,
  },
  deadlineDaysRemaining: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00823C',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  deadlineTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  deadlineDescription: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#00823C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  stageSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  stageTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  stageTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  stageTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  stageTabTextActive: {
    color: '#00823C',
    fontWeight: '700',
  },
  stageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  stageContent: {
    gap: 10,
  },
  stageInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stageInfoText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
    lineHeight: 17,
  },
  quickGrid: {
    gap: 12,
    marginBottom: 24,
  },
  quickCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  quickCardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  helplineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    gap: 12,
  },
  helplineTextContainer: {
    flex: 1,
  },
  helplineTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00823C',
  },
  helplinePhone: {
    fontSize: 11,
    color: '#2E7D32',
    marginTop: 1,
  },
});

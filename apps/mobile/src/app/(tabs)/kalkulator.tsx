import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calculator,
  Check,
  AlertTriangle,
} from 'lucide-react-native';
import { calculateBenefits, ContractType } from '@hacknation/shared';

export default function MobileCalculatorScreen() {
  const [grossSalary, setGrossSalary] = useState<number>(6500);
  const [contractType, setContractType] = useState<ContractType>('employment');
  const [childrenCount, setChildrenCount] = useState<number>(1);
  const [submissionWithin21Days, setSubmissionWithin21Days] = useState<boolean>(true);
  const [isPremature, setIsPremature] = useState<boolean>(false);
  const [workPartTime, setWorkPartTime] = useState<boolean>(false);

  // Uruchomienie certyfikowanego silnika @hacknation/shared
  const calcResult = calculateBenefits({
    parentRole: 'mother',
    contractType,
    monthlyBaseGross: grossSalary > 0 ? grossSalary : 4806,
    childrenCount,
    hasLifeCertificate: false,
    submissionWithin21Days,
    isPrematureOrHospitalized: isPremature,
    birthWeek: isPremature ? 27 : 39,
    birthWeightGrams: isPremature ? 950 : 3500,
    hospitalDaysTotal: isPremature ? 70 : 0,
    workPartTimeDuringParental: workPartTime,
    workFteRatio: workPartTime ? 0.5 : undefined,
    workWeeks: workPartTime ? 32 : undefined,
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Nagłówek */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Calculator size={14} color="#00823C" />
            <Text style={styles.badgeText}>ZUS SILNIK 2026</Text>
          </View>
          <Text style={styles.title}>Kalkulator Zasiłków</Text>
          <Text style={styles.subtitle}>
            Oblicz dokładną wysokość zasiłku macierzyńskiego i rodzicielskiego
          </Text>
        </View>

        {/* Karta Wyniku Głównego */}
        <View style={styles.resultCard}>
          <Text style={styles.resultCardLabel}>SZACUNKOWY ZASIŁEK MIESIĘCZNY (MAMA)</Text>
          <Text style={styles.resultCardAmount}>
            {calcResult.maternityMonthlyBenefit.toFixed(2)} zł
          </Text>
          <View style={styles.resultRateRow}>
            <Text style={styles.resultRateTag}>
              Stawka: {calcResult.momMaternityRatePercent}% podstawy
            </Text>
            <Text style={styles.resultNetBase}>
              Podstawa netto: {calcResult.netBaseMonthly.toFixed(2)} zł
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.resultSummaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Tata (9 tyg. w 70%):</Text>
              <Text style={styles.summaryItemValue}>
                {calcResult.parentalMonthlyBenefitDad.toFixed(2)} zł/mc
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Łączna suma wypłat:</Text>
              <Text style={[styles.summaryItemValue, { color: '#00823C', fontWeight: '800' }]}>
                {calcResult.totalBenefitAmountSum.toFixed(2)} zł
              </Text>
            </View>
          </View>
        </View>

        {/* Formularz Parametrów */}
        <View style={styles.formSection}>
          <Text style={styles.inputLabel}>Miesięczne wynagrodzenie brutto (PLN):</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={grossSalary.toString()}
              onChangeText={(text) => {
                const num = Number(text.replace(/[^0-9]/g, ''));
                setGrossSalary(num);
              }}
            />
            <Text style={styles.currencySuffix}>zł brutto</Text>
          </View>

          {/* Szybkie presety pensji */}
          <View style={styles.presetRow}>
            {[4806, 6500, 8000, 10000].map((val) => (
              <TouchableOpacity
                key={val}
                style={[styles.presetButton, grossSalary === val && styles.presetButtonActive]}
                onPress={() => setGrossSalary(val)}
              >
                <Text style={[styles.presetText, grossSalary === val && styles.presetTextActive]}>
                  {val === 4806 ? '4 806 (min)' : `${val} zł`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tytuł ubezpieczenia */}
          <Text style={[styles.inputLabel, { marginTop: 16 }]}>Forma zatrudnienia:</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.groupButton, contractType === 'employment' && styles.groupButtonActive]}
              onPress={() => setContractType('employment')}
            >
              <Text style={[styles.groupButtonText, contractType === 'employment' && styles.groupButtonTextActive]}>
                Etat (UoP)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.groupButton, contractType === 'mandate' && styles.groupButtonActive]}
              onPress={() => setContractType('mandate')}
            >
              <Text style={[styles.groupButtonText, contractType === 'mandate' && styles.groupButtonTextActive]}>
                Zlecenie
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.groupButton, contractType === 'b2b' && styles.groupButtonActive]}
              onPress={() => setContractType('b2b')}
            >
              <Text style={[styles.groupButtonText, contractType === 'b2b' && styles.groupButtonTextActive]}>
                Firma (JDG)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Liczba dzieci */}
          <Text style={[styles.inputLabel, { marginTop: 16 }]}>Liczba urodzonych dzieci:</Text>
          <View style={styles.buttonGroup}>
            {[1, 2, 3].map((count) => (
              <TouchableOpacity
                key={count}
                style={[styles.groupButton, childrenCount === count && styles.groupButtonActive]}
                onPress={() => setChildrenCount(count)}
              >
                <Text style={[styles.groupButtonText, childrenCount === count && styles.groupButtonTextActive]}>
                  {count === 1 ? '1 dziecko' : count === 2 ? '2 (bliźnięta)' : '3+ dzieci'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Wybór Wariantu 21 dni */}
          <Text style={[styles.inputLabel, { marginTop: 16 }]}>Termin złożenia wniosku ZAM:</Text>
          <TouchableOpacity
            style={[styles.toggleCard, submissionWithin21Days && styles.toggleCardActive]}
            onPress={() => setSubmissionWithin21Days(!submissionWithin21Days)}
            activeOpacity={0.8}
          >
            <View style={styles.toggleCheckbox}>
              {submissionWithin21Days && <Check size={14} color="#FFFFFF" />}
            </View>
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleTitle}>Złożenie wniosku w 21 dni po porodzie</Text>
              <Text style={styles.toggleSubtitle}>
                {submissionWithin21Days
                  ? 'Uśredniona stawka 81,5% przez cały rok opieki'
                  : 'Wariant standardowy: 100% macierzyński, 70% rodzicielski'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Wcześniactwo art. 180² KP */}
          <TouchableOpacity
            style={[styles.toggleCard, isPremature && styles.toggleCardActive]}
            onPress={() => setIsPremature(!isPremature)}
            activeOpacity={0.8}
          >
            <View style={styles.toggleCheckbox}>
              {isPremature && <Check size={14} color="#FFFFFF" />}
            </View>
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleTitle}>Wcześniak lub hospitalizacja noworodka</Text>
              <Text style={styles.toggleSubtitle}>
                Dodatkowy urlop macierzyński do 15 tygodni w 100% (art. 180² KP)
              </Text>
            </View>
          </TouchableOpacity>

          {/* Praca na 1/2 etatu */}
          <TouchableOpacity
            style={[styles.toggleCard, workPartTime && styles.toggleCardActive]}
            onPress={() => setWorkPartTime(!workPartTime)}
            activeOpacity={0.8}
          >
            <View style={styles.toggleCheckbox}>
              {workPartTime && <Check size={14} color="#FFFFFF" />}
            </View>
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleTitle}>Łączenie rodzicielskiego z pracą na 1/2 etatu</Text>
              <Text style={styles.toggleSubtitle}>
                Wydłużenie urlopu rodzicielskiego i zachowanie 100% sumy zasiłku
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Ostrzeżenie prawne jeśli wybrano JDG */}
        {contractType === 'b2b' && (
          <View style={styles.warningBox}>
            <AlertTriangle size={18} color="#D97706" />
            <Text style={styles.warningText}>
              Pamiętaj: zadłużenie w ZUS powyżej 48,06 zł na dzień porodu blokuje wypłatę zasiłku! Spłać dług w ciągu 6 miesięcy, aby odblokować świadczenie.
            </Text>
          </View>
        )}
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
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#00823C',
    marginBottom: 20,
    shadowColor: '#00823C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  resultCardLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  resultCardAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#00823C',
    marginVertical: 4,
  },
  resultRateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultRateTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  resultNetBase: {
    fontSize: 11,
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  resultSummaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
  },
  summaryItemLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  summaryItemValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
  },
  textInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  currencySuffix: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  presetButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#00823C',
  },
  presetText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  presetTextActive: {
    color: '#00823C',
    fontWeight: '700',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  groupButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  groupButtonActive: {
    backgroundColor: '#00823C',
    borderColor: '#00823C',
  },
  groupButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  groupButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 12,
    marginTop: 10,
    gap: 12,
  },
  toggleCardActive: {
    borderColor: '#00823C',
    backgroundColor: '#F0FDF4',
  },
  toggleCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#00823C',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00823C',
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  toggleSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 10,
  },
  warningText: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
    flex: 1,
  },
});

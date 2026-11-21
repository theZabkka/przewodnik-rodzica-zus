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
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Copy,
} from 'lucide-react-native';

export default function MobileMobywatelScreen() {
  const [activeSegment, setActiveSegment] = useState<'card' | 'zam' | 'ezla'>('card');
  const [copiedUpo, setCopiedUpo] = useState<boolean>(false);

  const upoCode = 'UPO-ZUS-2026-984214-ZAM-PL';

  const copyUpo = () => {
    setCopiedUpo(true);
    setTimeout(() => setCopiedUpo(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Nagłówek */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <ShieldCheck size={14} color="#00823C" />
            <Text style={styles.badgeText}>INTEGRACJA RZĄDOWA</Text>
          </View>
          <Text style={styles.title}>mObywatel ZUS</Text>
          <Text style={styles.subtitle}>
            Cyfrowa tożsamość, e-Zwolnienia i status wniosków w KSI ZUS
          </Text>
        </View>

        {/* Przełącznik Widoków */}
        <View style={styles.segmentSwitcher}>
          <TouchableOpacity
            style={[styles.segmentButton, activeSegment === 'card' && styles.segmentButtonActive]}
            onPress={() => setActiveSegment('card')}
          >
            <Text style={[styles.segmentButtonText, activeSegment === 'card' && styles.segmentButtonTextActive]}>
              Karta Rodzica
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentButton, activeSegment === 'zam' && styles.segmentButtonActive]}
            onPress={() => setActiveSegment('zam')}
          >
            <Text style={[styles.segmentButtonText, activeSegment === 'zam' && styles.segmentButtonTextActive]}>
              Wniosek ZAM
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentButton, activeSegment === 'ezla' && styles.segmentButtonActive]}
            onPress={() => setActiveSegment('ezla')}
          >
            <Text style={[styles.segmentButtonText, activeSegment === 'ezla' && styles.segmentButtonTextActive]}>
              e-ZLA (Kod B)
            </Text>
          </TouchableOpacity>
        </View>

        {/* WIDOK 1: Cyfrowa Karta Rodzica mObywatel */}
        {activeSegment === 'card' && (
          <View style={styles.cardContainer}>
            <View style={styles.idCard}>
              <View style={styles.idCardHeader}>
                <View style={styles.idCardLogoRow}>
                  <View style={styles.emblemBadge}>
                    <Text style={styles.emblemText}>RP</Text>
                  </View>
                  <Text style={styles.idCardSystemName}>mObywatel 2.0 &bull; ZUS</Text>
                </View>
                <View style={styles.verifiedTag}>
                  <CheckCircle2 size={12} color="#00823C" />
                  <Text style={styles.verifiedTagText}>AKTYWNA</Text>
                </View>
              </View>

              <Text style={styles.idCardPersonName}>Anna Kowalska</Text>
              <Text style={styles.idCardPesel}>PESEL: 92051408924</Text>

              <View style={styles.idCardDivider} />

              <View style={styles.idCardDetailsRow}>
                <View>
                  <Text style={styles.idDetailLabel}>TYTUŁ UBEZPIECZENIA</Text>
                  <Text style={styles.idDetailValue}>Umowa o pracę (UoP)</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.idDetailLabel}>STAN SKŁADEK W FUS</Text>
                  <Text style={[styles.idDetailValue, { color: '#00823C', fontWeight: '800' }]}>
                    Brak zadłużenia (0,00 zł)
                  </Text>
                </View>
              </View>
            </View>

            {/* Stan PUE / eZUS */}
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Status ubezpieczenia chorobowego</Text>
              <View style={styles.infoCardRow}>
                <Text style={styles.infoCardKey}>Okres wyczekiwania (UoP):</Text>
                <Text style={styles.infoCardVal}>Spełniony (staż &gt; 30 dni)</Text>
              </View>
              <View style={styles.infoCardRow}>
                <Text style={styles.infoCardKey}>Wypłata świadczeń:</Text>
                <Text style={styles.infoCardVal}>Płatnik składek (&gt;20 ubezpieczonych)</Text>
              </View>
              <View style={styles.infoCardRow}>
                <Text style={styles.infoCardKey}>Zgłoszone dziecko:</Text>
                <Text style={styles.infoCardVal}>Jan Kowalski (ur. 2026)</Text>
              </View>
            </View>
          </View>
        )}

        {/* WIDOK 2: Nowy Wniosek ZAM z UPO */}
        {activeSegment === 'zam' && (
          <View style={styles.cardContainer}>
            <View style={styles.upoCard}>
              <View style={styles.upoHeaderRow}>
                <FileCheck size={20} color="#00823C" />
                <Text style={styles.upoTitle}>Urzędowe Poświadczenie Odbioru (UPO)</Text>
              </View>

              <Text style={styles.upoSubtext}>
                Formularz ZAM (zintegrowany wniosek o macierzyński i rodzicielski po reformie 24.10.2026 r.) został skutecznie zarejestrowany w KSI ZUS.
              </Text>

              <View style={styles.upoCodeBox}>
                <Text style={styles.upoCodeText}>{upoCode}</Text>
                <TouchableOpacity onPress={copyUpo} style={styles.copyButton}>
                  <Copy size={14} color="#00823C" />
                  <Text style={styles.copyButtonText}>{copiedUpo ? 'Skopiowano' : 'Kopiuj'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.upoDetails}>
                <View style={styles.upoDetailRow}>
                  <Text style={styles.upoDetailKey}>Wariant zasiłku:</Text>
                  <Text style={styles.upoDetailVal}>81,5% (długi wniosek w 21 dni)</Text>
                </View>
                <View style={styles.upoDetailRow}>
                  <Text style={styles.upoDetailKey}>Wymiar urlopu:</Text>
                  <Text style={styles.upoDetailVal}>52 tygodnie dla matki + 9 tyg. ojca</Text>
                </View>
                <View style={styles.upoDetailRow}>
                  <Text style={styles.upoDetailKey}>Data doręczenia:</Text>
                  <Text style={styles.upoDetailVal}>2026-11-21 15:42 CET</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* WIDOK 3: Elektroniczne Zwolnienie e-ZLA (Kod B) */}
        {activeSegment === 'ezla' && (
          <View style={styles.cardContainer}>
            <View style={styles.ezlaCard}>
              <View style={styles.ezlaHeaderRow}>
                <View style={styles.codeBBadge}>
                  <Text style={styles.codeBText}>KOD B</Text>
                </View>
                <Text style={styles.ezlaHeaderTitle}>Zwolnienie lekarskie w ciąży</Text>
              </View>

              <Text style={styles.ezlaRateHighlight}>100% płatne podstawy wymiaru</Text>
              <Text style={styles.ezlaSubtext}>
                Licznik zasiłkowy: wykorzystano 42 z 270 dopuszczalnych dni zwolnienia w ciąży.
              </Text>

              <View style={styles.ezlaProgressTrack}>
                <View style={[styles.ezlaProgressFill, { width: '15.5%' }]} />
              </View>

              <View style={styles.ezlaDetailsGrid}>
                <View style={styles.ezlaDetailItem}>
                  <Text style={styles.ezlaDetailLabel}>Okres zwolnienia:</Text>
                  <Text style={styles.ezlaDetailVal}>14 dni (kontynuacja)</Text>
                </View>
                <View style={styles.ezlaDetailItem}>
                  <Text style={styles.ezlaDetailLabel}>Płatnik:</Text>
                  <Text style={styles.ezlaDetailVal}>Pracodawca (1-33 dzień)</Text>
                </View>
              </View>
            </View>
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
  segmentSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentButtonTextActive: {
    color: '#00823C',
    fontWeight: '700',
  },
  cardContainer: {
    gap: 16,
  },
  idCard: {
    backgroundColor: '#00823C',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#00823C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  idCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  idCardLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emblemBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  emblemText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#00823C',
  },
  idCardSystemName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  verifiedTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#00823C',
  },
  idCardPersonName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  idCardPesel: {
    fontSize: 12,
    color: '#C8E6C9',
    marginTop: 2,
    letterSpacing: 0.8,
  },
  idCardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 14,
  },
  idCardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  idDetailLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#C8E6C9',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  idDetailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  infoCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  infoCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoCardKey: {
    fontSize: 11,
    color: '#64748B',
  },
  infoCardVal: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
  },
  upoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#00823C',
    gap: 12,
  },
  upoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  upoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00823C',
  },
  upoSubtext: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  upoCodeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 10,
  },
  upoCodeText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: '#0F172A',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copyButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00823C',
  },
  upoDetails: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  upoDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  upoDetailKey: {
    fontSize: 11,
    color: '#64748B',
  },
  upoDetailVal: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
  },
  ezlaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  ezlaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeBBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00823C',
  },
  codeBText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00823C',
  },
  ezlaHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  ezlaRateHighlight: {
    fontSize: 18,
    fontWeight: '800',
    color: '#00823C',
  },
  ezlaSubtext: {
    fontSize: 11,
    color: '#64748B',
  },
  ezlaProgressTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  ezlaProgressFill: {
    height: '100%',
    backgroundColor: '#00823C',
    borderRadius: 4,
  },
  ezlaDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  ezlaDetailItem: {
    flex: 1,
  },
  ezlaDetailLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
  },
  ezlaDetailVal: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
  },
});

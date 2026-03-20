import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, RADIUS, SHADOW } from '../../constants/theme';

const PAYSLIPS = [
  { month: 'February 2026', gross: 55000, deductions: 6200, net: 48800, date: '2026-03-01' },
  { month: 'January 2026', gross: 55000, deductions: 6200, net: 48800, date: '2026-02-01' },
  { month: 'December 2025', gross: 55000, deductions: 6200, net: 48800, date: '2026-01-01' },
  { month: 'November 2025', gross: 55000, deductions: 6200, net: 48800, date: '2025-12-01' },
  { month: 'October 2025', gross: 55000, deductions: 6200, net: 48800, date: '2025-11-01' },
];

const EARNINGS = [
  { label: 'Basic Salary', amount: 30000 },
  { label: 'HRA', amount: 12000 },
  { label: 'Transport Allowance', amount: 3000 },
  { label: 'Special Allowance', amount: 10000 },
];

const DEDUCTIONS = [
  { label: 'PF (Employee)', amount: 3600 },
  { label: 'Professional Tax', amount: 200 },
  { label: 'TDS', amount: 2400 },
];

const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

export default function PayslipsScreen() {
  const [selected, setSelected] = useState(0);
  const p = PAYSLIPS[selected];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Payslips</Text>
          <Text style={styles.subtitle}>View and download monthly payslips</Text>
        </View>

        {/* Payslip List */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listRow}>
          {PAYSLIPS.map((ps, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.payslipChip, selected === i && styles.payslipChipActive]}
              onPress={() => setSelected(i)}
              activeOpacity={0.8}
            >
              <Ionicons name="receipt-outline" size={16} color={selected === i ? COLORS.white : COLORS.primary} />
              <Text style={[styles.payslipChipText, selected === i && styles.payslipChipTextActive]}>{ps.month}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Net Pay Banner */}
        <LinearGradient colors={['#1E40AF', '#2563EB']} style={styles.netBanner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.netLabel}>Net Pay — {p.month}</Text>
          <Text style={styles.netAmount}>{fmt(p.net)}</Text>
          <Text style={styles.netDate}>Generated on {new Date(p.date).toLocaleDateString('en-IN')}</Text>
          <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.85}>
            <Ionicons name="download-outline" size={16} color={COLORS.primary} />
            <Text style={styles.downloadBtnText}>Download PDF</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Summary Row */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderTopColor: COLORS.success }]}>
            <Text style={styles.summaryLabel}>Gross Earnings</Text>
            <Text style={[styles.summaryValue, { color: COLORS.success }]}>{fmt(p.gross)}</Text>
          </View>
          <View style={[styles.summaryCard, { borderTopColor: COLORS.danger }]}>
            <Text style={styles.summaryLabel}>Deductions</Text>
            <Text style={[styles.summaryValue, { color: COLORS.danger }]}>{fmt(p.deductions)}</Text>
          </View>
        </View>

        {/* Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earnings Breakdown</Text>
          <View style={[styles.card, SHADOW.sm]}>
            {EARNINGS.map((e, i) => (
              <View key={i} style={[styles.breakRow, i === EARNINGS.length - 1 && styles.breakRowLast]}>
                <Text style={styles.breakLabel}>{e.label}</Text>
                <Text style={[styles.breakAmount, { color: COLORS.success }]}>{fmt(e.amount)}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Earnings</Text>
              <Text style={[styles.totalValue, { color: COLORS.success }]}>{fmt(p.gross)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deductions Breakdown</Text>
          <View style={[styles.card, SHADOW.sm]}>
            {DEDUCTIONS.map((d, i) => (
              <View key={i} style={[styles.breakRow, i === DEDUCTIONS.length - 1 && styles.breakRowLast]}>
                <Text style={styles.breakLabel}>{d.label}</Text>
                <Text style={[styles.breakAmount, { color: COLORS.danger }]}>{fmt(d.amount)}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Deductions</Text>
              <Text style={[styles.totalValue, { color: COLORS.danger }]}>{fmt(p.deductions)}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgMain },
  header: { padding: 20, paddingBottom: 12 },
  title: { fontSize: SIZES.xxl, fontWeight: '800', color: COLORS.textDark },
  subtitle: { fontSize: SIZES.sm, color: COLORS.textLight, marginTop: 2 },
  listRow: { paddingHorizontal: 20, paddingBottom: 16, gap: 10 },
  payslipChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: RADIUS.full, backgroundColor: COLORS.primaryLight, borderWidth: 1.5, borderColor: COLORS.primaryBorder },
  payslipChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  payslipChipText: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.primary },
  payslipChipTextActive: { color: COLORS.white },
  netBanner: { marginHorizontal: 16, borderRadius: RADIUS.xl, padding: 24, marginBottom: 16, alignItems: 'center' },
  netLabel: { fontSize: SIZES.sm, color: 'rgba(255,255,255,0.75)', fontWeight: '600', marginBottom: 6 },
  netAmount: { fontSize: 36, fontWeight: '800', color: COLORS.white, marginBottom: 4 },
  netDate: { fontSize: SIZES.xs, color: 'rgba(255,255,255,0.6)', marginBottom: 16 },
  downloadBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.white, paddingHorizontal: 20, paddingVertical: 10, borderRadius: RADIUS.full },
  downloadBtnText: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.primary },
  summaryRow: { flexDirection: 'row', gap: 12, marginHorizontal: 16, marginBottom: 16 },
  summaryCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 16, borderTopWidth: 3, ...SHADOW.sm },
  summaryLabel: { fontSize: SIZES.xs, color: COLORS.textLight, fontWeight: '600', marginBottom: 6 },
  summaryValue: { fontSize: SIZES.lg, fontWeight: '800' },
  section: { marginHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textDark, marginBottom: 10 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, overflow: 'hidden' },
  breakRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  breakRowLast: { borderBottomWidth: 0 },
  breakLabel: { fontSize: SIZES.sm, color: COLORS.textMain },
  breakAmount: { fontSize: SIZES.sm, fontWeight: '700' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, backgroundColor: COLORS.bgMain, borderTopWidth: 1, borderTopColor: COLORS.border },
  totalLabel: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.textDark },
  totalValue: { fontSize: SIZES.md, fontWeight: '800' },
});

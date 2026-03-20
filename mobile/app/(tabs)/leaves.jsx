import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { COLORS, SIZES, RADIUS, SHADOW } from '../../constants/theme';

const LEAVE_BALANCE = [
  { type: 'Casual Leave', total: 12, used: 4, color: COLORS.primary },
  { type: 'Sick Leave', total: 8, used: 2, color: COLORS.success },
  { type: 'Earned Leave', total: 15, used: 6, color: COLORS.purple },
  { type: 'Comp Off', total: 3, used: 1, color: COLORS.warning },
];

const HISTORY = [
  { id: 1, type: 'Casual Leave', from: '2026-03-10', to: '2026-03-11', days: 2, reason: 'Personal work', status: 'Approved' },
  { id: 2, type: 'Sick Leave', from: '2026-02-20', to: '2026-02-20', days: 1, reason: 'Fever', status: 'Approved' },
  { id: 3, type: 'Earned Leave', from: '2026-01-15', to: '2026-01-17', days: 3, reason: 'Family function', status: 'Rejected' },
  { id: 4, type: 'Casual Leave', from: '2026-03-25', to: '2026-03-26', days: 2, reason: 'Travel', status: 'Pending' },
];

const STATUS_STYLE = {
  Approved: { color: COLORS.success, bg: COLORS.successLight, icon: 'checkmark-circle' },
  Rejected: { color: COLORS.danger, bg: COLORS.dangerLight, icon: 'close-circle' },
  Pending: { color: COLORS.warning, bg: COLORS.warningLight, icon: 'time' },
};

export default function LeavesScreen() {
  const [tab, setTab] = useState('balance');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: '', from: '', to: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.type || !form.from || !form.to || !form.reason) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please fill all fields.' });
      return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    setSubmitting(false);
    setShowModal(false);
    setForm({ type: '', from: '', to: '', reason: '' });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Toast.show({ type: 'success', text1: 'Leave Applied!', text2: 'Your request has been submitted.' });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Leaves</Text>
          <Text style={styles.subtitle}>Manage your leave balance</Text>
        </View>
        <TouchableOpacity style={styles.applyBtn} onPress={() => setShowModal(true)} activeOpacity={0.85}>
          <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.applyBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Ionicons name="add" size={18} color={COLORS.white} />
            <Text style={styles.applyBtnText}>Apply</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {['balance', 'history'].map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t === 'balance' ? 'Leave Balance' : 'History'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        {tab === 'balance' ? (
          LEAVE_BALANCE.map((lb, i) => {
            const remaining = lb.total - lb.used;
            const pct = (lb.used / lb.total) * 100;
            return (
              <View key={i} style={[styles.balanceCard, { borderLeftColor: lb.color }, SHADOW.sm]}>
                <View style={styles.balanceTop}>
                  <Text style={styles.balanceType}>{lb.type}</Text>
                  <Text style={[styles.balanceRemaining, { color: lb.color }]}>{remaining} left</Text>
                </View>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: lb.color }]} />
                </View>
                <View style={styles.balanceMeta}>
                  <Text style={styles.balanceMetaText}>Used: {lb.used}</Text>
                  <Text style={styles.balanceMetaText}>Total: {lb.total}</Text>
                </View>
              </View>
            );
          })
        ) : (
          HISTORY.map((row) => {
            const s = STATUS_STYLE[row.status];
            return (
              <View key={row.id} style={[styles.historyCard, SHADOW.sm]}>
                <View style={styles.historyTop}>
                  <View style={styles.historyLeft}>
                    <Text style={styles.historyType}>{row.type}</Text>
                    <Text style={styles.historyDates}>{new Date(row.from).toLocaleDateString('en-IN')} – {new Date(row.to).toLocaleDateString('en-IN')}</Text>
                  </View>
                  <View style={[styles.statusChip, { backgroundColor: s.bg }]}>
                    <Ionicons name={s.icon} size={12} color={s.color} />
                    <Text style={[styles.statusText, { color: s.color }]}>{row.status}</Text>
                  </View>
                </View>
                <View style={styles.historyBottom}>
                  <View style={styles.historyMeta}>
                    <Ionicons name="calendar-outline" size={13} color={COLORS.textMuted} />
                    <Text style={styles.historyMetaText}>{row.days} day{row.days > 1 ? 's' : ''}</Text>
                  </View>
                  <Text style={styles.historyReason} numberOfLines={1}>{row.reason}</Text>
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Apply Leave Modal */}
      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply for Leave</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.modalClose}>
                <Ionicons name="close" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Leave Type</Text>
                <View style={styles.typeGrid}>
                  {LEAVE_BALANCE.map(lb => (
                    <TouchableOpacity
                      key={lb.type}
                      style={[styles.typeChip, form.type === lb.type && { backgroundColor: lb.color, borderColor: lb.color }]}
                      onPress={() => setForm(f => ({ ...f, type: lb.type }))}
                    >
                      <Text style={[styles.typeChipText, form.type === lb.type && { color: COLORS.white }]}>{lb.type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>From Date</Text>
                  <TextInput style={styles.formInput} placeholder="YYYY-MM-DD" placeholderTextColor={COLORS.textPlaceholder} value={form.from} onChangeText={v => setForm(f => ({ ...f, from: v }))} />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>To Date</Text>
                  <TextInput style={styles.formInput} placeholder="YYYY-MM-DD" placeholderTextColor={COLORS.textPlaceholder} value={form.to} onChangeText={v => setForm(f => ({ ...f, to: v }))} />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Reason</Text>
                <TextInput style={[styles.formInput, styles.formTextarea]} placeholder="Reason for leave..." placeholderTextColor={COLORS.textPlaceholder} value={form.reason} onChangeText={v => setForm(f => ({ ...f, reason: v }))} multiline numberOfLines={3} textAlignVertical="top" />
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting} activeOpacity={0.85}>
                <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.submitBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.submitBtnText}>{submitting ? 'Submitting...' : 'Submit Request'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgMain },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 12 },
  title: { fontSize: SIZES.xxl, fontWeight: '800', color: COLORS.textDark },
  subtitle: { fontSize: SIZES.sm, color: COLORS.textLight, marginTop: 2 },
  applyBtn: { borderRadius: RADIUS.md, overflow: 'hidden', ...SHADOW.sm },
  applyBtnGrad: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10 },
  applyBtnText: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.white },
  tabRow: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: COLORS.borderLight, borderRadius: RADIUS.md, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: RADIUS.sm },
  tabActive: { backgroundColor: COLORS.white, ...SHADOW.sm },
  tabText: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.textLight },
  tabTextActive: { color: COLORS.primary },
  body: { paddingHorizontal: 20, gap: 12 },
  balanceCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 18, borderLeftWidth: 4 },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  balanceType: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textDark },
  balanceRemaining: { fontSize: SIZES.lg, fontWeight: '800' },
  progressBg: { height: 6, backgroundColor: COLORS.borderLight, borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 3 },
  balanceMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  balanceMetaText: { fontSize: SIZES.xs, color: COLORS.textMuted },
  historyCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 16 },
  historyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  historyLeft: { flex: 1 },
  historyType: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textDark },
  historyDates: { fontSize: SIZES.xs, color: COLORS.textLight, marginTop: 2 },
  statusChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  statusText: { fontSize: SIZES.xs, fontWeight: '700' },
  historyBottom: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  historyMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  historyMetaText: { fontSize: SIZES.xs, color: COLORS.textMuted },
  historyReason: { fontSize: SIZES.xs, color: COLORS.textLight, flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '90%' },
  modalHandle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: SIZES.lg, fontWeight: '800', color: COLORS.textDark },
  modalClose: { width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.bgMain, justifyContent: 'center', alignItems: 'center' },
  formGroup: { marginBottom: 18 },
  formLabel: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.textMain, marginBottom: 8 },
  formInput: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: 12, fontSize: SIZES.md, color: COLORS.textDark, backgroundColor: COLORS.bgMain },
  formTextarea: { height: 80, paddingTop: 12 },
  formRow: { flexDirection: 'row', gap: 12 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white },
  typeChipText: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.textMain },
  submitBtn: { borderRadius: RADIUS.md, overflow: 'hidden', marginTop: 8, marginBottom: 20 },
  submitBtnGrad: { paddingVertical: 16, alignItems: 'center' },
  submitBtnText: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.white },
});

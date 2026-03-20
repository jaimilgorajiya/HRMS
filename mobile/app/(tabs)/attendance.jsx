import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, RADIUS, SHADOW } from '../../constants/theme';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const generateMockData = (year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  const marks = {};
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    if (date > today) continue;
    const day = date.getDay();
    const key = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (day === 0 || day === 6) { marks[key] = { status: 'weekend' }; continue; }
    const r = Math.random();
    if (r < 0.82) marks[key] = { status: r < 0.15 ? 'late' : 'present', punchIn: `0${8 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}`, punchOut: `1${7 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}` };
    else if (r < 0.9) marks[key] = { status: 'absent' };
    else marks[key] = { status: 'leave', leaveType: 'Casual Leave' };
  }
  return marks;
};

const STATUS = {
  present: { color: COLORS.success, bg: COLORS.successLight, label: 'Present', dot: '#10B981' },
  late: { color: COLORS.warning, bg: COLORS.warningLight, label: 'Late', dot: '#F59E0B' },
  absent: { color: COLORS.danger, bg: COLORS.dangerLight, label: 'Absent', dot: '#EF4444' },
  leave: { color: COLORS.purple, bg: COLORS.purpleLight, label: 'Leave', dot: '#8B5CF6' },
  weekend: { color: COLORS.textMuted, bg: COLORS.bgMain, label: 'Weekend', dot: '#CBD5E1' },
};

function SimpleCalendar({ year, month, data, selected, onDayPress, onMonthChange }) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    const d = new Date(year, month - 2, 1);
    onMonthChange({ year: d.getFullYear(), month: d.getMonth() + 1 });
  };
  const nextMonth = () => {
    const d = new Date(year, month, 1);
    onMonthChange({ year: d.getFullYear(), month: d.getMonth() + 1 });
  };

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <View style={cal.wrap}>
      {/* Nav */}
      <View style={cal.nav}>
        <TouchableOpacity onPress={prevMonth} style={cal.navBtn}>
          <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={cal.monthTitle}>{monthName}</Text>
        <TouchableOpacity onPress={nextMonth} style={cal.navBtn}>
          <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      {/* Day headers */}
      <View style={cal.row}>
        {DAYS.map(d => <Text key={d} style={cal.dayHeader}>{d}</Text>)}
      </View>
      {/* Cells */}
      <View style={cal.grid}>
        {cells.map((d, i) => {
          if (!d) return <View key={`e-${i}`} style={cal.cell} />;
          const key = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const rec = data[key];
          const cfg = rec ? STATUS[rec.status] : null;
          const isToday = today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === d;
          const isSelected = selected === key;
          return (
            <TouchableOpacity
              key={key}
              style={[cal.cell, cfg && { backgroundColor: cfg.bg }, isSelected && { backgroundColor: cfg?.color || COLORS.primary }, isToday && cal.todayCell]}
              onPress={() => rec && rec.status !== 'weekend' && onDayPress(key)}
              activeOpacity={0.7}
            >
              <Text style={[cal.dayText, cfg && { color: cfg.color }, isSelected && { color: COLORS.white }, isToday && cal.todayText]}>
                {d}
              </Text>
              {cfg && cfg.dot && !isSelected && (
                <View style={[cal.dot, { backgroundColor: cfg.dot }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function AttendanceScreen() {
  const today = new Date();
  const [selected, setSelected] = useState(null);
  const [currentMonth, setCurrentMonth] = useState({ year: today.getFullYear(), month: today.getMonth() + 1 });
  const data = generateMockData(currentMonth.year, currentMonth.month);

  const counts = Object.values(data).reduce((a, r) => { a[r.status] = (a[r.status] || 0) + 1; return a; }, {});
  const selectedRec = selected ? data[selected] : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Attendance</Text>
          <Text style={styles.subtitle}>{new Date(currentMonth.year, currentMonth.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</Text>
        </View>

        {/* Summary */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summaryRow}>
          {[
            { label: 'Present', count: (counts.present || 0) + (counts.late || 0), color: COLORS.success, bg: COLORS.successLight },
            { label: 'Absent', count: counts.absent || 0, color: COLORS.danger, bg: COLORS.dangerLight },
            { label: 'Late', count: counts.late || 0, color: COLORS.warning, bg: COLORS.warningLight },
            { label: 'On Leave', count: counts.leave || 0, color: COLORS.purple, bg: COLORS.purpleLight },
          ].map((s, i) => (
            <View key={i} style={[styles.summaryCard, { borderLeftColor: s.color, backgroundColor: s.bg }, SHADOW.sm]}>
              <Text style={[styles.summaryCount, { color: s.color }]}>{s.count}</Text>
              <Text style={styles.summaryLabel}>{s.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Calendar */}
        <View style={[styles.calCard, SHADOW.sm]}>
          <SimpleCalendar
            year={currentMonth.year}
            month={currentMonth.month}
            data={data}
            selected={selected}
            onDayPress={(key) => setSelected(key === selected ? null : key)}
            onMonthChange={setCurrentMonth}
          />
          <View style={styles.legend}>
            {Object.entries(STATUS).filter(([k]) => k !== 'weekend').map(([k, v]) => (
              <View key={k} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: v.dot }]} />
                <Text style={styles.legendLabel}>{v.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Detail */}
        {selectedRec && (
          <View style={[styles.detailCard, SHADOW.sm]}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailDate}>{new Date(selected).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
              <View style={[styles.statusChip, { backgroundColor: STATUS[selectedRec.status]?.bg }]}>
                <Text style={[styles.statusChipText, { color: STATUS[selectedRec.status]?.color }]}>{STATUS[selectedRec.status]?.label}</Text>
              </View>
            </View>
            {selectedRec.punchIn && (
              <View style={styles.detailRows}>
                {[
                  { icon: 'log-in-outline', label: 'Punch In', value: selectedRec.punchIn },
                  { icon: 'log-out-outline', label: 'Punch Out', value: selectedRec.punchOut },
                ].map((r, i) => (
                  <View key={i} style={styles.detailRow}>
                    <View style={styles.detailRowIcon}><Ionicons name={r.icon} size={18} color={COLORS.primary} /></View>
                    <View><Text style={styles.detailRowLabel}>{r.label}</Text><Text style={styles.detailRowValue}>{r.value}</Text></View>
                  </View>
                ))}
              </View>
            )}
            {selectedRec.status === 'absent' && (
              <View style={styles.absentNote}>
                <Ionicons name="close-circle-outline" size={18} color={COLORS.danger} />
                <Text style={styles.absentText}>Marked absent for this day</Text>
              </View>
            )}
            {selectedRec.status === 'leave' && (
              <View style={styles.detailRow}>
                <View style={styles.detailRowIcon}><Ionicons name="leaf-outline" size={18} color={COLORS.purple} /></View>
                <View><Text style={styles.detailRowLabel}>Leave Type</Text><Text style={styles.detailRowValue}>{selectedRec.leaveType}</Text></View>
              </View>
            )}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const cal = StyleSheet.create({
  wrap: { padding: 12 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  navBtn: { padding: 8 },
  monthTitle: { fontSize: SIZES.base, fontWeight: '800', color: COLORS.textDark },
  row: { flexDirection: 'row', marginBottom: 4 },
  dayHeader: { flex: 1, textAlign: 'center', fontSize: SIZES.xs, fontWeight: '700', color: COLORS.textLight, paddingVertical: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8, padding: 2 },
  dayText: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.textDark },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  todayCell: { borderWidth: 1.5, borderColor: COLORS.primary },
  todayText: { color: COLORS.primary, fontWeight: '800' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgMain },
  header: { padding: 20, paddingBottom: 8 },
  title: { fontSize: SIZES.xxl, fontWeight: '800', color: COLORS.textDark },
  subtitle: { fontSize: SIZES.sm, color: COLORS.textLight, marginTop: 2 },
  summaryRow: { paddingHorizontal: 20, paddingVertical: 12, gap: 12 },
  summaryCard: { paddingHorizontal: 18, paddingVertical: 14, borderRadius: RADIUS.lg, borderLeftWidth: 4, minWidth: 90, alignItems: 'center' },
  summaryCount: { fontSize: SIZES.xxl, fontWeight: '800' },
  summaryLabel: { fontSize: SIZES.xs, color: COLORS.textLight, fontWeight: '600', marginTop: 2 },
  calCard: { marginHorizontal: 16, backgroundColor: COLORS.white, borderRadius: RADIUS.xl, overflow: 'hidden', marginBottom: 16 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: SIZES.xs, color: COLORS.textLight, fontWeight: '500' },
  detailCard: { marginHorizontal: 16, backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: 20, marginBottom: 16 },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  detailDate: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textDark, flex: 1 },
  statusChip: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.full },
  statusChipText: { fontSize: SIZES.xs, fontWeight: '700' },
  detailRows: { gap: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.bgMain, padding: 14, borderRadius: RADIUS.md },
  detailRowIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center' },
  detailRowLabel: { fontSize: SIZES.xs, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase' },
  detailRowValue: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.textDark, marginTop: 2 },
  absentNote: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.dangerLight, padding: 14, borderRadius: RADIUS.md },
  absentText: { fontSize: SIZES.sm, color: COLORS.danger, fontWeight: '600' },
});

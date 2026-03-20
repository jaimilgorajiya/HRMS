import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Animated, RefreshControl, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiFetch, getImageUrl } from '../../utils/api';
import { ENDPOINTS } from '../../constants/api';
import { COLORS, SIZES, RADIUS, SHADOW } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon, label, value, sub, color, bg, onPress, delay }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, tension: 60, friction: 8, delay, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={{ opacity: anim, transform: [{ scale: anim }], flex: 1 }}>
      <TouchableOpacity style={[styles.statCard, SHADOW.sm]} onPress={onPress} activeOpacity={0.85}>
        <View style={[styles.statIcon, { backgroundColor: bg }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={styles.statValue}>{value ?? '—'}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        {sub ? <Text style={styles.statSub} numberOfLines={1}>{sub}</Text> : null}
      </TouchableOpacity>
    </Animated.View>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue} numberOfLines={1}>{value || '—'}</Text>
  </View>
);

export default function DashboardScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const headerAnim = useRef(new Animated.Value(-30)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();
    Animated.parallel([
      Animated.spring(headerAnim, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const loadData = async () => {
    try {
      const res = await apiFetch(ENDPOINTS.employeeStats);
      const json = await res.json();
      if (json.success) setData(json);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const onRefresh = () => { setRefreshing(true); loadData(); };

  const emp = data?.employee || {};
  const stats = data?.stats || {};
  const photoUrl = getImageUrl(emp.profilePhoto);

  const quickLinks = [
    { icon: 'calendar-outline', label: 'Attendance', path: '/(tabs)/attendance', color: COLORS.primary },
    { icon: 'leaf-outline', label: 'Apply Leave', path: '/(tabs)/leaves', color: COLORS.success },
    { icon: 'receipt-outline', label: 'Payslips', path: '/(tabs)/payslips', color: COLORS.purple },
    { icon: 'document-outline', label: 'Documents', path: '/(tabs)/profile', color: COLORS.warning },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {/* Header Banner */}
        <LinearGradient colors={['#1E40AF', '#2563EB', '#60A5FA']} style={styles.banner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Animated.View style={[styles.bannerContent, { opacity: headerOpacity, transform: [{ translateY: headerAnim }] }]}>
            <View style={styles.bannerLeft}>
              <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
                {photoUrl ? (
                  <Image source={{ uri: photoUrl }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarText}>{(emp.name || 'E')[0].toUpperCase()}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <View style={styles.bannerInfo}>
                <Text style={styles.greeting}>Good {getGreeting()} 👋</Text>
                <Text style={styles.empName} numberOfLines={1}>{emp.firstName || emp.name?.split(' ')[0] || 'Employee'}</Text>
                <Text style={styles.empRole} numberOfLines={1}>{emp.designation || 'Employee'}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={22} color="rgba(255,255,255,0.9)" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </Animated.View>

          {/* ID + Status chips */}
          <View style={styles.chipRow}>
            {emp.employeeId && (
              <View style={styles.chip}><Ionicons name="id-card-outline" size={12} color="rgba(255,255,255,0.8)" /><Text style={styles.chipText}>{emp.employeeId}</Text></View>
            )}
            {emp.department && (
              <View style={styles.chip}><Ionicons name="business-outline" size={12} color="rgba(255,255,255,0.8)" /><Text style={styles.chipText}>{emp.department}</Text></View>
            )}
            {emp.status && (
              <View style={[styles.chip, styles.chipGreen]}><Text style={styles.chipTextGreen}>{emp.status}</Text></View>
            )}
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Stat Cards */}
          <View style={styles.statsRow}>
            <StatCard icon="calendar-outline" label="Leave Balance" value={stats.totalLeaves} sub={stats.leaveGroupName} color={COLORS.success} bg={COLORS.successLight} onPress={() => router.push('/(tabs)/leaves')} delay={0} />
            <StatCard icon="document-outline" label="Documents" value={stats.documentCount} sub="Uploaded" color={COLORS.purple} bg={COLORS.purpleLight} onPress={() => router.push('/(tabs)/profile')} delay={80} />
          </View>
          <View style={styles.statsRow}>
            <StatCard icon="time-outline" label="Days Here" value={stats.daysSinceJoining} sub={emp.dateJoined ? `Since ${new Date(emp.dateJoined).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}` : null} color={COLORS.primary} bg={COLORS.primaryLight} delay={160} />
            <StatCard icon="moon-outline" label="Shift" value={stats.shiftName || 'N/A'} sub={stats.shiftStart && stats.shiftEnd ? `${stats.shiftStart}–${stats.shiftEnd}` : 'Not assigned'} color={COLORS.warning} bg={COLORS.orangeLight} onPress={() => router.push('/(tabs)/profile')} delay={240} />
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            {quickLinks.map((q, i) => (
              <TouchableOpacity key={i} style={[styles.quickCard, SHADOW.sm]} onPress={() => router.push(q.path)} activeOpacity={0.8}>
                <View style={[styles.quickIcon, { backgroundColor: q.color + '18' }]}>
                  <Ionicons name={q.icon} size={22} color={q.color} />
                </View>
                <Text style={styles.quickLabel}>{q.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Work Info */}
          <Text style={styles.sectionTitle}>Work Details</Text>
          <View style={[styles.card, SHADOW.sm]}>
            <InfoRow label="Employee ID" value={emp.employeeId} />
            <InfoRow label="Designation" value={emp.designation} />
            <InfoRow label="Department" value={emp.department} />
            <InfoRow label="Branch" value={emp.branch} />
            <InfoRow label="Reporting To" value={emp.reportingTo} />
            <InfoRow label="Work Mode" value={emp.workSetup?.mode} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgMain },
  scroll: { flex: 1 },
  banner: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 28 },
  bannerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  bannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  avatar: { width: 52, height: 52, borderRadius: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  avatarFallback: { width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  avatarText: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.white },
  bannerInfo: { flex: 1 },
  greeting: { fontSize: SIZES.xs, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
  empName: { fontSize: SIZES.lg, fontWeight: '800', color: COLORS.white, marginTop: 1 },
  empRole: { fontSize: SIZES.xs, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  notifBtn: { position: 'relative', padding: 4 },
  notifDot: { position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.danger, borderWidth: 1.5, borderColor: COLORS.primary },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  chipText: { fontSize: SIZES.xs, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  chipGreen: { backgroundColor: 'rgba(16,185,129,0.25)' },
  chipTextGreen: { fontSize: SIZES.xs, color: '#6EE7B7', fontWeight: '700' },
  body: { padding: 20, paddingBottom: 100 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 16, alignItems: 'flex-start' },
  statIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValue: { fontSize: SIZES.xl, fontWeight: '800', color: COLORS.textDark, marginBottom: 2 },
  statLabel: { fontSize: SIZES.xs, fontWeight: '600', color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: 0.5 },
  statSub: { fontSize: SIZES.xs, color: COLORS.textMuted, marginTop: 2 },
  sectionTitle: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.textDark, marginBottom: 14, marginTop: 8 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  quickCard: { width: '47%', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 18, alignItems: 'center', gap: 10 },
  quickIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  quickLabel: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.textMain },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 16, marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  infoLabel: { fontSize: SIZES.sm, color: COLORS.textLight, fontWeight: '500', flex: 1 },
  infoValue: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.textDark, flex: 1, textAlign: 'right' },
});

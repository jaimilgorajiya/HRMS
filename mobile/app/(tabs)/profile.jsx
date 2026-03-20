import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Image, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, getImageUrl } from '../../utils/api';
import { ENDPOINTS } from '../../constants/api';
import { COLORS, SIZES, RADIUS, SHADOW } from '../../constants/theme';

const TABS = ['Personal', 'Work', 'Documents', 'Security'];

const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoIcon}><Ionicons name={icon} size={16} color={COLORS.primary} /></View>
    <View style={styles.infoText}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '—'}</Text>
    </View>
  </View>
);

export default function ProfileScreen() {
  const { logout } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Personal');
  const [passwords, setPasswords] = useState({ current: '', newPwd: '', confirm: '' });
  const [showPwd, setShowPwd] = useState({ current: false, newPwd: false, confirm: false });
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch(ENDPOINTS.employeeStats);
        const json = await res.json();
        if (json.success) setEmployee(json.employee);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.newPwd || !passwords.confirm) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please fill all password fields.' });
      return;
    }
    if (passwords.newPwd !== passwords.confirm) {
      Toast.show({ type: 'error', text1: 'Mismatch', text2: 'New passwords do not match.' });
      return;
    }
    if (passwords.newPwd.length < 6) {
      Toast.show({ type: 'error', text1: 'Too Short', text2: 'Password must be at least 6 characters.' });
      return;
    }
    setSavingPwd(true);
    try {
      const res = await apiFetch(ENDPOINTS.changePassword, {
        method: 'POST',
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPwd }),
      });
      const data = await res.json();
      if (res.ok) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show({ type: 'success', text1: 'Password Updated!', text2: 'Your password has been changed.' });
        setPasswords({ current: '', newPwd: '', confirm: '' });
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: data.message });
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Something went wrong.' });
    } finally { setSavingPwd(false); }
  };

  const emp = employee || {};
  const photoUrl = getImageUrl(emp.profilePhoto);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={['#1E40AF', '#2563EB', '#60A5FA']} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.heroContent}>
            {photoUrl ? (
              <Image source={{ uri: photoUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{(emp.name || 'E')[0]?.toUpperCase()}</Text>
              </View>
            )}
            <Text style={styles.heroName}>{emp.name || '—'}</Text>
            <Text style={styles.heroRole}>{emp.designation || 'Employee'} • {emp.department || '—'}</Text>
            <View style={styles.heroBadges}>
              {emp.employeeId && <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>{emp.employeeId}</Text></View>}
              {emp.status && <View style={[styles.heroBadge, styles.heroBadgeGreen]}><Text style={styles.heroBadgeGreenText}>{emp.status}</Text></View>}
            </View>
          </View>
        </LinearGradient>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow}>
          {TABS.map(t => (
            <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.body}>
          {tab === 'Personal' && (
            <View style={[styles.card, SHADOW.sm]}>
              <InfoItem icon="person-outline" label="Full Name" value={emp.name} />
              <InfoItem icon="mail-outline" label="Email" value={emp.email} />
              <InfoItem icon="call-outline" label="Phone" value={emp.phone} />
              <InfoItem icon="male-female-outline" label="Gender" value={emp.gender} />
              <InfoItem icon="calendar-outline" label="Date of Birth" value={emp.dateOfBirth ? new Date(emp.dateOfBirth).toLocaleDateString('en-IN') : null} />
              <InfoItem icon="water-outline" label="Blood Group" value={emp.bloodGroup} />
              <InfoItem icon="heart-outline" label="Marital Status" value={emp.maritalStatus} />
              <InfoItem icon="flag-outline" label="Nationality" value={emp.nationality} />
            </View>
          )}

          {tab === 'Work' && (
            <View style={[styles.card, SHADOW.sm]}>
              <InfoItem icon="id-card-outline" label="Employee ID" value={emp.employeeId} />
              <InfoItem icon="briefcase-outline" label="Designation" value={emp.designation} />
              <InfoItem icon="business-outline" label="Department" value={emp.department} />
              <InfoItem icon="location-outline" label="Branch" value={emp.branch} />
              <InfoItem icon="people-outline" label="Reporting To" value={emp.reportingTo} />
              <InfoItem icon="calendar-outline" label="Date Joined" value={emp.dateJoined ? new Date(emp.dateJoined).toLocaleDateString('en-IN') : null} />
              <InfoItem icon="construct-outline" label="Employment Type" value={emp.employmentType} />
              <InfoItem icon="desktop-outline" label="Work Mode" value={emp.workSetup?.mode} />
            </View>
          )}

          {tab === 'Documents' && (
            <View>
              {emp.documents?.length > 0 ? emp.documents.map((doc, i) => (
                <View key={i} style={[styles.docCard, SHADOW.sm]}>
                  <View style={styles.docIcon}>
                    <Ionicons name="document-text-outline" size={22} color={COLORS.primary} />
                  </View>
                  <View style={styles.docInfo}>
                    <Text style={styles.docType}>{doc.documentType?.name || 'Document'}</Text>
                    <Text style={styles.docName} numberOfLines={1}>{doc.originalName || doc.fileUrl}</Text>
                    {doc.documentNumber && <Text style={styles.docMeta}>No: {doc.documentNumber}</Text>}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
                </View>
              )) : (
                <View style={styles.emptyState}>
                  <Ionicons name="document-outline" size={48} color={COLORS.textPlaceholder} />
                  <Text style={styles.emptyText}>No documents found</Text>
                  <Text style={styles.emptySubText}>Contact HR to upload your documents</Text>
                </View>
              )}
            </View>
          )}

          {tab === 'Security' && (
            <View style={[styles.card, SHADOW.sm]}>
              <Text style={styles.secTitle}>Change Password</Text>
              {[
                { key: 'current', label: 'Current Password' },
                { key: 'newPwd', label: 'New Password' },
                { key: 'confirm', label: 'Confirm New Password' },
              ].map(({ key, label }) => (
                <View key={key} style={styles.formGroup}>
                  <Text style={styles.formLabel}>{label}</Text>
                  <View style={styles.pwdWrap}>
                    <TextInput
                      style={styles.pwdInput}
                      placeholder="••••••••"
                      placeholderTextColor={COLORS.textPlaceholder}
                      secureTextEntry={!showPwd[key]}
                      value={passwords[key]}
                      onChangeText={v => setPasswords(p => ({ ...p, [key]: v }))}
                    />
                    <TouchableOpacity onPress={() => setShowPwd(p => ({ ...p, [key]: !p[key] }))}>
                      <Ionicons name={showPwd[key] ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textLight} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <TouchableOpacity style={styles.pwdBtn} onPress={handleChangePassword} disabled={savingPwd} activeOpacity={0.85}>
                <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.pwdBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.pwdBtnText}>{savingPwd ? 'Updating...' : 'Update Password'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Logout */}
          <TouchableOpacity style={[styles.logoutBtn, SHADOW.sm]} onPress={handleLogout} activeOpacity={0.85}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgMain },
  hero: { paddingTop: 24, paddingBottom: 32, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  heroContent: { alignItems: 'center' },
  avatar: { width: 90, height: 90, borderRadius: 24, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)', marginBottom: 14 },
  avatarFallback: { width: 90, height: 90, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)', marginBottom: 14 },
  avatarText: { fontSize: 36, fontWeight: '800', color: COLORS.white },
  heroName: { fontSize: SIZES.xl, fontWeight: '800', color: COLORS.white, marginBottom: 4 },
  heroRole: { fontSize: SIZES.sm, color: 'rgba(255,255,255,0.75)', marginBottom: 12 },
  heroBadges: { flexDirection: 'row', gap: 8 },
  heroBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.full },
  heroBadgeText: { fontSize: SIZES.xs, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  heroBadgeGreen: { backgroundColor: 'rgba(16,185,129,0.25)' },
  heroBadgeGreenText: { fontSize: SIZES.xs, color: '#6EE7B7', fontWeight: '700' },
  tabRow: { paddingHorizontal: 16, paddingVertical: 16, gap: 8 },
  tab: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.border },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.textLight },
  tabTextActive: { color: COLORS.white },
  body: { paddingHorizontal: 16, gap: 12 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: 8 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  infoIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  infoText: { flex: 1 },
  infoLabel: { fontSize: SIZES.xs, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },
  infoValue: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.textDark, marginTop: 2 },
  docCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 16, marginBottom: 10 },
  docIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center' },
  docInfo: { flex: 1 },
  docType: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.primary },
  docName: { fontSize: SIZES.xs, color: COLORS.textLight, marginTop: 2 },
  docMeta: { fontSize: SIZES.xs, color: COLORS.textMuted, marginTop: 2 },
  emptyState: { alignItems: 'center', padding: 40, gap: 8 },
  emptyText: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.textMuted },
  emptySubText: { fontSize: SIZES.sm, color: COLORS.textPlaceholder, textAlign: 'center' },
  secTitle: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.textDark, padding: 12, paddingBottom: 4 },
  formGroup: { padding: 12, paddingBottom: 0 },
  formLabel: { fontSize: SIZES.xs, fontWeight: '600', color: COLORS.textMain, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 },
  pwdWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: 14, backgroundColor: COLORS.bgMain },
  pwdInput: { flex: 1, height: 48, fontSize: SIZES.md, color: COLORS.textDark },
  pwdBtn: { margin: 12, borderRadius: RADIUS.md, overflow: 'hidden' },
  pwdBtnGrad: { paddingVertical: 14, alignItems: 'center' },
  pwdBtnText: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.white },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: 16, borderWidth: 1.5, borderColor: COLORS.dangerLight },
  logoutText: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.danger },
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAku-XiocDXpBAkk7r5RI_Bukt4nx709uM",
  authDomain: "interclasse-266bf.firebaseapp.com",
  projectId: "interclasse-266bf",
  storageBucket: "interclasse-266bf.firebasestorage.app",
  messagingSenderId: "209105220298",
  appId: "1:209105220298:web:98f24d21851d58f9f53a33"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTIONS = {
  TEAMS: "times",
  MATCHES: "jogos"
};

function sanitizeText(value) {
  return String(value || "").trim();
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

export function generateSafeKey(team) {
  if (!team) return "";

  if (team.sport === "Pingpong") {
    const firstPlayer = team.players && team.players[0] ? team.players[0] : null;
    return sanitizeText(firstPlayer?.name || "Jogador");
  }

  return sanitizeText(team.teamName || "");
}

export async function createTeam(teamData) {
  const payload = {
    sport: sanitizeText(teamData.sport),
    teamName: sanitizeText(teamData.teamName),
    captain: sanitizeText(teamData.captain),
    players: Array.isArray(teamData.players) ? clone(teamData.players) : [],
    points: Number(teamData.points || 0),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.TEAMS), payload);
  return { id: docRef.id, ...payload };
}

export async function updateTeam(teamId, teamData) {
  const payload = {
    sport: sanitizeText(teamData.sport),
    teamName: sanitizeText(teamData.teamName),
    captain: sanitizeText(teamData.captain),
    players: Array.isArray(teamData.players) ? clone(teamData.players) : [],
    points: Number(teamData.points || 0),
    updatedAt: new Date().toISOString()
  };

  await updateDoc(doc(db, COLLECTIONS.TEAMS, teamId), payload);
}

export async function deleteTeam(teamId) {
  await deleteDoc(doc(db, COLLECTIONS.TEAMS, teamId));
}

export async function getTeamsOnce() {
  const snapshot = await getDocs(collection(db, COLLECTIONS.TEAMS));
  return snapshot.docs.map(item => ({
    id: item.id,
    ...item.data()
  }));
}

export function listenTeams(callback) {
  const q = query(collection(db, COLLECTIONS.TEAMS), orderBy("sport"), orderBy("teamName"));
  return onSnapshot(q, (snapshot) => {
    const teams = snapshot.docs.map(item => ({
      id: item.id,
      ...item.data()
    }));
    callback(teams);
  });
}

export async function clearAllTeams() {
  const snapshot = await getDocs(collection(db, COLLECTIONS.TEAMS));
  const batch = writeBatch(db);

  snapshot.docs.forEach((item) => {
    batch.delete(item.ref);
  });

  await batch.commit();
}

export async function createMatch(matchData) {
  const payload = {
    sport: sanitizeText(matchData.sport),
    teamAKey: sanitizeText(matchData.teamAKey),
    teamBKey: sanitizeText(matchData.teamBKey),
    teamAName: sanitizeText(matchData.teamAName),
    teamBName: sanitizeText(matchData.teamBName),
    date: sanitizeText(matchData.date),
    time: sanitizeText(matchData.time),
    goalsA: Number(matchData.goalsA || 0),
    goalsB: Number(matchData.goalsB || 0),
    status: sanitizeText(matchData.status || "nao_iniciado"),
    events: Array.isArray(matchData.events) ? clone(matchData.events) : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.MATCHES), payload);
  return { id: docRef.id, ...payload };
}

export async function updateMatch(matchId, matchData) {
  const payload = {
    sport: sanitizeText(matchData.sport),
    teamAKey: sanitizeText(matchData.teamAKey),
    teamBKey: sanitizeText(matchData.teamBKey),
    teamAName: sanitizeText(matchData.teamAName),
    teamBName: sanitizeText(matchData.teamBName),
    date: sanitizeText(matchData.date),
    time: sanitizeText(matchData.time),
    goalsA: Number(matchData.goalsA || 0),
    goalsB: Number(matchData.goalsB || 0),
    status: sanitizeText(matchData.status || "nao_iniciado"),
    events: Array.isArray(matchData.events) ? clone(matchData.events) : [],
    updatedAt: new Date().toISOString()
  };

  await updateDoc(doc(db, COLLECTIONS.MATCHES, matchId), payload);
}

export async function patchMatch(matchId, partialData) {
  const payload = {
    ...clone(partialData),
    updatedAt: new Date().toISOString()
  };

  await updateDoc(doc(db, COLLECTIONS.MATCHES, matchId), payload);
}

export async function getMatchById(matchId) {
  const snapshot = await getDoc(doc(db, COLLECTIONS.MATCHES, matchId));
  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data()
  };
}

export async function deleteMatch(matchId) {
  await deleteDoc(doc(db, COLLECTIONS.MATCHES, matchId));
}

export async function getMatchesOnce() {
  const snapshot = await getDocs(collection(db, COLLECTIONS.MATCHES));
  return snapshot.docs.map(item => ({
    id: item.id,
    ...item.data()
  }));
}

export function listenMatches(callback) {
  const q = query(collection(db, COLLECTIONS.MATCHES), orderBy("date"), orderBy("time"));
  return onSnapshot(q, (snapshot) => {
    const matches = snapshot.docs.map(item => ({
      id: item.id,
      ...item.data()
    }));
    callback(matches);
  });
}

export async function clearAllMatches() {
  const snapshot = await getDocs(collection(db, COLLECTIONS.MATCHES));
  const batch = writeBatch(db);

  snapshot.docs.forEach((item) => {
    batch.delete(item.ref);
  });

  await batch.commit();
}

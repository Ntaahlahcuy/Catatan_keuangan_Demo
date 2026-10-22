// Jawaban bentuk asli Codelab 1 halaman 17. File latihan ini bukan route.
// Implementasi terintegrasi ada di context/ThemeContext.tsx + app/usecontext_example.tsx.
import { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react';
import { View, Text, Button } from 'react-native';

type Theme = { darkMode: boolean; setDarkMode: Dispatch<SetStateAction<boolean>> };
const ThemeContext = createContext<Theme | null>(null);

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  return <ThemeContext.Provider value={{ darkMode, setDarkMode }}><Home /></ThemeContext.Provider>;
}
function Home() { return <Profile />; }
function Profile() { return <UserCard />; }
function UserCard() { return <UserName />; }
function UserName() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('Provider tema belum dipasang.');
  const { darkMode, setDarkMode } = theme;
  return <View style={{ flex: 1, backgroundColor: darkMode ? 'black' : 'white' }}>
    <Text style={{ color: darkMode ? 'white' : 'black' }}>{darkMode ? 'Dark Mode' : 'Light Mode'}</Text>
    <Button title="Toggle Theme" onPress={() => setDarkMode(previous => !previous)} />
  </View>;
}

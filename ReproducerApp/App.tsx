/**
 * Reproducer: on the New Architecture, a view whose style changes from a
 * fixed `width` to `flex: 1` keeps the old width as its flex basis.
 *
 * Each row starts 360 wide with a 300-wide child. Pressing the button
 * shrinks both rows to 200 in one commit and changes the children:
 * - top row: `width: 300` -> `flex: 1`. Expected 200, actual 300.
 * - bottom row (control): `width: 300` -> `width: '100%'`. 200 as expected.
 *
 * @format
 */

import { useState } from 'react';
import {
  Button,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();
  const [wide, setWide] = useState(true);
  const rowWidth = wide ? 360 : 200;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Button
        testID="toggle"
        title={wide ? 'Shrink rows to 200' : 'Back to 360'}
        onPress={() => setWide(w => !w)}
      />
      <Row
        label="width: 300 -> flex: 1"
        testID="flex"
        rowWidth={rowWidth}
        childStyle={wide ? styles.fixed : styles.flex}
      />
      <Row
        label="width: 300 -> width: '100%' (control)"
        testID="percent"
        rowWidth={rowWidth}
        childStyle={wide ? styles.fixed : styles.full}
      />
    </View>
  );
}

function Row({
  label,
  testID,
  rowWidth,
  childStyle,
}: {
  label: string;
  testID: string;
  rowWidth: number;
  childStyle: ViewStyle;
}) {
  const [childWidth, setChildWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) =>
    setChildWidth(Math.round(e.nativeEvent.layout.width));
  const ok = childWidth <= rowWidth;

  return (
    <View style={styles.block}>
      <Text>{label}</Text>
      <View style={[styles.row, { width: rowWidth }]}>
        <View style={[styles.child, childStyle]} onLayout={onLayout} />
      </View>
      <Text testID={`${testID}-result`}>
        row {rowWidth}, child {childWidth}:{' '}
        {ok ? 'OK' : 'BUG (child wider than row)'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, gap: 24 },
  block: { gap: 8 },
  row: {
    flexDirection: 'row',
    height: 48,
    borderWidth: 2,
    borderColor: 'black',
  },
  child: { backgroundColor: 'rgba(255, 0, 0, 0.5)' },
  fixed: { width: 300 },
  flex: { flex: 1 },
  full: { width: '100%' },
});

export default App;

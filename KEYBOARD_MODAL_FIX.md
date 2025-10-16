# Keyboard Modal Fix - Booking Screen

## Issue
The modal in the booking screen was experiencing continuous shrinking when the keyboard closed, causing a poor user experience.

## Root Causes
1. **Complex KeyboardAvoidingView behavior**: Multiple nested KeyboardAvoidingView components causing conflicts
2. **Dynamic height adjustments**: Real-time height changes based on keyboard state causing animation issues
3. **Multiple keyboard listeners**: Redundant keyboard event listeners causing state conflicts
4. **Platform-specific behavior differences**: iOS and Android handling keyboard events differently

## Solutions Implemented

### 1. Simplified Keyboard Handling
- Removed redundant keyboard listeners
- Used platform-specific keyboard events (`keyboardWillShow`/`keyboardWillHide` for iOS, `keyboardDidShow`/`keyboardDidHide` for Android)
- Added keyboard height tracking for better positioning

### 2. Improved Modal Structure
```jsx
<Modal>
  <View style={styles.modalOverlay}>
    <View style={styles.keyboardAvoidingContainer}>
      <KeyboardAvoidingView behavior="position" style={styles.keyboardAvoidingView}>
        <View style={styles.modalContainer}>
          {/* Modal content */}
        </View>
      </KeyboardAvoidingView>
    </View>
  </View>
</Modal>
```

### 3. Better State Management
- Added `keyboardHeight` state for precise positioning
- Reset keyboard state when modal closes
- Proper cleanup of keyboard listeners

### 4. Enhanced TextInput
- Added `returnKeyType="done"`
- Added `onSubmitEditing` handler
- Added `blurOnSubmit={true}`
- Set `maxHeight` to prevent excessive growth

## Key Changes Made

### Files Modified:
1. `src/screen/bookingScreen/bookingScreen.tsx`
2. `src/screen/bookingScreen/styles.ts`

### Code Changes:
1. **Simplified keyboard listeners** - Removed redundant listeners
2. **Added keyboard height tracking** - Better positioning control
3. **Improved modal structure** - Cleaner nesting of components
4. **Enhanced TextInput** - Better keyboard interaction
5. **Added state reset** - Proper cleanup when modal closes

## Alternative Solutions

### Option 1: Use react-native-keyboard-aware-scroll-view
```bash
npm install react-native-keyboard-aware-scroll-view
```

```jsx
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

<Modal>
  <View style={styles.modalOverlay}>
    <KeyboardAwareScrollView
      contentContainerStyle={styles.keyboardAwareContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.modalContainer}>
        {/* Modal content */}
      </View>
    </KeyboardAwareScrollView>
  </View>
</Modal>
```

### Option 2: Use react-native-modal
```bash
npm install react-native-modal
```

```jsx
import Modal from 'react-native-modal';

<Modal
  isVisible={showCancelModal}
  onBackdropPress={handleCancelModalClose}
  onBackButtonPress={handleCancelModalClose}
  avoidKeyboard={true}
  useNativeDriver={true}
>
  <View style={styles.modalContainer}>
    {/* Modal content */}
  </View>
</Modal>
```

### Option 3: Custom Hook for Keyboard Handling
```jsx
const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
        setKeyboardVisible(true);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  return { keyboardHeight, isKeyboardVisible };
};
```

## Testing
1. Test on both iOS and Android devices
2. Test with different keyboard types
3. Test rapid keyboard open/close cycles
4. Test with different screen sizes
5. Test with different text input lengths

## Benefits
- ✅ Eliminates continuous shrinking animation
- ✅ Better keyboard handling across platforms
- ✅ Smoother user experience
- ✅ More stable modal behavior
- ✅ Proper state management
- ✅ Better TextInput interaction

## Notes
- The current implementation uses `behavior="position"` for iOS which provides better stability
- Keyboard height tracking allows for precise positioning
- State reset ensures clean modal state on close
- TextInput improvements provide better keyboard interaction

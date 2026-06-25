# AI Chat Navigation Fix

## Problem
`HomeScreen` opens AI chat with:

```tsx
router.navigate('/(private)/(stack)/ai-chat')
```

But this route lives under a separate route group from the tabs navigator:

- `app/(private)/(tabs)` contains Home
- `app/(private)/(stack)` contains AI chat
- `app/(private)/_layout.tsx` currently renders `<Slot />`

Because of that structure, AI chat is not pushed onto the same navigation stack as Home. It is opened as a sibling route group, so the iOS swipe-back gesture does not have a previous screen to pop to.

## What Is Wrong
The main issue is the navigator structure, not the route string.

`router.navigate(...)` is switching to a different route group instead of adding a screen to the same stack history. That is why swiping from left to right does not return to Home.

## Fix
Make Home and AI chat part of the same stack history.

### Recommended approach
Change `app/(private)/_layout.tsx` to use a `Stack` instead of a `Slot`, and register the tabs group and AI chat as stack screens.

That way:

- Home stays inside the tabs screen
- AI chat becomes another screen in the same private stack
- iOS swipe-back can pop from AI chat back to Home

### High-level structure
```text
app/
  (private)/
    _layout.tsx        -> Stack
    (tabs)/
      _layout.tsx      -> Tabs
      index.tsx        -> Home
    (stack)/
      ai-chat/
        index.tsx      -> AI Chat screen
```

## Important Note
If the screen is still opened with a route that is not pushed onto the same stack, swipe-back will still not work even if the file exists under `(stack)`.

Also, remember that swipe-back is an iOS navigation gesture. On Android, this gesture is not expected to behave the same way.

## Practical Result
After the layout change:

- tapping the Home button opens AI chat as a pushed screen
- the back gesture on iOS works
- back navigation matches normal stack behavior

## Summary
The fix is not to move files randomly. The fix is to make `HomeScreen` and `AIChatScreen` share one stack navigator so AI chat is opened as a pushed screen instead of a separate route group.

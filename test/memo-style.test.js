import React, { memo, useState } from 'react'
import { View } from 'react-native'
import { create, act } from 'react-test-renderer'

import s from '../src/rn'

it('does not re-render memoized child when parent re-renders with same style', () => {
  let childRenderCount = 0

  const StyledChild = s.View({ flex: 1 })
  const MemoChild = memo(StyledChild)

  const Parent = () => {
    const [count, setCount] = useState(0)
    Parent.setCount = setCount
    return (
      <View>
        <MemoChild />
        <View testID="count">{count}</View>
      </View>
    )
  }

  let root
  act(() => {
    root = create(<Parent />)
  })

  childRenderCount = 0

  // spy on re-renders by wrapping createElement
  const originalCreateElement = React.createElement
  React.createElement = (...args) => {
    if (args[0] === View && args[1]?.style?.flex === 1) {
      childRenderCount++
    }
    return originalCreateElement(...args)
  }

  act(() => {
    Parent.setCount(1)
  })

  React.createElement = originalCreateElement

  // MemoChild should not re-render because useStableStyle returns the same reference
  expect(childRenderCount).toBe(0)
})

it('does not re-render memoized child when dynamic style resolves to same values', () => {
  let childRenderCount = 0

  const StyledChild = s.View((p) => ({ padding: p.big ? 20 : 10 }))
  const MemoChild = memo(StyledChild)

  const Parent = () => {
    const [count, setCount] = useState(0)
    Parent.setCount = setCount
    return (
      <View>
        <MemoChild big={false} />
        <View testID="count">{count}</View>
      </View>
    )
  }

  let root
  act(() => {
    root = create(<Parent />)
  })

  childRenderCount = 0

  const originalCreateElement = React.createElement
  React.createElement = (...args) => {
    if (args[0] === View && args[1]?.style?.padding === 10) {
      childRenderCount++
    }
    return originalCreateElement(...args)
  }

  act(() => {
    Parent.setCount(1)
  })

  React.createElement = originalCreateElement

  expect(childRenderCount).toBe(0)
})

it('re-renders memoized child when style actually changes', () => {
  const StyledChild = s.View((p) => ({ padding: p.big ? 20 : 10 }))
  const MemoChild = memo(StyledChild)

  const Parent = () => {
    const [big, setBig] = useState(false)
    Parent.setBig = setBig
    return (
      <View>
        <MemoChild big={big} />
      </View>
    )
  }

  let root
  act(() => {
    root = create(<Parent />)
  })

  const tree1 = root.toJSON()
  expect(tree1.children[0].props.style).toEqual({ padding: 10 })

  act(() => {
    Parent.setBig(true)
  })

  const tree2 = root.toJSON()
  expect(tree2.children[0].props.style).toEqual({ padding: 20 })
})

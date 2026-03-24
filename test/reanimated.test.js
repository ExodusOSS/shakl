import { render } from '@testing-library/react-native'
import React from 'react'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

import s from '../src/rn'

it('works with reanimated styles', () => {
  const AnimatedComponent = () => {
    const animatedValue = useSharedValue(0.5)
    const Foo = s(Animated.View)({ flex: 1, opacity: 0 })
    const animatedStyle = useAnimatedStyle(
      () => ({ opacity: animatedValue.value }),
      [animatedValue]
    )
    return <Foo testID="foo" style={animatedStyle} />
  }

  const { getByTestId } = render(<AnimatedComponent />)
  const element = getByTestId('foo')
  expect(element.props.style).toEqual([{ flex: 1, opacity: 0 }, { opacity: 0.5 }, {}])
  expect(element).toHaveAnimatedStyle({ opacity: 0.5 })
})

it('works with reanimated styles when use array', () => {
  const AnimatedComponent = () => {
    const animatedValue = useSharedValue(0.5)
    const Foo = s(Animated.View)({ flex: 1, opacity: 0 })
    const animatedStyle = useAnimatedStyle(
      () => ({ opacity: animatedValue.value }),
      [animatedValue]
    )
    return <Foo testID="foo" style={[animatedStyle, { width: 50 }]} />
  }

  const { getByTestId } = render(<AnimatedComponent />)
  const element = getByTestId('foo')
  expect(element.props.style).toEqual([{ flex: 1, opacity: 0 }, { opacity: 0.5 }, { width: 50 }, {}])
  expect(element).toHaveAnimatedStyle({ opacity: 0.5 })
})
it('works with reanimated styles when use array and some style is undefined', () => {
  const AnimatedComponent = () => {
    const animatedValue = useSharedValue(0.5)
    const Foo = s(Animated.View)({ flex: 1, opacity: 0 })
    const animatedStyle = useAnimatedStyle(
      () => ({ opacity: animatedValue.value }),
      [animatedValue]
    )
    return <Foo testID="foo" style={[undefined, null, animatedStyle, { width: 50 }]} />
  }

  const { getByTestId } = render(<AnimatedComponent />)
  const element = getByTestId('foo')
  expect(element.props.style).toEqual([{ flex: 1, opacity: 0 }, { opacity: 0.5 }, { width: 50 }, {}])
  expect(element).toHaveAnimatedStyle({ opacity: 0.5 })
})

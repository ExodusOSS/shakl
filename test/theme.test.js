import React, { useState } from 'react'
import { View } from 'react-native'
import { act, create as r } from 'react-test-renderer'

import s, { ThemeProvider, useTheme } from '../src/rn'

const theme = {
  fancyColor: '#193bc3',
}

it('injects the context theme into function styles', () => {
  const Foo = s.View(({ theme }) => ({ backgroundColor: theme.fancyColor }))
  const foo = r(
    <ThemeProvider theme={theme}>
      <Foo />
    </ThemeProvider>
  ).toJSON()

  expect(foo.props.style).toEqual({ backgroundColor: '#193bc3' })

  expect(foo).toMatchSnapshot()
})

it('leaves static styles untouched under a provider', () => {
  const Foo = s.View({ flex: 1 })
  const foo = r(
    <ThemeProvider theme={theme}>
      <Foo />
    </ThemeProvider>
  ).toJSON()

  expect(foo.props.style).toEqual({ flex: 1 })
})

it('passes props through untouched when no provider is mounted', () => {
  let received
  const Foo = s.View((props) => {
    received = props
    return { flex: 1 }
  })
  r(<Foo padded />)

  expect('theme' in received).toBe(false)
  expect(received.padded).toBe(true)
})

it('lets an explicitly passed theme prop override the context theme', () => {
  const Foo = s.View(({ theme }) => ({ backgroundColor: theme.fancyColor }))
  const foo = r(
    <ThemeProvider theme={theme}>
      <Foo theme={{ fancyColor: 'red' }} />
    </ThemeProvider>
  ).toJSON()

  expect(foo.props.style).toEqual({ backgroundColor: 'red' })
})

it('does not pass the injected theme to the underlying component', () => {
  const Foo = s.View(({ theme }) => ({ backgroundColor: theme.fancyColor }))
  const foo = r(
    <ThemeProvider theme={theme}>
      <Foo />
    </ThemeProvider>
  ).toJSON()

  expect(foo.props.theme).toBeUndefined()
})

it('injects the context theme when extending a static component', () => {
  const Foo = s.Text({ fontSize: 20 })
  const Bar = Foo.extend(({ theme }) => ({ color: theme.fancyColor }))
  const bar = r(
    <ThemeProvider theme={theme}>
      <Bar />
    </ThemeProvider>
  ).toJSON()

  expect(bar.props.style).toEqual({ fontSize: 20, color: '#193bc3' })
})

it('injects the context theme into every layer of an extend() chain', () => {
  const Foo = s.Text(({ theme }) => ({ color: theme.fancyColor }))
  const Bar = Foo.extend(({ theme }) => ({ borderColor: theme.fancyColor }))
  const bar = r(
    <ThemeProvider theme={theme}>
      <Bar />
    </ThemeProvider>
  ).toJSON()

  expect(bar.props.style).toEqual({ color: '#193bc3', borderColor: '#193bc3' })
})

it('injects the context theme into attrs() functions', () => {
  const Foo = s.Text({ color: 'blue' }).attrs(({ theme }) => ({
    selectionColor: theme.fancyColor,
  }))
  const foo = r(
    <ThemeProvider theme={theme}>
      <Foo />
    </ThemeProvider>
  ).toJSON()

  expect(foo.props.selectionColor).toBe('#193bc3')
  expect(foo.props.style).toEqual({ color: 'blue' })
})

it('injects the context theme into function styles behind attrs()', () => {
  const Foo = s
    .View(({ theme }) => ({ backgroundColor: theme.fancyColor }))
    .attrs({
      testID: 'foo',
    })
  const foo = r(
    <ThemeProvider theme={theme}>
      <Foo />
    </ThemeProvider>
  ).toJSON()

  expect(foo.props.style).toEqual({ backgroundColor: '#193bc3' })
  expect(foo.props.testID).toBe('foo')
})

it('keeps the context theme through withComponent()', () => {
  const Foo = s.View(({ theme }) => ({ backgroundColor: theme.fancyColor }))
  const Bar = Foo.withComponent(s.Text())
  const bar = r(
    <ThemeProvider theme={theme}>
      <Bar />
    </ThemeProvider>
  ).toJSON()

  expect(bar.props.style).toEqual({ backgroundColor: '#193bc3' })
})

it('keeps the context theme through withChild()', () => {
  const ButtonText = s.Text(({ theme }) => ({ color: theme.fancyColor }))
  const Button = s
    .View(({ theme }) => ({ backgroundColor: theme.fancyColor }))
    .withChild(ButtonText)
  const button = r(
    <ThemeProvider theme={theme}>
      <Button>hi</Button>
    </ThemeProvider>
  ).toJSON()

  expect(button.props.style).toEqual({ backgroundColor: '#193bc3' })
  expect(button.children[0].props.style).toEqual({ color: '#193bc3' })
})

it('resolves the closest provider when nested', () => {
  const Foo = s.View(({ theme }) => ({ backgroundColor: theme.fancyColor }))
  const foo = r(
    <ThemeProvider theme={theme}>
      <ThemeProvider theme={{ fancyColor: 'green' }}>
        <Foo />
      </ThemeProvider>
    </ThemeProvider>
  ).toJSON()

  expect(foo.props.style).toEqual({ backgroundColor: 'green' })
})

it('exposes the context theme through useTheme()', () => {
  let seen
  const Probe = () => {
    seen = useTheme()
    return null
  }

  r(
    <ThemeProvider theme={theme}>
      <Probe />
    </ThemeProvider>
  )

  expect(seen).toBe(theme)
})

it('returns undefined from useTheme() without a provider', () => {
  let seen = 'sentinel'
  const Probe = () => {
    seen = useTheme()
    return null
  }

  r(<Probe />)

  expect(seen).toBeUndefined()
})

it('re-renders function-styled components on theme change but not static ones', () => {
  let staticRenders = 0
  let dynamicRenders = 0

  const Static = s.View({ width: 1 })
  const Dynamic = s.View(({ theme }) => ({ backgroundColor: theme.fancyColor }))

  // stable element identity, so only context subscribers re-render on theme change
  const content = (
    <View>
      <Static />
      <Dynamic />
    </View>
  )

  const Root = () => {
    const [current, setTheme] = useState(theme)
    Root.setTheme = setTheme
    return <ThemeProvider theme={current}>{content}</ThemeProvider>
  }

  let root
  act(() => {
    root = r(<Root />)
  })

  // spy on re-renders by wrapping createElement
  const originalCreateElement = React.createElement
  React.createElement = (...args) => {
    if (args[0] === View) {
      if (args[1]?.style?.width === 1) staticRenders++
      if (args[1]?.style?.backgroundColor) dynamicRenders++
    }

    return originalCreateElement(...args)
  }

  act(() => {
    Root.setTheme({ fancyColor: 'green' })
  })

  React.createElement = originalCreateElement

  expect(staticRenders).toBe(0)
  expect(dynamicRenders).toBe(1)

  const tree = root.toJSON()
  expect(tree.children[1].props.style).toEqual({ backgroundColor: 'green' })
})

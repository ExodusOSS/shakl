
const rn = process.env.TARGET === 'react-native';

const external = ['react', rn && 'react-native'];
const input = rn ? 'src/index.js' : 'src/styled.js';
const file = rn ? 'lib/rn.js' : 'lib/index.js';

module.exports = {
  external,
  input,
  output: { file, format: 'cjs', exports: 'named' },
}

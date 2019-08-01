// ESLint configuration
// http://eslint.org/docs/user-guide/configuring
module.exports = {
  parser: 'babel-eslint',

  extends: ['airbnb', 'prettier', 'prettier/react'],

  plugins: ['prettier'],

  env: {
    browser: true
  },

  rules: {
    // Prefer destructuring from arrays and objects
    // http://eslint.org/docs/rules/prefer-destructuring
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true
        },
        AssignmentExpression: {
          array: false,
          object: false
        }
      },
      {
        enforceForRenamedProperties: false
      }
    ],
    // Don't require props to be destructured, eg. this.props.x vs const { x } = this.props
    'react/destructuring-assignment': false,
    // Don't require prop types for each prop.
    'react/prop-types': false,
    // Don't require default props for props which are not required.
    'react/require-default-props': false
  }
};
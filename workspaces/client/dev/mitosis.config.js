module.exports = {
  files: 'src/**',
  dest: '../../packages/client',
  targets: [
    // 'vue3', 'solid', 
    'svelte', 
    'react'
  ],
  options: {
    svelte: {},
    react: {},
  },
  // getTargetPath: (args) => {
  //   console.log(args)
  //   const { target } = args
  //   return target
  // },

};
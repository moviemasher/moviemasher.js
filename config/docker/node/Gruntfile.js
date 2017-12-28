/*global module:false*/
module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - '+
          '<%= grunt.template.today("yyyy-mm-dd") %>\n'+
          '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
          ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n' +
          '/*global module:true,define:true*/\n' +
          '(function (name, context, definition) { \n' +
          "'use strict';\n" +
          'if (typeof module !== "undefined" && module.exports) module.exports = definition(); \n' +
          'else if (typeof define === "function" && define.amd) define(definition); \n' +
          'else context[name] = definition(); \n' +
          '  })("MovieMasher", this, function() { \n'+
          "'use strict';\n" ,
        footer: 'return MovieMasher; \n}); \n'
      },
      moviemasher: {
        src: ['src/moviemasher.js', 'src/others/*.js'],
        dest: 'dist/<%= pkg.name %>'
      }
    },
    copy: {
      filters: {
        expand: true,
        cwd: 'src/filters',
        src: ['**'],
        dest: 'dist/filters/',
      },
    },
    jshint: {
      options: {
        "-W086": true, /* allow fall through in switches */
        curly: false,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: false,
        eqnull: true,
        evil: true,
        browser: true,
        devel: true,
        globalstrict: true,
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      filters: {
        expand: true,
        src: 'src/filters/*.js'
      },
      moviemasher: {
        src: '<%= concat.moviemasher.dest %>'
      },
      app: {
        src: 'app/app.js'
      },
    },
    uglify: {
      moviemasher: {
        src: '<%= concat.moviemasher.dest %>',
        dest: 'dist/moviemasher.min.js'
      },
      filters: {
        files: [{
          expand: true,
          src: '**/*.js',
          ext: '.min.js',
          cwd: 'src/filters',
          dest: 'dist/filters/'
        }]
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['concat', 'jshint', 'uglify', 'copy']);
};

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      build: ['Gruntfile.js', 'public/src/**/*.js', 'index.js', 'app/*.js', 'app/models/*.js']
    },
    uglify: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'public/dist/JS/main.min.js': 'public/src/JS/main.js',
          'public/dist/JS/calendar.min.js': 'public/src/JS/calendar.js',
          'public/dist/JS/accordion.min.js': 'public/src/JS/accordion.js',
          'public/dist/JS/spreadsheet.min.js': 'public/src/JS/spreadsheet.js',
          'public/dist/JS/counter.min.js': 'public/src/JS/counter.js',
          'public/dist/JS/pricing.min.js': 'public/src/JS/pricing.js',
        }
      }
    },
    imagemin: {

      dynamic: {
        files: [{
          expand: true,
          cwd: 'public/',
          src: ['Graphics/*.{png,jpg,gif}'], // Actual patterns to match
          dest: 'public/dist' // Destination path prefix
        }]
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'public/src/SCSS',
          cssDir: 'public/dist/CSS'
        }
      }
    },
    watch: {
      css: {
        files: 'public/src/SCSS/*.scss',
        tasks: ['compass']
      },
      js: {
        files: "public/src/JS/*.js",
        tasks: ['uglify']
      }
    },
    pug: {
      compile: {
        files: {
          'contact.html': 'views/contact.pug',
          'faqs.html': 'views/faqs.pug',
          'index.html': 'views/index.pug',
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-pug');

  grunt.registerTask('default', ['uglify', 'jshint', 'pug', 'imagemin', 'watch', 'compass']);
};

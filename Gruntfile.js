module.exports = function (grunt) {

    grunt.initConfig({

        // Import package manifest
        pkg: grunt.file.readJSON("eyekit.jquery.json"),


        // Concat definitions
        concat: {
            dist: {
                files: {
                    'dist/jquery.eyekit.js': ["vendor/underscore.js", "src/eyekit.hoverclick.js"],
                    'dist/jquery.eyekit.css': ['css/eyekit.hoverclick.css']
                }
            }
        },

        sass: {
            dist: {
                files: {
                    'dist/eyekit.hoverclick.css': 'css/eyekit.hoverclick.scss'
                }
            }
        },

        // Minify definitions
        uglify: {
            my_target: {
                src: ["dist/jquery.eyekit.js"],
                dest: "dist/jquery.eyekit.min.js"
            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-sass');


    grunt.registerTask("default", ["sass", "concat", "uglify"]);
    grunt.registerTask("travis", ["jshint"]);

};

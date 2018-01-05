var forever = require('forever-monitor'),
    child = new(forever.Monitor)('manager/queue_manager.js', {
        'silent': false,
	//'max': 10,                  // Sets the maximum number of times a given script should run
        'pidFile': 'pids/app.pid',
        'watch': true,
        'watchDirectory': '.',         // Top-level directory to watch from.
        'watchIgnoreDotFiles': true,   // whether to ignore dot files
        'watchIgnorePatterns': ['**/public/static/**', '**/logs/**'],     // array of glob patterns to ignore, merged with contents of watchDirectory + '/.foreverignore' file
        'logFile': 'logs/jobs.log', // Path to log output from forever process (when daemonized)
        'outFile': '/dev/null',        // Path to log output from child stdout
        'errFile': 'logs/jobs.err'
    });
child.start();

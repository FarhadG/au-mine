var au = require('../index');

au.src([
  'http://www.google.com',
  'http://www.yahoo.com',
  'http://www.bing.com'
])
  .pipe(au.dest('./output'));

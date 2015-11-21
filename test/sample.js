var au = require('../index');
var rename = require('../lib/au-rename');

au.src([
  'http://www.google.com',
  'http://www.yahoo.com',
  'http://www.bing.com'
])
  .pipe(rename(['google', 'yahoo', 'bing']))
  .pipe(au.dest('./output'));

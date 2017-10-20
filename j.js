const fetch = require('node-fetch');
const _ = require('lodash');

const stubbedFetch = async () => ({
  status: 200,
  json: async () => ({
    id:  6300,
    login: 'ehrenmurdick',
    url: "http://github.com/users/ehrenmurdick"
  })
});

const liftM = f => async (...as) => {
  let vs = await Promise.all(as);
  return f(...vs);
}

const get = liftM(_.get);

const url = "https://jsonplaceholder.typicode.com/users/"
const prop = liftM((a, s) => a[s]);

const getter = s => a => a[s]();

const compose = (...fns) => {
  const step = (f, g) => x => f(g(x));
  return fns.reduce((a, b) => step(a, b));
}

const consUrl = user => url + user

const join_ = liftM((s, ...as) => as.join(s));

const getJson = compose(
  liftM(getter('json')),
  fetch
);

const cat = liftM((a, b) => a + b);

const consoleLog = liftM(console.log);

let user       = getJson("https://jsonplaceholder.typicode.com/users/2")
let userString = join_('\n',
  cat("id:       ", get(user, 'id')),
  cat("name:     ", get(user, 'name')),
  cat("username: ", get(user, 'username')),
  cat("street:   ", get(user, 'address.street'))
);
consoleLog(userString);

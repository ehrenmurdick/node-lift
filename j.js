const lift = f => async (...as) => {
  let vs = await Promise.all(as);
  return f(...vs);
}

const fetch = lift(require('node-fetch'));
const _ = require('lodash');

const stubbedFetch = async () => ({
  status: 200,
  json: async () => ({
    id:  6300,
    login: 'ehrenmurdick',
    url: "http://github.com/users/ehrenmurdick"
  })
});


const get = lift(_.get);

const url = "https://jsonplaceholder.typicode.com/users/"
const prop = lift((a, s) => a[s]);

const getter = s => a => a[s]();

const compose = (...fns) => {
  const step = (f, g) => x => f(g(x));
  return fns.reduce((a, b) => step(a, b));
}

const consUrl = user => url + user

const join = lift((s, ...as) => as.join(s));

const getJson = compose(
  lift(getter('json')),
  fetch
);

const cat        = lift((...as) => as.reduce((l, r) => l + r));
const consoleLog = lift(console.log);
const toJSON     = lift(JSON.stringify);

let book = getJson("http://localhost:3000/books/101");
let author = getJson(get(book, "links.author"));
consoleLog(get(author, "name"));


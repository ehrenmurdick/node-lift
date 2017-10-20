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
let book2 = getJson("http://localhost:3000/books/102");
let author = getJson(get(book, "links.author"));

consoleLog(cat(
  get(book, 'title'),
  ' and ',
  get(book2, 'title'),
  ' by ',
  get(author, 'name')
));
